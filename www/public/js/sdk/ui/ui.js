/** Ui
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de interface com o usuário
 */
sdk.modules.ui = function (app) {
    "use strict";
    var selected = false;

    this.set = function (type) {
        if (type === 'frame') {
            app.ui = new sdk.modules.ui.frame(app);
        }
        if (type === 'dialog') {
            app.ui = new sdk.modules.ui.dialog(app);
        }
        if (type === 'list') {
            app.ui = new sdk.modules.ui.list(app);
        }
        if (type === 'embbed list') {
            app.ui = new sdk.modules.ui.embeddedList(app);
        }
        if (type === 'entity') {
            app.ui = new sdk.modules.ui.entity(app);
        }
        if (type === 'embbed entity') {
            app.ui = new sdk.modules.ui.embeddedEntity(app);
        }
        app.ui.type = function () {
            return type;
        };
        app.ui.selected = function (value) {
            if (value === true || value === false) {
                selected = value;
            } else {
                return selected;
            }
        }
    }
};
