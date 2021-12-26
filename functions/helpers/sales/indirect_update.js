exports = async function (Year, Month, growCustomer, growProduct, pruneCustomer, pruneProduct, _id, src, update) {
    update.source = src;
    const master = context.services.get('mongodb-atlas').db('master');
    const query = { '_id': _id };
    await context.functions.execute(
        'triggers/summary/grow', Year, Month, growCustomer, growProduct,
        await context.functions.execute(
            'triggers/summary/prune', Year, Month, pruneCustomer, pruneProduct));
    await master.collection('sales_master').updateOne(
        query,
        {
            '$unset': { 'updatedFieldsBeforeChange': '', 'updatedFieldsAfterChange': '' },
            '$set': { 'source': src }
        },
        {});
    await master.collection(`${Year}_${Month}_${growCustomer._id.valueOf()}`).updateOne(
        query, { '$set': update }, {});
};