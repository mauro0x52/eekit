app.routes.entity('/sandbox/entity', function (params, data) {
    app.ui.title('Titulo da entity');

    app.ui.subtitle('Subtítulo da bagaça');

    app.ui.description('In ligula quam, vestibulum ut aliquet pretium, iaculis ac nibh. Pellentesque ut justo eu turpis tristique luctus. Maecenas lobortis massa eget lectus tincidunt eleifend. Suspendisse a est lectus. Nullam consectetur justo eros, id condimentum metus. Nunc volutpat enim sed justo interdum blandit. Nulla convallis malesuada aliquam. Nulla ac iaculis risus. Cras pharetra lobortis vehicula. Nullam pretium sapien in tortor rhoncus non vehicula augue varius. Praesent commodo hendrerit ullamcorper. Mauris aliquam leo sit amet nibh egestas sed pulvinar est iaculis.');

    app.ui.datasets.add([
        new app.ui.dataset({
            legend : 'Fieldset Maneiro',
            fields : [
                new app.ui.data({
                    legend : 'Campo A',
                    values : [
                        new app.ui.value({
                            value : 'Uhuuuuu!'
                        }),
                        new app.ui.value({
                            value : 'Uhuuuuu 2!'
                        })
                    ]
                }),
                new app.ui.data({
                    legend : 'Campo B',
                    values : [
                        new app.ui.value({
                            value : 'Aqui só tem um =['
                        })
                    ]
                })
            ]
        })
    ])
});