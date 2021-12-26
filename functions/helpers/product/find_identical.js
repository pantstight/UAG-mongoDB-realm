exports = function (UPC, SKU, SKU_JP) {
    const query = {
        '$or': [
            { 'UPC': UPC },
            { 'SKU': SKU }
        ]
    };
    if (SKU_JP.trim()) {
        query['$or'].push({ 'SKU_JP': SKU_JP });
    }
    return context.services.get('mongodb-atlas').db('master').collection('product_master').find(query).toArray();
};