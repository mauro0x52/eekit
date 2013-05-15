/**
 * Lista das contas
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/sandbox-list', function (params, data) {
    var groupset = new app.ui.groupset({
        header : {
            title : 'Primeiro titulo'
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

    app.ui.groups.add(groupset);
});
