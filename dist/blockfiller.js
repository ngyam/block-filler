"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const Web3 = require('web3');
const ContractFastJSON = JSON.parse(fs.readFileSync(__dirname + '/../build/contracts/FastFiller.json', 'utf-8'));
const ContractSlowJSON = JSON.parse(fs.readFileSync(__dirname + '/../build/contracts/SlowFiller.json', 'utf-8'));
function fillBlocks(vargs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!vargs.f) {
            throw ("You have to provide a task/job file as an input");
        }
        const task = {
            jobs: JSON.parse(fs.readFileSync(path.resolve(vargs.f), 'utf-8')),
            accounts: vargs.a ? JSON.parse(fs.readFileSync(path.resolve(vargs.a), 'utf-8')) : undefined
        };
        start(task);
    });
}
exports.fillBlocks = fillBlocks;
function start(task) {
    return __awaiter(this, void 0, void 0, function* () {
        task.jobs.forEach((job) => __awaiter(this, void 0, void 0, function* () {
            let web3 = new Web3(job.rpc);
            job["web3"] = web3;
            const id = yield web3.eth.net.getId();
            console.log(id);
            if (task.accounts) {
                task.accounts.map(acc => web3.eth.accounts.wallet.add(acc));
            }
            let toAddress;
            if (job.slow) {
                if (id == 401697) {
                    toAddress = "0xCBc07526cd24060EE2593FC75e01920bE31944c3";
                }
                else {
                    toAddress = ContractSlowJSON['networks'][id.toString()]["address"];
                }
                job['contract'] = new web3.eth.Contract(ContractSlowJSON.abi, toAddress);
                job.tx['data'] = job.contract.methods.loop().encodeABI();
            }
            else {
                if (id == 401697) {
                    toAddress = "0x449Fc4668f15d23C12Af8D94DBBf818D8BD40f16";
                }
                else {
                    toAddress = ContractFastJSON['networks'][id.toString()]["address"];
                }
                job['contract'] = new web3.eth.Contract(ContractFastJSON.abi, toAddress);
                job.tx['data'] = job.contract.methods.loop_ripemd160_1().encodeABI();
            }
            job.tx['to'] = web3.utils.toChecksumAddress(toAddress);
            if (job.once) {
                yield fire(job);
                return;
            }
            while (true) {
                yield fire(job);
            }
        }));
    });
}
function fire(job) {
    return __awaiter(this, void 0, void 0, function* () {
        let nonce = yield job.web3.eth.getTransactionCount(job.tx.from);
        let retval = [];
        if (job.noWaitForAll) {
            let x = new Array(job.batchNum).fill(nonce).map((x, i) => {
                let newtx = JSON.parse(JSON.stringify(job.tx));
                newtx["nonce"] = x + i;
                let promise = job.web3.eth.sendTransaction(newtx);
                if (i % 1000 == 0)
                    console.log(i);
                return promise;
            });
            return x;
        }
        let batch = new Array(job.batchNum).fill(nonce).map((x, i) => {
            let newtx = JSON.parse(JSON.stringify(job.tx));
            newtx["nonce"] = x + i;
            return job.web3.eth.sendTransaction(newtx);
        });
        try {
            retval = yield Promise.all(batch);
        }
        catch (error) {
            console.error(error);
        }
        retval.map(rec => {
            try {
                console.log({
                    blockNumber: rec.blockNumber,
                    gasUsed: rec.gasUsed,
                    transactionHash: rec.transactionHash
                });
            }
            catch (error) {
                console.error("RESULT ERROR: " + rec);
            }
        });
    });
}
//# sourceMappingURL=blockfiller.js.map