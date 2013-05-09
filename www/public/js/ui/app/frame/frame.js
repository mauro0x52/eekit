/*
 * Interface de frame de aplicativos do eekit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

var Element = module.use('element'),
    Css     = module.use('css'),
    App     = module.use('app');

module.exports(new Class(function (context) {

    var element;

    element = new Element('div');

    this.attach = element.attach;
    this.detach = element.detach;

    this.element = element;
    this.css     = Css;

    /* Controla as tags do app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.html = {

        get : function () {

        },

        add : function () {

        },

        remove : function () {

        }

    };

}));