/**
 * Lista das contas
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/sandbox/list', function (params, data) {

    app.ui.title('Titulo do list sheet');

    app.ui.actions.add([
        new app.ui.action({
            legend : 'ação',
            image : 'add'
        }),
        new app.ui.action({
            legend : 'ação',
            image : 'add'
        })
    ]);

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
            title : 'Primeiro footer',
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


    var emptyGroup = new app.ui.group({
        header : {
            title : 'grupo vazio'
        },
        droppable : true,
        items : [
            teste2 = new app.ui.item({
                title : 'Titulo do item teste 2',
                description : 'descrição do item',
                label : {
                    color : 'blue',
                    legend : 'label'
                },
                click : function () {
                    console.log('aew')
                },
                drop : function (group, position) {
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
                            teste2.drag();
                        }
                    })
                ]
            })
        ]
    })

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
                title : 'Titulo do item teste 1',
                description : 'descrição do item',
                label : {
                    color : 'blue',
                    legend : 'label'
                },
                click : function () {
                    console.log('aew')
                },
                drop : function (group, position) {
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

    var fieldset = new app.ui.fieldset({
        legend : 'Fieldset =D',
        fields : [
            input = new app.ui.inputText({
                legend : 'aew'
            })
        ]
    });
    app.ui.filter.fieldsets.add(fieldset);


    setTimeout(function() {
        input.helper.description('Descrição do helper');
        input.helper.example('Ex. Clique na verdura e compre uma alface.');
    }, 1000)

    groupset.groups.add([emptyGroup, group]);
    app.ui.groups.add(groupset);
});