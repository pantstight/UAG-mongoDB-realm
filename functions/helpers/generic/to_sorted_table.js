exports = function (obj) {
    const arr = [];
    for (const [k, v] of Object.entries(obj)) {
        arr.push(k.split('<>').concat([v]));
    }
    return arr.sort(
        (a, b) => a[a.length - 1] - b[b.length - 1]).reverse();
};