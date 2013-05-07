/** AppMenu
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : renderiza a barra de navegação da empreendemia
 */

empreendemia.ui.appMenu = function (params) {
    var element = document.createElement('li'),
        anchor_a = document.createElement('a'),
        image_div = document.createElement('div'),
        legend_h3 = document.createElement('h3'),
        arrow_div = document.createElement('div'),
        fill_div = document.createElement('div'),
        href,
        that = this;

    /* CSS */
    element.setAttribute('class', 'item');
    anchor_a.setAttribute('class', 'anchor');
    anchor_a.setAttribute('href', '#');
    image_div.setAttribute('class', 'image menu');
    legend_h3.setAttribute('class', 'legend');
    arrow_div.setAttribute('class', 'arrow');
    fill_div.setAttribute('class', 'fill');

    /* Hierarquia */
    element.appendChild(anchor_a);
    anchor_a.appendChild(image_div);
    anchor_a.appendChild(legend_h3);
    element.appendChild(arrow_div);
    arrow_div.appendChild(fill_div);

    /* Eventos */
    anchor_a.addEventListener('click', function () {
        if (href) {
            empreendemia.routes.set(href);

            var slug = href.split('/')[0],
                route = href.replace(slug, '') || '/';

            empreendemia.apps.open({
                app   : slug,
                route : route,
                open  : function (tool) {
                    tool.open();
                    tool.slug = slug;
                    empreendemia.apps.render(tool);
                }
            });
        }
        return false;
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
    this.helper = new empreendemia.ui.helper(element);
    this.image = function (value) {
        if (value) {
            image_div.setAttribute('class', 'image menu ' + value);
        } else {
            return image_div.getAttribute('class').replace('image menu ', '');
        }
    };
    this.legend = function (value) {
        if (value) {
            legend_h3.innerHTML = value;
        } else {
            return legend_h3.innerHTML;
        }
    };
    this.tip = function (value) {
        if (value === null || value === '') {
            anchor_a.removeAttribute('title');
        } else if (value) {
            anchor_a.setAttribute('title', value);
        } else {
            return anchor_a.getAttribute('title');
        }
    };
    this.href = function (value) {
        if (value) {
            href = value;
            anchor_a.setAttribute('href', '#!/' + href);
        } else {
            return href;
        }
    };
    this.selected = function (value) {
        if (value === true || value === false) {
            if (value) {
                element.setAttribute('class', 'item selected');
            } else {
                element.setAttribute('class', 'item');
            }
        } else {
            return element.getAttribute('class') === 'item selected';
        }
    }

    /* Setando valores iniciais */
    if (params) {
        this.legend(params.legend);
        this.tip(params.tip);
        this.image(params.image);
        this.href(params.href);
        this.selected(params.selected);
    }
}
