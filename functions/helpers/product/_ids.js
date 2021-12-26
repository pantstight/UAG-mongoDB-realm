exports = async function (Classification, Brand, DeviceRegex) {
    const product_master =
        context.services.get('mongodb-atlas').db('master').collection('product_master');
    const arr = [];
    for (const prod of await product_master.find(
        {
            'Classification': Classification,
            'Brand': Brand,
            'Device': { '$regex': DeviceRegex }
        },
        { '_id': 1 }
    ).toArray()) {
        arr.push(prod._id);
    }
    return arr;
};