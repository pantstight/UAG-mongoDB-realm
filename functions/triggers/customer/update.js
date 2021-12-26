exports = async function (changeEvent) {
    const master = context.services.get('mongodb-atlas').db('master');
    const customer_master = master.collection('customer_master');
    const _id = changeEvent.documentKey._id;
    const curr = changeEvent.fullDocument;
    const prev = changeEvent.fullDocumentBeforeChange;
    if ((await context.functions.execute(
        'helpers/customer/find',
        curr.Country_Code,
        curr.Distributor,
        curr.Channel)).length > 1
    ) {
        prev.source = 'Trigger(customer_update)';
        await customer_master.updateOne({ '_id': _id }, { '$set': prev }, {});
        throw new Error(`Bad Input: update on customer with _id: ${_id} reverted`);
    } else {
        const sales_master = master.collection('sales_master');
        const gRId = (await context.functions.execute(
            'helpers/customer/find_gen_rep',
            prev.Country_Code,
            prev.Distributor))[0]._id;
        const update = {
            '$set': {
                'Country_Code': curr.Country_Code,
                'Distributor': curr.Distributor,
                'source': 'Trigger(customer_update)'
            }
        };
        await customer_master.updateOne({ '_id': gRId }, update, {});
        update.$set.updatedFieldsBeforeChange = context.functions.execute(
            'helpers/generic/updated_fields_before_change',
            prev,
            changeEvent.updateDescription.updatedFields);
        update.$set.updatedFieldsAfterChange =
            changeEvent.updateDescription.updatedFields;
        await sales_master.updateMany({ 'customerId': gRId }, update, {});
        update.$set.Channel = curr.Channel;
        update.$set.Channel_Type = curr.Channel_Type;
        await sales_master.updateMany({ 'customerId': _id }, update, {});
        console.log(
            `Triggered update on generic customer with _id: ${gRId} and on all sales entry(s) with customerId: ${gRId} or ${_id} in sales_master`);
    }
};