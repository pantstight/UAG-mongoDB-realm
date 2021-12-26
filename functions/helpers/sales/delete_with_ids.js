exports = async function (prev, srcTag) {
    const customer = (await context.functions.execute(
        'helpers/generic/find_with_id', 'customer_master', prev.customerId))[0];
    const product = (await context.functions.execute(
        'helpers/generic/find_with_id', 'product_master', prev.productId))[0];
    return context.functions.execute(
        'helpers/sales/delete', prev._id, prev.Year, prev.Month, customer, product, srcTag);
};