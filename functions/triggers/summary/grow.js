exports = async function (Year, Month, customer, product, seed) {
    const { Country_Code, Distributor, Channel } = context.functions.execute('helpers/generic/cook', customer);
    const { Classification, Brand, Series, Device, Color_Name } = context.functions.execute('helpers/generic/cook', product);
    const branch = `${Distributor}.${Channel}.${Year}.${Month}.${Classification}.${Brand}.${Series}.${Device}.${Color_Name}.numAssociatedSales`;
    await context.services.get('mongodb-atlas').db('master').collection('summary').updateOne(
        { 'Country_Code': Country_Code },
        seed ? { '$set': { [branch]: seed } } : { '$inc': { [branch]: 1 } },
        { 'upsert': true }
    );
};