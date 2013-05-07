/** userOption
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : ações de usuário no cabaçalho
 */

empreendemia.ui.userOption = function (params) {
    var element = document.createElement('li'),
        option_a = document.createElement('a'),
        click_cb;

    /* CSS */
    element.setAttribute('class', 'option');
    option_a.setAttribute('class', 'anchor');
    option_a.setAttribute('href', '#');

    /* Hierarquia */
    element.appendChild(option_a);
    
    /* Eventos */
    option_a.addEventListener('click', function () {
        if (click_cb) {
            click_cb.apply(empreendemia);
        }
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
    
    /* Métodos públicos */
    this.legend = function (value) {
        if (value) {
            option_a.innerHTML = value;
        } else {
            return option_a.innerHTML;
        }
    };
    this.style = function (value) {
        if (value) {
            element.setAttribute('class', 'option ' + value);
        } else {
            return element.getAttribute('class').replace('option ', '');
        }
    };
    this.click = function (value) {
        if (value) {
            click_cb = value;
        } else {
            if (click_cb) {
                click_cb.apply(empreendemia);
            }
        }
    };
    /* Setando valores iniciais */
    if (params) {
        this.legend(params.legend);
        this.style(params.style);
        this.click(params.click);
    }
}