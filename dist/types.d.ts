export interface Tx {
    from?: string;
    to?: string;
    data?: string;
    value?: number | string;
    nonce?: number | string;
    gas?: number | string;
    gasPrice?: number | string;
}
export interface Job {
    rpc: string;
    batchNum: number;
    tx?: Tx;
    waitForAll?: boolean;
    once?: boolean;
    slow?: boolean;
    contract?: any;
}
export interface Account {
    privateKey: string;
    address?: string;
}
export interface Task {
    jobs: Job[];
    accounts?: Account[];
}
