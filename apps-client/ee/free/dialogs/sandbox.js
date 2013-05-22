app.routes.dialog('/sandbox/dialog', function (params, data) {
    app.ui.title('Sandbox Diálogo');

    var selector = new app.ui.inputSelector({
        legend : 'Expandido multiplo',
        options : [
            new app.ui.inputOption({
                legend : 'Opção A',
                label : 'red'
            }),
            new app.ui.inputOption({
                legend : 'Opção B',
                label : 'blue'
            }),
            new app.ui.inputOption({
                legend : 'Opção B',
                image : 'check'
            })
        ]
    });
    var selectorb = new app.ui.inputSelector({
        legend : 'Expandido unico',
        type : 'single',
        options : [
            new app.ui.inputOption({
                legend : 'Opção A',
                label : 'red'
            }),
            new app.ui.inputOption({
                legend : 'Opção B',
                label : 'blue'
            }),
            new app.ui.inputOption({
                legend : 'Opção B',
                image : 'check'
            })
        ]
    });
    var selectorc = new app.ui.inputSelector({
        legend : 'Colapsado multiplo',
        filterable : true,
        options : [
            new app.ui.inputOption({
                legend : 'Opção A',
                label : 'red'
            }),
            new app.ui.inputOption({
                legend : 'Opção B',
                label : 'blue'
            }),
            new app.ui.inputOption({
                legend : 'Opção B',
                image : 'check'
            })
        ]
    });
    var selectord = new app.ui.inputSelector({
        legend : 'Colapsado unico',
        filterable : true,
        type : 'single',
        options : [
            new app.ui.inputOption({
                legend : 'Opção A',
                label : 'red'
            }),
            new app.ui.inputOption({
                legend : 'Opção B',
                label : 'blue'
            }),
            new app.ui.inputOption({
                legend : 'Opção B',
                image : 'check'
            })
        ]
    });

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
            }),
            new app.ui.inputDate({
                legend : 'Datepicker'
            })
        ]
    })

    setTimeout(function() {fieldset.validate()}, 1000);

    var fieldset2 = new app.ui.fieldset({
        legend : 'Fieldset 2',
        fields : []
    })

    fieldset2.fields.add([selector, selectorb, selectorc, selectord]);

    app.ui.form.fieldsets.add([
        fieldset,
        fieldset2
    ]);

});