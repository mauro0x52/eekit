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

    var self = this,
        close_cb, click_cb,
        element;

    element = new Element('div', {attributes : {'class' : 'sheet frame', 'style' : 'width:' + window.innerWidth + 'px;'}});

    element.template = this;
    this.id = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    this.tag     = Element;
    this.css     = Css;

    this.context = function () {

        return context;

    };

    /* Controla o fechamento da ui
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.close = function (value) {
        if (value) {

            if (value.constructor === Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'click',
                    message   : 'Click value must be a function',
                    arguments : arguments
                });
            }

            close_cb = value;
        } else {

            self.detach();
            if (close_cb) {
                close_cb();
            }
        }
    };

    /* Controla o click no app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.click = function (value) {
        if (value) {

            if (value.constructor === Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'click',
                    message   : 'Click value must be a function',
                    arguments : arguments
                });
            }

            click_cb = value;
        } else {
            history.pushState({}, 'EmpreendeKit', context.route());

            if (click_cb) {
                click_cb.apply(self);
            }
        }
    };

    /* Controla as tags do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.html = new Collection(element, [Element]);

}));