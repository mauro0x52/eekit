/** Action
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa botão de ação
 */

sdk.modules.ui.action = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('li'),
            anchor = document.createElement('a'),
            image = document.createElement('div'),
            legend = document.createElement('div'),
            cb,
            that = this;

        /* CSS */
        element.setAttribute('class', 'action');
        anchor.setAttribute('class', 'anchor');
        anchor.setAttribute('target', 'blank');
        anchor.setAttribute('href', '#');
        image.setAttribute('class', 'hide');
        legend.setAttribute('class', 'hide');

        /* Hierarquia */
        element.appendChild(anchor);
        anchor.appendChild(image);
        anchor.appendChild(legend);

        /* Eventos */
        anchor.addEventListener('click', function (event) {
            if (cb) {
                cb.apply(app);
            }
            if (that.href() === '#') {
                event.stopPropagation();
                event.preventDefault();
            }
        }, true);

        /* Métodos protegidos */
        this.attach = function (HTMLobject, collection) {
            if (HTMLobject && collection && HTMLobject.appendChild) {
                parent = collection
                HTMLobject.appendChild(element);
            }
        };
        this.detach = function (HTMLobject, collection) {
            if (HTMLobject && collection && HTMLobject.removeChild) {
                HTMLobject.removeChild(element);
            } else {
                parent.remove(this);
            }
        };
        /* Métodos públicos */
        this.helper = new empreendemia.ui.helper(element);
        this.legend = function (value) {
            if (value === '') {
                legend.setAttribute('class', 'hide');
            }
            if (value) {
                legend.setAttribute('class', 'legend');
                legend.innerHTML = value;
            } else {
                return legend.innerHTML
            }
        };
        this.tip = function (value) {
            if (value === null || value === '') {
                anchor.removeAttribute('title');
            } else if (value) {
                anchor.setAttribute('title', value);
            } else {
                return anchor.getAttribute('title');
            }
        };
        this.image = function (value) {
            if (value === '') {
                image.setAttribute('class', 'hide');
            }
            if (value) {
                image.setAttribute('class', 'image action ' + value);
            } else {
                return image.getAttribute('class').replace('image action ', '');
            }
        };
        this.click = function (value) {
            if (value) {
                cb = value;
            } else {
                if (cb) {
                    cb.apply(app);
                }
            }
        };
        this.href = function (value) {
            if (value) {
                anchor.setAttribute('href', value);
            } else {
                return anchor.getAttribute('href');
            }
        }
        this.visibility = function (value) {
            //@TODO implementar método
        };
        /* Setando valores iniciais */
        if (params) {
            this.legend(params.legend);
            this.tip(params.tip);
            this.image(params.image);
            this.href(params.href);
            this.click(params.click);
            this.visibility(params.visibility);
            if(params.helper) {
                this.helper.description(params.helper.description);
                this.helper.example(params.helper.example);
            }
        }
    };
}
