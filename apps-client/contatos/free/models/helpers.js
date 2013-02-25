/**
 * Model dos helpers
 *
 * @author Rafael Erthal, Mauro Ribeiro
 * @since  2013-02
 */

function toArray (obj) {
    var res = [];
    for (var i in obj) {
        res.push(obj[i]);
    }
    return res;
}

app.models.helpers = {};

/**
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @when  existir apenas um contato sem nenhuma tarefas
 * @where contatos / entidade de contato
 */
app.models.helpers.firstContact = function (contacts) {
    if (contacts.length === 1) {
        app.ajax.get({
            url : 'http://' + app.config.services.tasks.host + ':' + app.config.services.tasks.port + '/tasks',
            data : { filterByEmbeddeds : ['/contatos/contato-relacionado/' + contacts[0]._id] }
        }, function (response) {
            var i,j,
                item,
                items,
                groups;
            if (response && !response.error && response.tasks && response.tasks.length === 0) {
                groups = app.ui.groups.get()[0].groups.get();
                for (i in groups) {
                    console.log(groups[i])
                    items = groups[i].items.get();
                    if (items[0]) {
                        item = items[0];
                    }
                }
                item.helper.description('Clique no nome do contato para organizar o que você precisa fazer em relação a ele');
                item.helper.example('Por aqui você consegue organizar tarefas e configurar lembretes por e-mail para deixar tudo sempre em dia');
            }
        });
    }
}


/**
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @when  Algum contato com tarefa mas sem campos personalizados
 * @where contatos / entidade de contato
 */
app.models.helpers.noFields = function (contacts) {
    if (contacts.length === 2 && contacts[0].fieldValues === null && contacts[1].fieldValues === null) {
        app.ui.menu.get()[2].helper.description('Insira todo o tipo de informação que você quiser sobre os seus contatos');
        app.ui.menu.get()[2].helper.example('Acha que o cadastro do contato oferece poucos campos? Então crie campos personalizados e adicione mais informações sobre seus contatos.');
    }
}



/**
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @when  5 contatos
 * @where contatos / entidade de contato
 */
app.models.helpers.fiveContacts = function (contacts) {
    if (contacts.length === 5) {
        app.ui.filter.fieldsets.get()[0].fields.get()[0].helper.description('Ache rapidamente um contato ou filtre utilizando uma palavra-chave');
        app.ui.filter.fieldsets.get()[0].fields.get()[0].helper.example('Ao utilizar a busca, você faz com que a ferramenta te mostre apenas o(s) contato(s) que você quer ver agora.');
    }
}


/**
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @when  5 contatos e fez a busca
 * @where contatos / entidade de contato
 */
app.models.helpers.fiveContactsAndFiltered = function (contacts) {
    if (contacts.length === 5) {
        app.ui.actions.get()[0].helper.description('Exporte e salve os dados dos seus contatos quando quiser');
        app.ui.actions.get()[0].helper.example('Ao exportar os dados de contatos depois de uma busca ou filtro, você consegue utilizá-los para envios de e-mails ou newsletters.');
    }
}
