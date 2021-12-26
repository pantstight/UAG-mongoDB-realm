exports = async function (changeEvent) {
    const master = context.services.get('mongodb-atlas').db('master');
    const _id = changeEvent.documentKey._id;
    const prev = changeEvent.fullDocumentBeforeChange;
    const { UPC, SKU, SKU_JP } = changeEvent.fullDocument;
    const src = 'Trigger(product_update)';
    if ((await context.functions.execute('helpers/product/find_identical', UPC, SKU, SKU_JP)).length > 1) {
        prev.source = src;
        await master.collection('product_master').updateOne({ '_id': _id }, { '$set': prev }, {});
        throw new Error(`Duplicate: update on product with _id: ${_id} reverted`);
    } else {
        await master.collection('sales_master').updateMany(
            { 'productId': _id },
            {
                '$set': {
                    'UPC': UPC,
                    'SKU': SKU,
                    'SKU_JP': SKU_JP,
                    'source': src,
                    'updatedFieldsBeforeChange':
                        context.functions.execute(
                            'helpers/generic/updated_fields_before_change',
                            prev,
                            changeEvent.updateDescription.updatedFields),
                    'updatedFieldsAfterChange':
                        changeEvent.updateDescription.updatedFields
                }
            },
            {}
        )
        console.log(`Triggered update on all sales entry(s) with productId: ${_id} in sales_master`);
    }
};