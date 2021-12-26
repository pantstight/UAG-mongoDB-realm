exports = async function (doc) {
    const { _id, Year, Month, customerId } = doc;
    const sortedCollName = `${Year}_${Month}_${customerId.valueOf()}`;
    const insertedId =
        (await context.services.get('mongodb-atlas').db('master').collection(sortedCollName).insertOne(doc)).insertedId;
    console.log(`Cloned sales with _id: ${_id} as ${insertedId} to ${sortedCollName}`);
};