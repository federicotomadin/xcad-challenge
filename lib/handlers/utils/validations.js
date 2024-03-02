import { validation } from '@zilliqa-js/util';
export const isBase16Address = (address) => {
    try {
        return validation.isAddress(address);
    }
    catch (error) {
        return false;
    }
};
//# sourceMappingURL=validations.js.map