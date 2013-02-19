/** Logo
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : renderiza o logo da empreendemia
 */

empreendemia.ui.logo = function () {
    var element = document.createElement('div'),
        anchor = document.createElement('a'),
        image_div = document.createElement('div'),
        title_h1 = document.createElement('h1');

    /* CSS */
    element.setAttribute('class', 'logo');
    anchor.setAttribute('class', 'anchor');
    anchor.setAttribute('href', '#');
    anchor.setAttribute('title', 'Página principal');
    image_div.setAttribute('class', 'image');
    title_h1.setAttribute('class', 'title');
    title_h1.innerHTML = 'EmpreendeKit';

    /* Hierarquia */
    element.appendChild(anchor);
    anchor.appendChild(image_div);
    anchor.appendChild(title_h1);
    
    /* Eventos */
    element.addEventListener('click', function () {
        empreendemia.apps.open({
            app   : 'ee',
            route : '/',
            open  : function (tool) {
                tool.open();
                empreendemia.apps.render(tool, true);
            }
        });
    }, true);

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
}