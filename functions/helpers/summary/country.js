exports = function (Country_Code) {
    return context.services
        .get('mongodb-atlas').db('master').collection('summary')
        .find({ 'Country_Code': Country_Code }, { '_id': 0, 'Country_Code': 0 }).toArray();
};