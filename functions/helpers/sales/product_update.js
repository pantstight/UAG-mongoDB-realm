exports = async function (curr) {
    const { productCurr, productPrev } = await context.functions.execute(
        'helpers/sales/checkout',
        'product',
        curr.productId,
        curr.updatedFieldsBeforeChange);
    const customer = (await context.functions.execute(
        'helpers/generic/find_with_id',
        'customer_master',
        curr.customerId))[0];
    await context.functions.execute(
        'helpers/sales/indirect_update',
        curr.Year, curr.Month,
        customer, productCurr,
        customer, productPrev,
        curr._id, curr.source,
        curr.updatedFieldsAfterChange);
};