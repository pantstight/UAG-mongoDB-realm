exports = async function (sorted_coll_names, products, grpArgs, kGen) {
    const master = context.services.get('mongodb-atlas').db('master');
    const obj = {};
    for (const args of sorted_coll_names) {
        const { Year, Month } = args;
        delete args.Year;
        delete args.Month;
        const customerId = (await master.collection('customer_master').find(args).toArray())[0]._id;
        const res = await master.collection(`${Year}_${Month}_${customerId}`).aggregate([
            { '$match': { 'productId': { '$in': products } } },
            {
                '$lookup': {
                    'from': 'product_master',
                    'localField': 'productId',
                    'foreignField': '_id',
                    'as': 'res'
                }
            },
            { '$replaceRoot': { 'newRoot': { '$mergeObjects': [{ '$arrayElemAt': ['$res', 0] }, '$$ROOT'] } } },
            { '$group': { '_id': grpArgs, 'totalQty': { '$sum': '$Qty' } } }
        ]).toArray();
        for (const r of res) {
            const k = kGen(r._id);
            if (k in obj) {
                obj[k] += r.totalQty;
            } else {
                obj[k] = r.totalQty;
            }
        }
    }
    return obj;
};