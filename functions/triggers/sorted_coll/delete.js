exports = async function (_id, Year, Month, customerId) {
    const sortedCollName = `${Year}_${Month}_${customerId.valueOf()}`;
    context.services.get('mongodb-atlas').db('master').collection(sortedCollName).deleteOne({ '_id': _id });
    console.log(`Deleted sales with _id: ${_id}'s clone from ${sortedCollName}`);
};