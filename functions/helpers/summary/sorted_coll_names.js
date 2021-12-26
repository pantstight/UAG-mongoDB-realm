exports = async function (Countries, Years, Classification, Brand) {
    const summary = context.services.get('mongodb-atlas').db('master').collection('summary');
    const arr = [];
    for (const cntry of await summary.find(Countries, { _id: 0 }).toArray()) {
        const Country_Code = cntry.Country_Code;
        delete cntry.Country_Code;
        for (const [distK, dist] of Object.entries(cntry)) {
            for (const [chK, ch] of Object.entries(dist)) {
                for (const yrK of Years.filter(y => y in ch)) {
                    const yr = ch[yrK];
                    mthLoop:
                    for (const [mthK, mth] of Object.entries(yr)) {
                        if (Classification in mth && Brand in mth[Classification]) {
                            arr.push({
                                'Country_Code': context.functions.execute(
                                    'helpers/generic/unCook', Country_Code),
                                'Distributor': context.functions.execute(
                                    'helpers/generic/unCook', distK),
                                'Channel': context.functions.execute(
                                    'helpers/generic/unCook', chK),
                                'Year': yrK,
                                'Month': mthK
                            });
                            continue mthLoop;
                        }
                    }
                }
            }
        }
    }
    return arr;
};