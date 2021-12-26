exports = function uncook(val) {
    return val.replace(/<dot>/g, '.').replace(/<dollar sign>/g, '$').replace(/<empty string>/g, '');
}