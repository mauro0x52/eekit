app.routes.dialog('/sandbox/dialog', function (params, data) {
    app.ui.title('Sandbox Diálogo');

    var fieldset = new app.ui.fieldset({
        legend : 'Fieldset',
        fields : []
    })

    console.log(fieldset)

    app.ui.form.fieldsets.add([
        fieldset
    ]);

});