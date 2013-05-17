/*
 * Interface de listagem embedada de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element  = module.use('element'),
    Css      = module.use('css'),
    EmbedApp = module.use('embedApp');

module.exports(new Class(function (context) {

    this.inherit(EmbedApp);

    var groups;

    this.body.html.attach([
        groups  = new Element('div')
    ]);

    this.body = undefined;

    /* Controla os grupos do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.groups = {

        get : function () {

        },

        add : function () {

        },

        remove : function () {

        }

    };

}));