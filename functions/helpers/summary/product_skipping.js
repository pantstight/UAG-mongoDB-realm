exports = async function (args) {
    const arr = [];
    for (const ccK of args.Country_Code) {
        const country = (await context.functions.execute(
            'helpers/summary/country', ccK))[0];
        for (const distributor of Object.values(country)) {
            for (const channel of Object.values(distributor)) {
                if ('Year' in args) {
                    for (const yrK of args.Year.filter(y => y in channel)) {
                        for (const month of Object.values(channel[yrK])) {
                            if ('Classification' in args && args.Classification in month) {
                                arr.push(Object.keys(month[args.Classification]));
                            } else {
                                arr.push(Object.keys(month));
                            }
                        }
                    }
                } else {
                    arr.push(Object.keys(channel));
                }
            }
        }
    }
    return arr.reduce((a, b) => (a.length > b.length) ? a : b);
};