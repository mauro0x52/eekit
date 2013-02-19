/** InputOption
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa inputs
 */

sdk.modules.ui.inputOption = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('li'),
            image_div = document.createElement('div'),
            label_div = document.createElement('div'),
            thumb_div = document.createElement('div'),
            legend_div = document.createElement('div'),
            cb,
            name,
            status = false;

        /* CSS */
        element.setAttribute('class', 'option');
        image_div.setAttribute('class', 'image check-box');
        label_div.setAttribute('class', 'hide');
        thumb_div.setAttribute('class', 'hide');
        legend_div.setAttribute('class', 'legend');

        /* Hierarquia */
        element.appendChild(image_div);
        element.appendChild(label_div);
        element.appendChild(thumb_div);
        element.appendChild(legend_div);

        /* Eventos */
        element.addEventListener('click', function () {
            status = !status;
            if (status) {
                element.setAttribute('class', 'option selected');
            } else {
                element.setAttribute('class', 'option');
            }
            if (cb) {
                cb.apply(app);
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
        this.legend = function (value) {
            if (value) {
                if (value.substring(0,20) !== value) {
                    legend_div.innerHTML = value.substring(0,20) + '...';
                } else {
                    legend_div.innerHTML = value
                }
            } else {
                return legend_div.innerHTML;
            }
        };
        this.label = function (value) {
            if (value === '') {
                label_div.setAttribute('class', 'hide');
            }
            if (value) {
                label_div.setAttribute('class', 'label ' + value);
            } else {
                return label_div.getAttribute('class').replace('label ', '');
            }
        };
        this.image = function (value) {
            if (value === '') {
                thumb_div.setAttribute('class', 'hide');
            }
            if (value) {
                thumb_div.setAttribute('class', 'image icon ' + value);
            } else {
                return thumb_div.getAttribute('class').replace('image icon ', '');
            }
        };
        this.clicked = function (value) {
            if (value === true || value === false) {
                status = value;
                if (status) {
                    element.setAttribute('class', 'option selected');
                } else {
                    element.setAttribute('class', 'option');
                }
            } else {
                return status;
            }
        };
        this.change = function (value) {
            if (value) {
                cb = value;
            } else {
                if (cb) {
                    cb.apply(app);
                }
            }
        };
        this.value = function (value) {
            if (value) {
                name = value
            } else {
                return name;
            }
        };
        this.visibility = function (value) {
            if (value) {
                switch (value) {
                    case 'hide' :
                        if (status) {
                            element.setAttribute('class', 'option hide selected');
                        } else {
                            element.setAttribute('class', 'option hide');
                        }
                        break;
                    case 'show' :
                        if (status) {
                            element.setAttribute('class', 'option selected');
                        } else {
                            element.setAttribute('class', 'option');
                        }
                        break;
                    case 'fade' :
                        if (status) {
                            element.setAttribute('class', 'option fade selected');
                        } else {
                            element.setAttribute('class', 'option fade');
                        }
                        break;
                }
            } else {
                return element.getAttribute('class').replace('option', '');
            }
        };

        /* Setando valores iniciais */
        if (params) {
            this.legend(params.legend);
            this.label(params.label);
            this.image(params.image);
            this.clicked(params.clicked);
            this.change(params.change);
            this.value(params.value);
        }
    };
}