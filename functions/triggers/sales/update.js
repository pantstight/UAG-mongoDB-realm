exports = function (changeEvent) {
    const curr = changeEvent.fullDocument;
    const prev = changeEvent.fullDocumentBeforeChange;
    const src = curr.source;
    curr.source = 'Trigger(sales_update)';
    switch (src) {
        case 'Webhook(sales_update)':
            prev.source = 'Trigger(sales_update)';
            context.functions.execute(
                'helpers/sales/direct_update',
                curr, prev);
            break;
        case 'Trigger(customer_update)':
            context.functions.execute(
                'helpers/sales/customer_update',
                curr, prev);
            break;
        case 'Trigger(product_update)':
            context.functions.execute(
                'helpers/sales/product_update',
                curr, prev);
            break;
    }
};