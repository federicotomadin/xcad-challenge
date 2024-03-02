/**
 * Query Contract Balances from the Zilliqa Chain
 *
 * Use the "@zilliqa-js/zilliqa" package to query the defined contract below and get the state.
 * The state will return all mutable fields on a smart contract and their current values.
 *
 * Modify the handler below to accept an "address" string.
 * The address can either be Bech32 or Base16 format (see Zilliqa for more details)
 * Query the defined contract below to get the current state.
 * Find and return the balance of the "address".
 */

import 'source-map-support/register';
import {APIGatewayProxyEvent, APIGatewayProxyHandler} from 'aws-lambda';
import {bodyRequest, ContractState} from '../types/balance';
import {CustomError} from './utils/customError';
import {Zilliqa} from '@zilliqa-js/zilliqa';
import {isBase16Address} from './utils/validations';
import {fromBech32Address} from '@zilliqa-js/crypto';

const zilliqa = new Zilliqa('https://api.zilliqa.com');
const tokenAddress = 'zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
  try {
    // get the address from the request body
    const body = JSON.parse(event.body) as bodyRequest;
    let {address} = body;

    // if the address is not provided
    if (!address) {
      throw new CustomError('Missing \'address\' parameter', 400);
    }

    // convert the address in a valid Base16 format
    if (!isBase16Address(address)) {
      try {
        address = fromBech32Address(address);
      } catch {
        throw new CustomError('Parameter \'address\' has an invalid format, accepted formats: Bech32 or Base16', 400);
      }
    }

    // getting the contract state
    const smartContractState: ContractState = await zilliqa.blockchain.getSmartContractState(tokenAddress);

    // retrieving the balance using the 'address' property received in the request body
    const balances = smartContractState.result.balances;
    const balance = balances[address.toLowerCase()];
    if (!balance) {
      throw new CustomError('Address not found or balance is zero', 404);
    }

    // returning the address with the balance
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Successfully retrieved the balance of the contract',
        data: {
          address,
          balance,
        },
      }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode as number,
      body: JSON.stringify({
        success: false,
        message: 'Failed to retrieve the balance of the contract',
        data: {},
        error: error.message as string,
      }),
    };
  }
};
