exports = async function (payload, response) {
    response.setBody(await context.functions.execute('helpers/sorted_colls/timely_aggregate', payload, 'Month'));
};