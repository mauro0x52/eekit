/** appIcon
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : icone de aplicativo no menu pricipal
 */

empreendemia.ui.appIcon = function (params) {
    var element = document.createElement('li'),
        item_a = document.createElement('a'),
        image_div = document.createElement('div'),
        legend_h2 = document.createElement('h2'),
        arrow_div = document.createElement('div'),
        fill_div = document.createElement('div'),
        href,
        that = this;

    /* CSS */
    element.setAttribute('class', 'item');
    item_a.setAttribute('class', 'anchor');
    item_a.setAttribute('href', '#');
    image_div.setAttribute('class', 'image tool');
    legend_h2.setAttribute('class', 'legend');
    arrow_div.setAttribute('class', 'arrow');
    fill_div.setAttribute('class', 'fill');

    /* Hierarquia */
    element.appendChild(item_a);
    item_a.appendChild(image_div);
    item_a.appendChild(legend_h2);
    element.appendChild(arrow_div);
    arrow_div.appendChild(fill_div);

    /* Eventos */
    item_a.addEventListener('click', function (e) {
        var icons = empreendemia.ui.header.menu.apps.get();
        for (var i in icons) {
            icons[i].selected(false);
        }

        that.selected(true);
        if (href) {
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
    this.legend = function (value) {
        if (value) {
            legend_h2.innerHTML = value;
        } else {
            return legend_h2.innerHTML;
        }
    };
    this.image = function (value) {
        if (value) {
            image_div.setAttribute('class', 'image tool ' + value);
        } else {
            return image_div.getAttribute('class').replace('image tool ', '');
        }
    };
    this.title = function (value) {
        if (value) {
            item_a.setAttribute('title', value);
        } else {
            item_a.getAttribute('title');
        }
    };
    this.href = function (value) {
        if (value) {
            href = value;
            item_a.setAttribute('href', '#!/' + href);
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
        this.image(params.image);
        this.title(params.title);
        this.href(params.href);

        var route = (empreendemia.routes.get() + '/').split('/');
        if (route[0] == params.href) {
            this.selected(true);
        }
    }
}
