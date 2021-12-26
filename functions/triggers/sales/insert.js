exports = async function (changeEvent) {
    const isValid = await context.functions.execute(
        'helpers/sales/update_customer_and_product_in_sales',
        changeEvent.fullDocument);
    if (isValid) {
        const { doc, customer, product } = isValid;
        doc.source = 'Trigger(sales_insert)';
        context.functions.execute('helpers/sales/set_then_insert', doc, 'insert');
        context.functions.execute('triggers/summary/grow', doc.Year, doc.Month, customer, product);
    } else {
        const _id = changeEvent.documentKey._id;
        context.functions.execute('helpers/generic/delete', 'sales', _id, 'insert');
        throw new Error(`Bad Insert: sales with _id: ${_id} deleted`);
    }
};