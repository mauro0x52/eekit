/*
 * Interface padrão de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element = module.use('element'),
    Css     = module.use('css');

module.exports(new Class(function (context) {

    var self = this,
        element,
        title,
        close,
        load,
        click_cb, close_cb;

    element = new Element('div', {attributes : {'class' : 'sheet '+context.type()}, html : [
        /* Header */
        new Element('div', {attributes : {'class' : 'header'}, html : [
            title = new Element('h4', {attributes : {'class' : 'title'}}),
            close = new Element('div', {attributes : {'class' : 'close'}, html : [
                new Element('div', {attributes : {'class' : 'image'}}),
                new Element('div', {attributes : {'class' : 'legend'}, html : 'fechar'})
            ]})
        ]}),
        load = new Element('div', {attributes : {'class' : 'loading'}, html : [
            new Element('div', {attributes : {'class' : 'image'}}),
            new Element('div', {attributes : {'class' : 'legend'}, html : 'carregando'})
        ]})
    ]});

    close.event('click').bind(function () {
        context.close();
    });

    element.event('click').bind(function (evt) {
        if (self.collapse()) {
            evt.preventDefault();
            self.click();
        }
    }, true);

    element.template = this;
    this.id          = element.id;
    this.sheet       = element;
    this.attach      = element.attach;
    this.detach      = element.detach;

    this.navigation = new Empreendekit.ui.appNavigation();

    this.navigation.click(function () {
        element.event('click').trigger();
    });

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

            var apps = Empreendekit.ui.apps.get(),
                navigations = Empreendekit.ui.navigation.get(),
                i,
                found = false;
            for (i = 0; i < apps.length; i++) {
                if (apps[i] === self) {
                    apps[i-1].click();
                    found = true;
                }
                if (found) {
                    navigations[i].detach();
                    apps[i].detach();
                }
            }

            if (close_cb) {
                close_cb();
            }
        }
    }

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

            var apps = Empreendekit.ui.apps.get(),
                navigations = Empreendekit.ui.navigation.get(),
                appMenuItems = Empreendekit.ui.appMenu.get(),
                i,j;
            for (i = 0; i < apps.length; i++) {
                if (apps[i] === self) {
                    apps[i].collapse(false);
                    navigations[i].select(true);
                    for (j = 0; j < appMenuItems.length; j++) {
                        if ('/' + appMenuItems[j].href() === apps[i].context().route()) {
                            appMenuItems[j].select(true);
                        } else {
                            appMenuItems[j].select(false);
                        }
                    }
                } else {
                    apps[i].collapse(true);
                    navigations[i].select(false);
                }
            }

            if (click_cb) {
                click_cb.apply(self);
            }
        }
    };

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

    /* Controla o estado de abertura do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.collapse = function (value) {

        if (value === true || value === false) {
            if (value) {
                element.attribute('class').set('sheet '+context.type() + ' collapsed');
            } else {
                element.attribute('class').set('sheet '+context.type() + ' selected');
            }
        } else {
            return element.attribute('class').get().indexOf('collapsed') > -1;
        }

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

            self.navigation.legend(value);
            title.html.set(value);
        } else {
            title.html.get();
        }

    };

    window.addEventListener('resize', self.adjust);

    this.adjust();

}));