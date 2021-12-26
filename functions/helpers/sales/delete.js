exports = async function (_id, Year, Month, customer, product, srcTag) {
    await context.functions.execute(
        'triggers/sorted_coll/delete',
        _id, Year, Month, customer._id);
    await context.functions.execute(
        'triggers/customer_product/change_numAssociatedSales',
        customer._id, product._id, -1, srcTag);
    return context.functions.execute(
        'triggers/summary/prune', Year, Month, customer, product);
};