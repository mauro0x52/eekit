/** Header
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : renderiza o cabeçalho da empreendemia
 */

empreendemia.ui.header = function () {
    var element = document.createElement('div');

    /* CSS */
    element.setAttribute('class', 'header hide');

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
    this.visibility = function (value) {
        if (value) {
            switch (value) {
                case 'hide' :
                    element.setAttribute('class', 'header hide');
                    break;
                case 'show' :
                    element.setAttribute('class', 'header');
                    break;
                case 'fade' :
                    element.setAttribute('class', 'header fade');
                    break;
            }
        } else {
            return element.getAttribute('class').replace('header ', '');
        }
    };

    this.logo = new empreendemia.ui.logo();
    this.menu = new empreendemia.ui.menu();
    this.user = new empreendemia.ui.user();

    /* Hierarquia */
    this.logo.attach(element);
    this.menu.attach(element);
    this.user.attach(element);
}