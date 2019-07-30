# Block filler

A simple command line tool for spamming ethereum nodes with block filling transactions using deployed smart contracts.

## Install

```bash
npm install -g block-filler
```

## Quickstart

```bash
> blockfiller --help
Usage: blockfiller [options]

Options:
  --help                 Show help                                     [boolean]
  --version              Show version number                           [boolean]
  --jobfilepath, -j, -f  Path to input file.                 [string] [required]
  --accountfilepath, -a  Path to an account file containing addresses and
                         private keys. These can be used as "from" accounts and
                         signing the transactions locally.              [string]

```
## Jobs
The script works with jobs given as input. They are specified in a JSON file as objects in an array:
- rpc (`string`): the rpc endpoint of an ethereum node,
- batchNum (`num`): how many transactions are sent at once
- tx (`object`): transaction object as in [web3](https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html?highlight=transaction#sendtransaction)
  - The blocks will be filled up ~ the specified `gas` limit
  - Nonces are set in the script
- slow (`bool`): whether to fill the blocks with more time consuming slow operations or relatively overpriced fast ones (default: fast)
- once (`bool`) whether to execute job only once or run it in an infinite loop
- noWaitForAll (`bool`) whether to wait until the whole batch is mined or not
- 
See an example below.
## Example
```
blockfiller -f ./jobs.json -a ./accounts.json
```

Example content of a jobs file (`jobs.json`):
```json
[
    {
        "rpc": "http://localhost:8545",
        "batchNum": 10,
        "tx": {
            "from": "0xb5ee8b57b0519a32b9c6d9689bc645f3edf51302",
            "gas": 7999000,
            "gasPrice": 61
        },
        "once": true
    },
    {
        "rpc": "https://volta-rpc.energyweb.org",
        "batchNum": 1,
        "tx": {
            "from": "0xb5125eb59b200e36cf06adb57ea948ac9e6202a0",
            "gas": 7999000,
            "gasPrice": 200
        },
        "slow": true
    },
    {
        "rpc": "https://tobalaba-rpc.energyweb.org",
        "batchNum": 1,
        "tx": {
            "from": "0xb5125eb59b200e36cf06adb57ea948ac9e6202a0",
            "gas": 1000000,
            "gasPrice": 1000000000
        },
        "noWaitForAll": true
    }
]
```

Example content of accounts file (`accounts.json`). These are added to web3's software wallet and used for signing locally:

```json
[
    {
        "address": "0xb5ee8b57b0519a32b9c6d9689bc645f3edf51302",
        "privateKey": "0x..."
    },
    {
        "address": "0xb5125eb59b200e36cf06adb57ea948ac9e6202a0",
        "privateKey": "0x..."
    }
]
```

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## Versioning
[SemVer](http://semver.org/) is used for versioning. For the versions available, see the [tags on this repository](https://github.com/ngyam/block-filler/tags). 

## License

This project is licensed under the GPLv3.0 License - see the [LICENSE.md](LICENSE.md) file for details.
