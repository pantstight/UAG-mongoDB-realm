exports = async function (payload, response) {
    payload = EJSON.parse(payload.body.text());
    const summary = context.services.get('mongodb-atlas').db('master').collection('summary');
    const channels = (await summary.find({ 'Country_Code': payload.Country_Code }, { '_id': 0, 'Country_Code': 0 }).toArray())[0][payload.Distributor];
    const obj = {};
    for (const [ch, years] of Object.entries(channels)) {
        const yrMth = {};
        for (const [yr, months] of Object.entries(years)) {
            yrMth[yr] = Object.keys(months);
        }
        obj[ch] = yrMth;
    }
    response.setBody(EJSON.stringify(obj));
};
