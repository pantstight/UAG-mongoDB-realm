exports = function (kGenId) {
    switch (kGenId) {
        case 'Device':
            return _id => `${_id.Device}`
        case 'Series':
            return _id => `${_id.Series}`
        case 'Device_Series':
            return _id => `${_id.Device}<>${_id.Series}`
    }
};