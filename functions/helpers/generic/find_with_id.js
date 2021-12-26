exports = function (collName, _id) {
    return context.services.get('mongodb-atlas').db('master').collection(collName).find({ '_id': _id }).toArray();
};