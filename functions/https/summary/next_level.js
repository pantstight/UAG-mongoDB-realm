exports = async function (payload, response) {
    payload = EJSON.parse(payload.body.text());
    const { Country_Code, path } = payload;
    let arr;
    if (Country_Code) {
        const doc = (await context.functions.execute(
            'helpers/summary/country', Country_Code))[0];
        if (path) {
            const nodes = path.split('.');
            let curr = doc[nodes[0]];
            for (const k of nodes.slice(1)) {
                curr = curr[k];
            }
            arr = Object.keys(curr);
        } else {
            arr = Object.keys(doc);
        }
    } else {
        arr = await context.functions.execute('helpers/summary/Country_Codes');
    }
    response.setBody(EJSON.stringify(arr));
};