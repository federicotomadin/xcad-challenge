import { validation } from '@zilliqa-js/util';

/**
 * Checks if the given address is in Base16 format.
 * @param address The address to validate.
 * @returns true if the address is in Base16 format, false otherwise.
 */
export const isBase16Address = (address: string):boolean => {
  try {
    return validation.isAddress(address);
  } catch (error) {
    return false;
  }
};
