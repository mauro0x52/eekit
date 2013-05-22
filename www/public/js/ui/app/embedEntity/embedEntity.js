/*
 * Interface de entidade embedada de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element  = module.use('element'),
    Css      = module.use('css'),
    Collection = module.use('collection'),
    EmbedApp = module.use('embedApp'),
    Action   = module.use('action'),
    DataSet  = module.use('dataset'),
    Data     = module.use('data'),
    Value    = module.use('value');

module.exports(new Class(function (context) {

    this.inherit(EmbedApp);

    var subtitle,
        description,
        datasets;

    this.body.html.attach([
        subtitle    = new Element('h5', {attributes : {'class' : 'title'}}),
        description = new Element('p', {attributes : {'class' : 'description'}}),
        datasets    = new Element('div', {attributes : {'class' : 'data-sets'}}),
        new Element('div', {attributes : {'class' : 'click'}, html : [
            new Element('div', {attributes : {'class' : 'arrow'}, html : [
                new Element('div', {attributes : {'class' : 'fill'}})
            ]}),
        ]})
    ]);

    this.body = undefined;
    this.action = Action;
    this.dataset = DataSet;
    this.data = Data;
    this.value = Value;

    /* Controla o clique no app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.click = function (value) {

        if (value) {

            if (value.constructor != Function) {
                throw new Error({
                    source     : 'embedEntity.js',
                    method     : 'click',
                    message    : 'Click callback must be a function',
                    arguments : arguments
                });
            }

            subtitle.event('click').bind(function (evt) {
                value.apply(context);
            });
        } else {
            subtitle.event('click').trigger();
        }

    };

    /* Controla o subtitulo do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.subtitle = function (value) {

        if (value) {

            if (value.constructor != String) {
                throw new Error({
                    source     : 'embedEntity.js',
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
                    source     : 'embedEntity.js',
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

    /* Controla os datasets do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.datasets = new Collection(datasets, [DataSet]);

}));