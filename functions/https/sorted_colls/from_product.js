exports = async function (Countries, Years, Classification, Brand, DeviceRgxStr, grpArgs, kGenId) {
    const sorted_coll_names = await context.functions.execute(
        'helpers/summary/sorted_coll_names',
        Countries, Years, Classification, Brand);
    const products = await context.functions.execute(
        'helpers/product/_ids',
        Classification, Brand, DeviceRgxStr);
    const obj = await context.functions.execute(
        'helpers/sorted_colls/from_product',
        sorted_coll_names, products, grpArgs,
        context.functions.execute('helpers/generic/kGen', kGenId));
    return context.functions.execute('helpers/generic/to_sorted_table', obj);
};