/*
 * Interface de entidade de aplicativos do eekit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

var Element = module.use('element'),
    Css     = module.use('css'),
    App     = module.use('app');

module.exports(new Class(function (context) {

    this.inherit(App);

    var actions,
        subtitle,
        description,
        datasets;

    this.body.html.attach([
        actions     = new Element('div'),
        subtitle    = new Element('h5'),
        description = new Element('p'),
        datasets    = new Element('div'),
        embeds      = new Element('div')
    ]);

    this.body = undefined;

    /* Controla o subtitulo do app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.subtitle = function (value) {

        if (value) {

            if (value.constructor != String) {
                throw {
                    source     : 'entity.js',
                    method     : 'subtitle',
                    message    : 'Subtitle value must be a string',
                    arguments : arguments
                };
            }

            subtitle.html.set(value);
        } else {
            subtitle.html.get();
        }

    };

    /* Controla a descrição do app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.description = function (value) {

        if (value) {

            if (value.constructor != String) {
                throw {
                    source     : 'entity.js',
                    method     : 'description',
                    message    : 'Description value must be a string',
                    arguments : arguments
                };
            }

            description.html.set(value);
        } else {
            description.html.get();
        }

    };

    /* Controla os botões de ação do app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.actions = {

        get : function () {

        },

        add : function () {

        },

        remove : function () {

        }

    };

    /* Controla os datasets do app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.datasets = {

        get : function () {

        },

        add : function () {

        },

        remove : function () {

        }

    };

    /* Controla os embeds do app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.embeds = {

        get : function () {

        },

        add : function () {

        },

        remove : function () {

        }

    };

}));