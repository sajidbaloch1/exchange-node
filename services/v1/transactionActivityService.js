import Transaction from "../../models/v1/Transaction.js";

const createTransaction = async ({
    points,
    balancePoints,
    type,
    remark,
    userId,
    fromId,
    fromtoName
}) => {
    try {
        const userTransaction = new Transaction({
            points,
            balancePoints,
            type,
            remark,
            userId,
            fromId,
            fromtoName
        });
        await userTransaction.save();
        return userTransaction;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default { createTransaction };
