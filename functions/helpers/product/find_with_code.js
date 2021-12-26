exports = function (UPC, SKU, SKU_JP) {
    const query = {};
    if (UPC) {
        query.UPC = UPC;
    } else if (SKU) {
        query.SKU = SKU;
    } else if (SKU_JP) {
        query.SKU_JP = SKU_JP;
    }
    return context.services.get('mongodb-atlas').db('master').collection('product_master').find(query).toArray();
};