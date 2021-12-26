exports = async function (doc, srcTag) {
    await context.services.get('mongodb-atlas').db('master').collection('sales_master').updateOne(
        { '_id': doc._id }, { '$set': doc }, {});
    await context.functions.execute('helpers/sales/insert', doc, srcTag);
};