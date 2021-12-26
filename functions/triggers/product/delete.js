exports = async function (changeEvent) {
    const prev = changeEvent.fullDocumentBeforeChange;
    if (prev.numAssociatedSales) {
        prev.source = 'Trigger(product_delete)';
        await context.services.get('mongodb-atlas').db('master').collection('product_master').insertOne(prev);
        throw new Error(`Nonzero numAssociatedSales: product with _id: ${prev._id} recovered`);
    }
};