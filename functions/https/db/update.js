exports = async function (payload, response) {
    payload = EJSON.parse(payload.body.text());
    const type = payload.type;
    const documents = payload.contents;
    const updates = [];
    for (const doc of documents) {
        const id = BSON.ObjectId(doc.ObjectId)
        delete doc.ObjectId;
        doc.source = `Webhook(${type}_update)`;
        updates.push({ 'updateOne': { 'filter': { '_id': id }, 'update': { '$set': doc }, 'upsert': false } });
    }
    await context.services.get('mongodb-atlas').db('master').collection(`${type}_master`).bulkWrite(updates, { 'ordered': false });
    response.setBody(EJSON.stringify(new Array(documents.length).fill('completed')));
}
