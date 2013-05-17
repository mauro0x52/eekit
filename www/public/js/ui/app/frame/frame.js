/*
 * Interface de frame de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    App        = module.use('app'),
    Collection = module.use('collection');

module.exports(new Class(function (context) {

    var element;

    element = new Element('div', {attributes : {'class' : 'sheet frame', 'style' : 'width:' + window.innerWidth + 'px;'}});

    this.attach = element.attach;
    this.detach = element.detach;

    this.tag     = Element;
    this.css     = Css;

    /* Controla as tags do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.html = new Collection(element, []);

}));