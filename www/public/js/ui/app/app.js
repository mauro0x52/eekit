/*
 * Interface padrão de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element = module.use('element'),
    Css     = module.use('css');

module.exports(new Class(function (context) {

    var that = this,
        element,
        title,
        close,
        load;

    element = new Element('div', {attributes : {'class' : 'sheet '+context.type()}, html : [
        /* Header */
        new Element('div', {attributes : {'class' : 'header'}, html : [
            title = new Element('h4', {attributes : {'class' : 'title'}}),
            close = new Element('div', {attributes : {'class' : 'close'}, html : [
                new Element('div', {attributes : {'class' : 'image'}}),
                new Element('div', {attributes : {'class' : 'legend'}, html : 'fechar'})
            ],
            events : {
                click : function () {

                }
            }})
        ]}),
        load = new Element('div', {attributes : {'class' : 'loading'}, html : [
            new Element('div', {attributes : {'class' : 'image'}}),
            new Element('div', {attributes : {'class' : 'legend'}, html : 'carregando'})
        ]})
    ],
    events : {
        click : function () {

        }
    }});

    this.sheet = element;
    this.attach = element.attach;
    this.detach = element.detach;

    /* Ajusta ao tamanho da janela
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.adjust = function () {

        var height = 460,
            offset = 40;

        if (
            document.body &&
            document.body.offsetHeight
        ) {
            height = document.body.offsetHeight - offset;
        } else if (
            document.compatMode=='CSS1Compat' &&
            document.documentElement &&
            document.documentElement.offsetHeight
        ) {
            height = document.documentElement.offsetHeight - offset;
        } else if (
            window.innerHeight
        ) {
            height = window.innerHeight - offset;
        }

        element.attribute('style').set('height : ' + height);

    };

    /* Controla o estado de load
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.loading = function (value) {

        if (value === true || value === false) {
            if (value) {
                load.attribute('class').set('loading');
            } else {
                load.attribute('class').set('');
            }
        } else {
            return load.attribute('class').get().indexOf('loading') > -1;
        }

    };

    /* Controla o titulo do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.title = function (value) {

        if (value) {

            if (value.constructor != String) {
                throw new Error({
                    source     : 'app.js',
                    method     : 'title',
                    message    : 'Title value must be a string',
                    arguments : arguments
                });
            }

            title.html.set(value);
        } else {
            title.html.get();
        }

    };

    window.addEventListener('resize', function () {
        that.adjust();
    });
    this.adjust();

}));