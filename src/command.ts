import {fillBlocks} from "./blockfiller"
import * as yargs from 'yargs'

const argv = yargs
    .usage('Usage: $0 [options]')
    .option('jobfilepath', {
        desc: 'Path to input file.',
        demandOption: true,
        type: 'string',
        alias: ["j", "f"],
        default: undefined
    })
    .option('accountfilepath', {
        desc: 'Path to an account file containing addresses and private keys. These can be used as "from" accounts and signing the transactions locally.',
        demandOption: false,
        type: 'string',
        alias: ["a"],
        default: undefined
    })
    .argv

fillBlocks(argv)