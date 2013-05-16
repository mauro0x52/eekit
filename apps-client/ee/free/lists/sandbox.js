/**
 * Lista das contas
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/sandbox-list', function (params, data) {

    app.ui.title('Titulo do list sheet');

    var icon;
    var test;
    var groupset = new app.ui.groupset({
        header : {
            title : 'Primeiro titulo',
            icons : [
                new app.ui.icon({
                    legend : 'A',
                    image : 'add'
                }),
                new app.ui.icon({
                    legend : 'B',
                    image : 'add'
                })
            ],
            actions : [
                new app.ui.action({
                    legend : 'ação',
                    image : 'add',
                    click : function () {
                        console.log('aew')
                    }
                })
            ]
        },
        footer : {
            title : 'Primeiro footer'
        }
    });
    setTimeout(function() {
        groupset.header.title('Titulo!!!');
        groupset.footer.title('Footer!!!');
        groupset.visibility('hide')
    }, 500)
    setTimeout(function() {
        groupset.visibility('show')
    }, 1000)

    icon = new app.ui.icon({
        legend : 'icone',
        image : 'add'
    });
    groupset.header.icons.add(icon);
    setTimeout(function() {
        icon.legend('segundo icone');
    }, 1200)


    var group = new app.ui.group({
        header : {
            title : 'Titulo do grupo',
            icons : [
                new app.ui.icon({
                    legend : 'A',
                    image : 'add'
                }),
                new app.ui.icon({
                    legend : 'B',
                    image : 'add'
                })
            ],
            actions : [
                new app.ui.action({
                    legend : 'ação',
                    image : 'add',
                    click : function () {
                        console.log('aew')
                    }
                })
            ]
        },
        items : [
            test = new app.ui.item({
                title : 'Titulo do item teste',
                description : 'descrição do item',
                label : {
                    color : 'blue',
                    legend : 'label'
                },
                click : function () {
                    console.log('aew')
                },
                actions : [
                    new app.ui.action({
                        legend : 'ação',
                        image : 'trash',
                        tip : 'tooltip'
                    }),
                    new app.ui.action({
                        legend : 'outra ação',
                        image : 'download',
                        tip : 'tooltip 2',
                        click : function () {
                            test.drag();
                            console.log('aew')
                        }
                    })
                ]
            }),
            new app.ui.item({
                title : 'Titulo do item',
                description : 'descrição do item',
                label : {
                    color : 'blue',
                    legend : 'label'
                },
                click : function () {
                    console.log('aew')
                }
            }),
            new app.ui.item({
                title : 'Titulo do item',
                description : 'descrição do item',
                label : {
                    color : 'red',
                    legend : 'label'
                },
                icons : [
                    new app.ui.icon({
                        legend : 'Aeeeews',
                        image : 'note'
                    }),
                    new app.ui.icon({
                        legend : 'Wooohooo',
                        image : 'calendar'
                    })
                ],
                click : function () {
                    console.log('aew')
                }
            }),
            new app.ui.item({
                title : 'Titulo do item',
                description : 'descrição do item',
                label : {
                    color : 'blue',
                    legend : 'label'
                },
                click : function () {
                    console.log('aew')
                }
            }),
            new app.ui.item({
                title : 'Titulo do item',
                description : 'descrição do item',
                label : {
                    color : 'olive',
                    legend : 'label'
                },
                click : function () {
                    console.log('aew')
                }
            }),
            new app.ui.item({
                title : 'Titulo do item',
                description : 'descrição do item',
                label : {
                    color : 'red',
                    legend : 'label'
                },
                click : function () {
                    console.log('aew')
                }
            }),
            new app.ui.item({
                title : 'Titulo do item',
                description : 'descrição do item',
                label : {
                    color : 'red',
                    legend : 'label'
                },
                click : function () {
                    console.log('aew')
                }
            }),
            new app.ui.item({
                title : 'Titulo do item',
                description : 'descrição do item',
                label : {
                    color : 'blue',
                    legend : 'label'
                },
                click : function () {
                    console.log('aew')
                }
            }),
            new app.ui.item({
                title : 'Titulo do item',
                description : 'descrição do item',
                label : {
                    color : 'blue',
                    legend : 'label'
                },
                click : function () {
                    console.log('aew')
                }
            }),
            new app.ui.item({
                title : 'Titulo do item',
                description : 'descrição do item',
                label : {
                    color : 'blue',
                    legend : 'label'
                },
                click : function () {
                    console.log('aew')
                }
            })
        ]
    })

    groupset.groups.add(group);
    app.ui.groups.add(groupset);
});