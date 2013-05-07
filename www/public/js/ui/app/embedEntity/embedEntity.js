/*
 * Interface de entidade embedada de aplicativos do eekit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

var Element  = module.use('element'),
    Css      = module.use('css'),
    EmbedApp = module.use('embedApp');

module.exports(new Class(function (context) {

    this.inherit(EmbedApp);

    var subtitle,
        description,
        datasets;

    this.body.html.attach([
        subtitle    = new Element('h5'),
        description = new Element('p'),
        datasets    = new Element('div')
    ]);

    this.body = undefined;

    /* Controla o clique no app
     *
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.click = function (value) {

        if (value) {

            if (value.constructor != Function) {
                throw {
                    source     : 'embedEntity.js',
                    method     : 'click',
                    message    : 'Click callback must be a function',
                    arguments : arguments
                };
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
     * @author: rafael erthal
     * @since: 2013-05
     */
    this.subtitle = function (value) {

        if (value) {

            if (value.constructor != String) {
                throw {
                    source     : 'embedEntity.js',
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
                    source     : 'embedEntity.js',
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

}));