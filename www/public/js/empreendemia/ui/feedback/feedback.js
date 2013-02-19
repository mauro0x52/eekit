/** Feedback
 *
 * @autor : Rafael Erthal
 * @since : 2013-01
 *
 * @description : renderiza o botao de feedback do empreendemia
 */

empreendemia.ui.feedback = function () {
    var element = document.createElement('div');

    /* CSS */
    element.setAttribute('class', 'feedback');
    element.innerHTML = 'feedback';
    
    /* Eventos */
    element.addEventListener('click', function () {
        empreendemia.user.feedback();
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