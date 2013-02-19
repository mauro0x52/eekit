/** Logo
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : renderiza a barra de navegação da empreendemia
 */

empreendemia.ui.navigation = function () {
    var element = document.createElement('div'),
        sheets_menu = document.createElement('menu');

    /* CSS */
    element.setAttribute('class', 'navigation');
    sheets_menu.setAttribute('class', 'sheets');

    /* Hierarquia */
    element.appendChild(sheets_menu);

    /* Métodos protegidos */
    this.attach = function (HTMLobject) {
        if (HTMLobject && HTMLobject.appendChild) {
            HTMLobject.appendChild(element);
        }
    };
    this.detach = function () {
        if (element.parentNode && element.parentNode && element.parentNode.removeChild) {
            element.parentNode.removeChild(element);
        }
    };
    this.focus = function (ui) {
        var apps = empreendemia.ui.content.roll.sheets.apps.get(),
            navigables = empreendemia.ui.content.navigation.navigables.get(),
            position,
            i;

        for (i in apps) {
            if (apps[i] === ui) {
                position = i*1;
                navigables[i].selected(true);
                apps[i].selected(true);
            } else {
                navigables[i].selected(false);
                apps[i].selected(false);
            }
        }

        if (position == 0) {
            empreendemia.ui.content.roll.left(0);
        } else {
            empreendemia.ui.content.roll.left(-990 - (position - 1)*650 + (window.innerWidth - 650)/2);
        }
    }

    /* Métodos públicos */
    this.navigables = new Collection(sheets_menu, [empreendemia.ui.appNavigable]);
}