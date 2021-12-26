exports = async function (type, _id, updatedFieldsBeforeChange) {
    const curr = (await context.functions.execute(
        'helpers/generic/find_with_id', `${type}_master`, _id))[0];
    const prev = {};
    for (const [k, v] of Object.entries(curr)) {
        prev[k] =
            (k in updatedFieldsBeforeChange) ?
                updatedFieldsBeforeChange[k] : v;
    }
    return {
        [`${type}Curr`]: curr,
        [`${type}Prev`]: prev
    };
};