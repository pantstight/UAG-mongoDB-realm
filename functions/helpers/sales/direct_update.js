exports = async function (curr, prev) {
    const isValid = await context.functions.execute(
        'helpers/sales/update_customer_and_product_in_sales',
        curr);
    if (isValid) {
        const { doc, customer, product } = isValid;
        await context.functions.execute('triggers/summary/grow', doc.Year, doc.Month, customer, product,
            await context.functions.execute('helpers/sales/delete_with_ids', prev, 'update'));
        await context.functions.execute('helpers/sales/set_then_insert', doc, 'update');
    } else {
        await context.services.get('mongodb-atlas').db('master').collection('sales_master').updateOne(
            { '_id': prev._id }, { '$set': prev }, {});
        throw new Error(`Bad Update: changes on sales with _id: ${prev._id} reverted`);
    }
};