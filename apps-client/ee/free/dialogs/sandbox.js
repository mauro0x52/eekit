app.routes.dialog('/sandbox/dialog', function (params, data) {
    app.ui.title('Sandbox Diálogo');

    var fieldset = new app.ui.fieldset({
        legend : 'Fieldset',
        fields : [
            new app.ui.inputText({
                legend : 'Input Text',
                value : 'valor do input'
            })
        ]
    })

    var fieldset2 = new app.ui.fieldset({
        legend : 'Fieldset 2',
        fields : []
    })

    app.ui.form.fieldsets.add([
        fieldset,
        fieldset2
    ]);

});