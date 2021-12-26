exports = function (prev, updatedFields) {
    delete updatedFields.source;
    const obj = {};
    for (const k in updatedFields) {
        obj[k] = prev[k];
    }
    return obj;
};