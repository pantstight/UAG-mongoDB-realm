exports = async function (payload, response) {
    payload = EJSON.parse(payload.body.text());
    const master = context.services.get('mongodb-atlas').db('master');
    const { type, queries } = payload;
    const arr = [];
    for (const qy of queries) {
        const { timeArgs, customerArgs, productArgs, projectArgs } = qy;
        const customerId = (await master.collection('customer_master').find(customerArgs).toArray())[0]._id;
        const productIds = [];
        for (const product of (await master.collection('product_master').find(productArgs).toArray())) {
            productIds.push(product._id);
        }
        const coll = master.collection(`${timeArgs.Year}_${timeArgs.Month}_${customerId}`);
        const pip = [
            { '$match': { 'productId': { '$in': productIds } } },
            {
                '$lookup': {
                    'from': 'product_master',
                    'localField': 'productId',
                    'foreignField': '_id',
                    'as': 'res'
                }
            },
            { '$replaceRoot': { 'newRoot': { '$mergeObjects': [{ '$arrayElemAt': ['$res', 0] }, '$$ROOT'] } } },
            {
                '$project': {
                    'res': 0,
                    'customerId': 0,
                    'productId': 0,
                    'numAssociatedSales': 0,
                    'source': 0
                }
            }
        ];
        if (type === 'group') {
            pip.push({ '$group': qy.groupArgs });
        }
        pip.push({ '$project': projectArgs });
        arr.push(await coll.aggregate(pip).toArray());
    }
    response.setBody(EJSON.stringify(arr));
};
