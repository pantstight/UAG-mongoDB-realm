exports = async function () {
    const arr = [];
    (await context.services
        .get('mongodb-atlas').db('master').collection('summary')
        .find().toArray()).forEach(e => arr.push(e.Country_Code));
    return arr;
};