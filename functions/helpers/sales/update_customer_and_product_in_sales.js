exports = async function (doc) {
    const customers = await context.functions.execute(
        'helpers/customer/find',
        doc.Country_Code,
        doc.Distributor,
        doc.Channel);
    const products = await context.functions.execute(
        'helpers/product/find_with_code',
        doc.UPC,
        doc.SKU,
        doc.SKU_JP);
    if (customers.length && products.length) {
        const customer = customers[0];
        const product = products[0];
        doc.Country_Code = customer.Country_Code;
        doc.Distributor = customer.Distributor;
        doc.Channel = customer.Channel;
        doc.Channel_Type = customer.Channel_Type;
        doc.customerId = customer._id;
        doc.UPC = product.UPC;
        doc.SKU = product.SKU;
        doc.SKU_JP = product.SKU_JP;
        doc.productId = product._id;
        return {
            'doc': doc,
            'customer': customer,
            'product': product
        };
    }
    return false;
};