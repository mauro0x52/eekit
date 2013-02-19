/**
 * Informações de um contato
 *
 * @author Mauro Ribeiro
 * @since  2012-12
 *
 * @param  params.id : id do contato
 */
app.routes.embeddedEntity('/contato-relacionado/:id', function (params, data) {
    var
    /**
     * Campos dos dados do usuário
     */
    fields = {},
    /**
     * Nome dos dias da semana
     */
    daysNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    /**
     * Nome dos meses
     */
    monthsNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    /**
     * Lista de fases de negociação do usuário
     */
    categories;

    /**
     * Retorna o nome da fase de negociação
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  category_id : id da fase de negociação
     */
    function categoryName (category_id) {
        var i;
        for (var i in categories) {
            if (category_id.toString() === categories[i]._id.toString()) {
                return categories[i].name;
            }
        }
        return 'Não-cliente'
    }

    /**
     * Formata a data de forma legível para o usuário
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  string : data a ser formatada
     */
    function dateFormat (string) {
        var date = new Date(string);
        return daysNames[date.getDay()]  + ', ' + date.getDate() + ' de ' + monthsNames[date.getMonth()] + ' de ' + date.getFullYear()
    }

    /**
     * Monta ferramenta
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     */

    app.ui.title('Contato relacionado');

    app.models.category.list(function (data) {
        categories = data;
        app.models.contact.find(params.id, function (contact) {

            app.ui.subtitle(contact.name)

            app.ui.click(function () {
                app.apps.entity({
                    app : 'contatos',
                    route : '/contato/'+contact._id
                })
            });

            fields.category = new app.ui.data({
                legend : 'categoria',
                values : [new app.ui.value({value : categoryName(contact.category)})]
            });

            fields.email = new app.ui.data({
                legend : 'email',
                values : [new app.ui.value({value : contact.email || '-' })]
            });

            fields.phone = new app.ui.data({
                legend : 'telefone',
                values : [new app.ui.value({value : contact.phone || '-'})]
            });

            fields.dateCreated = new app.ui.data({
                legend : 'criação',
                values : [new app.ui.value({value : dateFormat(contact.dateCreated)})]
            });

            app.ui.datasets.add(
                new app.ui.dataset({
                    legend : 'Detalhes',
                    fields : [fields.category, fields.email, fields.phone]
                })
            );
        });
    });
});