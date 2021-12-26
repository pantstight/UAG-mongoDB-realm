exports = async function (coll, _id, src) {
    const collection = context.services.get('mongodb-atlas').db('master').collection(`${coll}_master`);
    const query = { '_id': _id };
    await collection.updateOne(query, { '$set': { 'source': `Trigger(${coll}_${src})` } }, {});
    await collection.deleteOne(query);
};