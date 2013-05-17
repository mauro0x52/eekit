/*
 * Interface padrão de aplicativos embedados do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element = module.use('element'),
    Css     = module.use('css');

module.exports(new Class(function (context) {

    var element,
        title,
        body;

    element = new Element('div', {html : [
        new Element('div', {html : [
            title = new Element('h4')
        ]}),
        body = new Element('div')
    ], events : {
        click : function () {

        }
    }});

    this.body = body;
    this.attach = element.attach;
    this.detach = element.detach;

    /* Controla o titulo do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.title = function (value) {

        if (value) {

            if (value.constructor != String) {
                throw new Error({
                    source     : 'embedApp.js',
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

}));