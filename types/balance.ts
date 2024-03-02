import {ResponseBody} from './response';

export type ContractBalance = {
    [key: string]: string;
}

export type ContractAllowances = {
    [key: string]: ContractBalance
}

export type ContractState = {
    result: {
        _balance: string;
        allowances: ContractAllowances;
        balances: ContractBalance;
        contractowner: string;
        lock_proxy: string;
        total_supply: string;
    }
}

export interface bodyRequest{
    address: string
}

export interface BalanceResponseData{
    address: string,
    balance: string,
}

export interface BalanceResponseBody extends ResponseBody{
    data: BalanceResponseData
}
