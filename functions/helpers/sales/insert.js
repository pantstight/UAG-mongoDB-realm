exports = async function (doc, srcTag) {
    await context.functions.execute('triggers/sorted_coll/insert', doc);
    await context.functions.execute(
        'triggers/customer_product/change_numAssociatedSales',
        doc.customerId, doc.productId, 1, srcTag);
};