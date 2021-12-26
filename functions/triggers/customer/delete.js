exports = async function (changeEvent) {
    const prev = changeEvent.fullDocumentBeforeChange;
    if (prev.numAssociatedSales) {
        prev.source = 'Trigger(customer_delete)';
        await context.services.get('mongodb-atlas').db('master').collection('customer_master').insertOne(prev);
        throw new Error(`Nonzero numAssociatedSales: customer with _id: ${prev._id} recovered`);
    } else {
        const res = await context.functions.execute('helpers/customer/find_gen_rep', prev.Country_Code, prev.Distributor);
        if (res.length) {
            const gR = res[0];
            if (!gR.numAssociatedSales) {
                context.functions.execute('helpers/generic/delete', 'customer', gR._id, 'delete');
                console.log(`Triggered deletion for generic customer with _id: ${gR._id}, Country_Code: ${gR.Country_Code}, and Distributor: ${gR.Distributor}`);
            }
        }
    }
};