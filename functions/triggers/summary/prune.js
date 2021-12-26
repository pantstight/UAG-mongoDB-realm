exports = async function (Year, Month, customer, product) {
    const master = context.services.get('mongodb-atlas').db('master');
    const summary = master.collection('summary');
    const { Country_Code, Distributor, Channel } = context.functions.execute('helpers/generic/cook', customer);
    const { Classification, Brand, Series, Device, Color_Name } = context.functions.execute('helpers/generic/cook', product);
    const query = { 'Country_Code': Country_Code };
    let tree = (await summary.find(query).toArray())[0];
    const nodes = [Distributor, Channel, Year, Month, Classification, Brand, Series, Device, Color_Name];
    const arr = [Object.keys(tree).length];
    for (const i of nodes) {
        const subTree = tree[i];
        arr.unshift(Object.keys(subTree).length);
        tree = subTree;
    }
    arr[0] = tree.numAssociatedSales;
    nodes.push('numAssociatedSales');
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 1 && (i !== arr.length - 1 || arr[i] > 3)) { break; }
        nodes.pop();
    }
    if (!nodes.length) {
        await summary.deleteOne(query);
    } else {
        const path = nodes.join('.');
        if (nodes.length === arr.length) {
            await summary.updateOne(query, { '$inc': { [path]: -1 } }, {});
        } else {
            await summary.updateOne(query, { '$unset': { [path]: '' } }, {});
        }
    }
    return arr[0];
};