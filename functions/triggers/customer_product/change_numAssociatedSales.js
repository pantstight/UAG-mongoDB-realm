exports = async function (customerId, productId, amount, srcTag) {
    const master = context.services.get('mongodb-atlas').db('master');
    const update = {
        '$inc': { 'numAssociatedSales': amount },
        '$set': { 'source': `Trigger(sales_${srcTag})` }
    };
    await master.collection('customer_master').updateOne({ '_id': customerId }, update, {});
    await master.collection('product_master').updateOne({ '_id': productId }, update, {});
};