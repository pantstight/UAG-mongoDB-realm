exports = async function (changeEvent) {
    const { _id, UPC, SKU, SKU_JP } = changeEvent.fullDocument;
    if ((await context.functions.execute('helpers/product/find_identical', UPC, SKU, SKU_JP)).length > 1) {
        context.functions.execute('helpers/generic/delete', 'product', _id, 'insert');
        throw new Error(`Duplicate Insert: product with _id: ${_id} deleted`);
    }
};