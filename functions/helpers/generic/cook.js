exports = function (obj) {
    for (const k in obj) {
        if (typeof obj[k] === 'string') {
            obj[k] = obj[k] ? obj[k].replace(/\./g, '<dot>').replace(/\$/g, '<dollar sign>') : '<empty string>';
        }
    }
    return obj;
};