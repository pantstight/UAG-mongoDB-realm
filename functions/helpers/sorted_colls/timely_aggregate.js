exports = async function (payload, timeUnit) {
    payload = EJSON.parse(payload.body.text());
    const master = context.services.get('mongodb-atlas').db('master');
    const queries = payload.queries;
    const arr = [];
    for (const query of queries) {
        const obj = {};
        for (const qy of query) {
            const { matchArgs, Year, Month, grpArgs } = qy;
            const customerId = (await master.collection('customer_master').find(matchArgs, { '_id': 1 }).toArray())[0]._id;
            const res = await master.collection(`${Year}_${Month}_${customerId}`).aggregate([
                {
                    '$lookup': {
                        'from': 'product_master',
                        'localField': 'productId',
                        'foreignField': '_id',
                        'as': 'res'
                    }
                },
                { '$replaceRoot': { 'newRoot': { '$mergeObjects': [{ '$arrayElemAt': ['$res', 0] }, '$$ROOT'] } } },
                { '$project': { 'res': 0 } },
                { '$group': grpArgs }
            ]).toArray();
            for (const r of res) {
                const { _id, totalQty } = r;
                switch (timeUnit) {
                    case 'Year':
                        if (_id in obj) {
                            obj[_id] += totalQty;
                        } else {
                            obj[_id] = totalQty;
                        }
                        break;
                    case 'Month':
                        if (_id in obj) {
                            if (Month in obj[_id]) {
                                obj[_id][Month] += totalQty;
                            } else {
                                obj[_id][Month] = totalQty;
                            }
                        } else {
                            obj[_id] = { [Month]: totalQty };
                        }
                        break;
                }
            }
        }
        arr.push(obj);
    }
    return EJSON.stringify(arr);
};