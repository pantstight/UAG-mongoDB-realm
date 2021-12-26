exports = async function (payload, response) {
    payload = EJSON.parse(payload.body.text());
    const args = payload.args;
    let arr;
    if ('Country_Code' in args) {
        arr = await context.functions.execute('helpers/summary/product_skipping', args);
    } else if (!Object.keys(args).length) {
        arr = await context.functions.execute('helpers/summary/Country_Codes');
    }
    response.setBody(EJSON.stringify(arr));
};