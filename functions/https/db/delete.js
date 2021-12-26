exports = async function (payload, response) {
    payload = EJSON.parse(payload.body.text());
    const type = payload.type;
    const documents = payload.contents;
    const coll = context.services.get('mongodb-atlas').db('master').collection(`${type}_master`);
    const updates = [];
    const deletes = [];
    for (const doc of documents) {
        const query = { '_id': BSON.ObjectId(doc.ObjectId) };
        updates.push({ 'updateOne': { 'filter': query, 'update': { '$set': { 'source': `Webhook(${type}_delete)` } }, 'upsert': false } });
        deletes.push({ 'deleteOne': { 'filter': query } });
    }
    await coll.bulkWrite(updates, { 'ordered': false });
    await coll.bulkWrite(deletes, { 'ordered': false });
    response.setBody(EJSON.stringify(new Array(documents.length).fill('completed')));
};
