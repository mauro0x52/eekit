/**
 * Lista das contas
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/sandbox-list', function (params, data) {
    var icon;
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

    app.ui.groups.add(groupset);
});
