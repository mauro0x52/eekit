/** Action
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa botão de ação
 */

empreendemia.ui.helper = function (parent) {
    var element = document.createElement('div'),
        description_div = document.createElement('div'),
        example_div = document.createElement('div'),
        arrow_div = document.createElement('div'),
        fill_div = document.createElement('div'),
        that = this;

    /* CSS */
    element.setAttribute('class', 'helper hide');
    description_div.setAttribute('class', 'description');
    example_div.setAttribute('class', 'example');
    arrow_div.setAttribute('class', 'arrow');
    fill_div.setAttribute('class', 'fill');

    /* Hierarquia */
    parent.appendChild(element);
    element.appendChild(description_div);
    element.appendChild(example_div);
    element.appendChild(arrow_div);
    arrow_div.appendChild(fill_div);

    /* Eventos */
    if (parent && parent.addEventListener) {
        parent.addEventListener('click', function () {
            that.hide();
        }, true);
    }
    
    /* Métodos públicos */
    this.description = function (value) {
        if (value === '') {
            description_div.setAttribute('class', 'hide');
        }
        if (value) {
            this.show();
            description_div.setAttribute('class', 'description');
            description_div.innerHTML = value;
        } else {
            return description_div.innerHTML
        }
    };
    this.example = function (value) {
        if (value === '') {
            example_div.setAttribute('class', 'hide');
        }
        if (value) {
            this.show();
            example_div.setAttribute('class', 'example');
            example_div.innerHTML = value;
        } else {
            return example_div.innerHTML
        }
    };
    this.show = function (value) {
        element.setAttribute('class', 'helper');
    };
    this.hide = function (value) {
        element.setAttribute('class', 'helper hide');
    };
}
