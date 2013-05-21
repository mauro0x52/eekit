app.routes.dialog('/sandbox/dialog', function (params, data) {
    app.ui.title('Sandbox Diálogo');

    var fieldset = new app.ui.fieldset({
        legend : 'Fieldset',
        fields : [
            new app.ui.inputText({
                legend : 'Input Text',
                value : 'valor do input',
                errors : [
                    new app.ui.inputError({
                        message : 'mensagem de erro'
                    })
                ],
                rules : [
                    {rule : /^[0-9]+$/, message : 'tem que ser numeros'},
                    {rule : /^[a-z]+$/, message : 'tem que ser letras'},
                ]
            }),
            new app.ui.inputTextarea({
                legend : 'Text Area',
                value : 'valor do textarea\nnova linha',
                rules : [
                    {rule : /^[0-9]+$/, message : 'tem que ser numeros'},
                    {rule : /^[a-z]+$/, message : 'tem que ser letras'},
                ]
            })
        ]
    })

    setTimeout(function() {fieldset.validate()}, 1000);

    var fieldset2 = new app.ui.fieldset({
        legend : 'Fieldset 2',
        fields : []
    })

    app.ui.form.fieldsets.add([
        fieldset,
        fieldset2
    ]);

});