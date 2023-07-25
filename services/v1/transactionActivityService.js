import Transaction from "../../models/v1/Transaction.js";

const createTransaction = async ({
    points,
    balancePoints,
    type,
    remark,
    fromId,
    toId,
    fromtoName
}) => {
    try {
        const userTransaction = new Transaction({
            points,
            balancePoints,
            type,
            remark,
            fromId,
            toId,
            fromtoName
        });
        await userTransaction.save();
        return userTransaction;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default { createTransaction };
