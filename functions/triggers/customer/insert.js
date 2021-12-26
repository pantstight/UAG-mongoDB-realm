exports = async function (changeEvent) {
    const doc = changeEvent.fullDocument;
    const { _id, Country_Code, Distributor, Channel } = doc;
    if ((await context.functions.execute('helpers/customer/find', Country_Code, Distributor, Channel)).length > 1) {
        context.functions.execute('helpers/generic/delete', 'customer', _id, 'insert');
        throw new Error(`Duplicate Insert: customer with _id: ${_id} deleted`);
    } else if (!(await context.functions.execute('helpers/customer/find_gen_rep', Country_Code, Distributor)).length) {
        const gRId = (await context.services.get('mongodb-atlas').db('master').collection('customer_master').insertOne({
            'Country_Code': Country_Code,
            'Distributor': Distributor,
            'Channel': '',
            'Channel_Type': '',
            'source': 'Trigger(customer_insert)',
            'numAssociatedSales': 0
        })).insertedId;
        console.log(`Customers with Country_Code: ${Country_Code} and Distributor: ${Distributor} can now be generically represented with customer with _id: ${gRId}`);
    }
};