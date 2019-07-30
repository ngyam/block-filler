
import * as fs from 'fs'
import * as path from 'path'
import {Task} from './types'

const Web3 = require('web3')

const ContractFastJSON = JSON.parse(fs.readFileSync(__dirname + '/../build/contracts/FastFiller.json', 'utf-8'))
const ContractSlowJSON = JSON.parse(fs.readFileSync(__dirname + '/../build/contracts/SlowFiller.json', 'utf-8'))


export async function fillBlocks(vargs) {

    if (!vargs.f) {
        throw("You have to provide a task/job file as an input")
    }

    const task = {
        jobs: JSON.parse(fs.readFileSync(path.resolve(vargs.f), 'utf-8')),
        accounts: vargs.a ? JSON.parse(fs.readFileSync(path.resolve(vargs.a), 'utf-8')) : undefined
    }

    start(task)   
}

async function start(task: Task) {
    
    task.jobs.forEach(async (job) => {
        let web3 = new Web3(job.rpc)
        job["web3"] = web3
        const id = await web3.eth.net.getId()
        console.log(id)
        
        if (task.accounts) {
            task.accounts.map(acc => web3.eth.accounts.wallet.add(acc))
        }

        let toAddress
        
        if (job.slow) {
            if (id == 401697) {
                toAddress = "0xCBc07526cd24060EE2593FC75e01920bE31944c3"
            } else {
                toAddress = ContractSlowJSON['networks'][id.toString()]["address"]
            }
            job['contract'] = new web3.eth.Contract(ContractSlowJSON.abi, toAddress)
            job.tx['data'] = job.contract.methods.loop().encodeABI()
        } else {
            if (id == 401697) {
                toAddress = "0x449Fc4668f15d23C12Af8D94DBBf818D8BD40f16"
            } else {
                toAddress = ContractFastJSON['networks'][id.toString()]["address"]
            }
            job['contract'] = new web3.eth.Contract(ContractFastJSON.abi, toAddress)
            job.tx['data'] = job.contract.methods.loop_ripemd160_1().encodeABI()
        }
        job.tx['to'] = web3.utils.toChecksumAddress(toAddress)
        
        if (job.once) {
            await fire(job)
            return
        }

        while (true) {
            await fire(job)  
        }
    })
}

async function fire(job) {
    let nonce = await job.web3.eth.getTransactionCount(job.tx.from)
    let retval = []

    if (job.noWaitForAll) {
        let x = new Array(job.batchNum).fill(nonce).map((x, i) => {
            let newtx = JSON.parse(JSON.stringify(job.tx))
            newtx["nonce"] = x + i
            let promise = job.web3.eth.sendTransaction(newtx)
            if (i % 1000 == 0) console.log(i)
            return promise
        })
        return x
    }

    let batch = new Array(job.batchNum).fill(nonce).map((x, i) => {
        let newtx = JSON.parse(JSON.stringify(job.tx))
        newtx["nonce"] = x + i
        return job.web3.eth.sendTransaction(newtx)
    })
    try {
        retval = await Promise.all(batch)
    } catch (error) {
        console.error(error)
    }
    retval.map(rec => {
        try {
            console.log({
                blockNumber: rec.blockNumber,
                gasUsed: rec.gasUsed,
                transactionHash: rec.transactionHash
            })
        }catch(error) {
            console.error("RESULT ERROR: " + rec)
        }
    })
}
