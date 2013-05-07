/** Logo
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : renderiza o menu da empreendemia
 */

empreendemia.ui.menu = function () {
    var element = document.createElement('menu'),
        tools_li = document.createElement('li'),
        tools_menu = document.createElement('menu'),
        more_li = document.createElement('li'),
        more_menu = document.createElement('menu');

    /* CSS */
    element.setAttribute('class', 'menu');
    tools_li.setAttribute('class', 'tools');
    tools_menu.setAttribute('class', 'list');
    more_li.setAttribute('class', 'more');
    more_menu.setAttribute('class', 'list');

    /* Hierarquia */
    element.appendChild(tools_li);
    tools_li.appendChild(tools_menu);
    element.appendChild(more_li);
    more_li.appendChild(more_menu);

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
    this.apps = new Collection(tools_menu, [empreendemia.ui.appIcon]);
}