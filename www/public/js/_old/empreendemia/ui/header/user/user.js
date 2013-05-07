/** User
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : renderiza o user section da empreendemia
 */

empreendemia.ui.user = function () {
    var element = document.createElement('div'),
        options_menu = document.createElement('menu'),
        thumbnail_div = document.createElement('div'),
        thumbnail_a = document.createElement('a'),
        image_div = document.createElement('div');
    
    /* CSS */
    element.setAttribute('class', 'visitor');
    options_menu.setAttribute('class', 'options');
    thumbnail_div.setAttribute('class', 'thumbnail');
    thumbnail_a.setAttribute('class', 'anchor');
    thumbnail_a.setAttribute('href', '#');
    image_div.setAttribute('class', 'image');
    
    /* Hierarquia */
    element.appendChild(options_menu);
    element.appendChild(thumbnail_div);
    thumbnail_div.appendChild(thumbnail_a);
    thumbnail_a.appendChild(image_div);
    
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
    this.options = new Collection(options_menu, [empreendemia.ui.userOption]);
    this.login = function () {
        element.setAttribute('class', 'user');
    }
    this.logout = function () {
        element.setAttribute('class', 'visitor');
    }
}