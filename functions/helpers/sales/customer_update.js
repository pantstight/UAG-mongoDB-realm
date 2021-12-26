exports = async function (curr) {
    const { customerCurr, customerPrev } = await context.functions.execute(
        'helpers/sales/checkout',
        'customer',
        curr.customerId,
        curr.updatedFieldsBeforeChange);
    const product = (await context.functions.execute(
        'helpers/generic/find_with_id',
        'product_master',
        curr.productId))[0];
    await context.functions.execute(
        'helpers/sales/indirect_update',
        curr.Year, curr.Month,
        customerCurr, product,
        customerPrev, product,
        curr._id, curr.source,
        curr.updatedFieldsAfterChange);
};