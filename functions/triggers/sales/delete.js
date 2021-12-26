exports = function (changeEvent) {
    context.functions.execute(
        'helpers/sales/delete_with_ids', changeEvent.fullDocumentBeforeChange, 'delete');
};