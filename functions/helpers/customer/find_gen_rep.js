exports = function (Country_Code, Distributor) {
    return context.services.get('mongodb-atlas').db('master').collection('customer_master').find({
        '$and': [
            { 'Country_Code': Country_Code },
            { 'Distributor': Distributor },
            { 'Channel': '' },
            { 'Channel_Type': '' }
        ]
    }).toArray();
};