/**
 * Interface de entidade de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    App        = module.use('app'),
    Collection = module.use('collection'),
    Action     = module.use('action'),
    DataSet    = module.use('dataset'),
    Data       = module.use('data'),
    Value      = module.use('value');

module.exports(new Class(function (context) {

    this.inherit(App);

    var actions, subtitle, description, datasets, relateds;

    this.sheet.html.attach([
        new Element('div', {attributes : {'class' : 'body'}, html : [
            /* Actions */
            new Element('div', {attributes : {'class' : 'menu'}, html : [
                actions  = new Element('menu', {attributes : {'class' : 'actions'}})
            ]}),
            /* Subtitle */
            subtitle = new Element('h5', {attributes : {'class' : 'title'}}),
            /* Description */
            description = new Element('p', {attributes : {'class' : 'description'}}),
            /* Datasets */
            datasets = new Element('div', {attributes : {'class' : 'data-sets'}}),
            /* Relateds */
            relateds = new Element('div', {attributes : {'class' : 'relateds'}})
        ]})
    ]);

    this.sheet = undefined;
    this.action = Action;
    this.dataset = DataSet;
    this.data = Data;
    this.value = Value;

    /**
     * Controla o subtitulo do app
     *
     * @author rafael erthal
     * @since  2013-05
     */
    this.subtitle = function (value) {
        if (value) {

            if (value.constructor != String) {
                throw new Error({
                    source     : 'entity.js',
                    method     : 'subtitle',
                    message    : 'Subtitle value must be a string',
                    arguments : arguments
                });
            }

            subtitle.html.set(value);
        } else {
            subtitle.html.get();
        }
    };

    /* Controla a descrição do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.description = function (value) {
        if (value) {

            if (value.constructor != String) {
                throw new Error({
                    source     : 'entity.js',
                    method     : 'description',
                    message    : 'Description value must be a string',
                    arguments : arguments
                });
            }

            description.html.set(value);
        } else {
            description.html.get();
        }
    };

    /**
     * Controla os botões de ação do app
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.actions = new Collection(actions, [Action]);

    /**
     * Controla os datasets do app
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.datasets = new Collection(datasets, [DataSet]);

    /**
     * Controla os relacionados do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    //this.relateds = new Collection(relateds, [EmbeddedList, EmbeddedEntity]);

}));