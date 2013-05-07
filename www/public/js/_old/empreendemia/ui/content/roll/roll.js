/** Logo
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : renderiza o container de colunas da empreendemia
 */

empreendemia.ui.roll = function () {
    var element = document.createElement('div'),
        menu_div = document.createElement('div'),
        list_menu = document.createElement('menu');

    /* CSS */
    element.setAttribute('class', 'roll');
    menu_div.setAttribute('class', 'menu');
    list_menu.setAttribute('class', 'list');

    /* Hierarquia */
    element.appendChild(menu_div);
    menu_div.appendChild(list_menu);

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

    /* Métodos públicos */
    this.left = function (value) {
        var position = (element.style.left ? element.style.left.replace('px', '')*1 : 0);
        if (value || value === 0) {
            element.style.left = value;
        } else {
            return element.style.left || 0;
        }
    };
    this.sheets = new empreendemia.ui.sheets();
    this.menu = new Collection(list_menu, [empreendemia.ui.appMenu]);

    /* Hierarquia */
    this.sheets.attach(element);
}