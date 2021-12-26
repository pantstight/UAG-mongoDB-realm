exports = async function (payload, response) {
    payload = EJSON.parse(payload.body.text());
    const type = payload.type;
    const documents = payload.contents;
    for (const doc of documents) {
        doc.source = `Webhook(${type}_insert)`;
        if (type === 'customer' || type === 'product') {
            doc.numAssociatedSales = 0;
        }
    }
    response.setBody(
        EJSON.stringify(
            (await context.services.get('mongodb-atlas').db('master').collection(`${type}_master`).insertMany(documents)).insertedIds
        )
    );
}
