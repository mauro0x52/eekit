/** EmbeddedEntity
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa a entity embedded da UI de ferramenta
 */

sdk.modules.ui.embeddedEntity = function (app) {
    var element = document.createElement('div'),
        header_div = document.createElement('div'),
        title_h4 = document.createElement('h4'),
        body_div = document.createElement('div'),
        title_h5 = document.createElement('h5'),
        description_p = document.createElement('p'),
        datasets_div = document.createElement('div'),
        click_cb;

    /* CSS */
    element.setAttribute('class', 'related entity');
    header_div.setAttribute('class', 'header');
    title_h4.setAttribute('class', 'title');
    body_div.setAttribute('class', 'body');
    title_h5.setAttribute('class', 'title');
    description_p.setAttribute('class', 'description');
    datasets_div.setAttribute('class', 'data-sets');

    /* Hierarquia */
    element.appendChild(header_div);
    header_div.appendChild(title_h4);
    element.appendChild(body_div);
    body_div.appendChild(title_h5);
    body_div.appendChild(description_p);
    body_div.appendChild(datasets_div);

    /* Eventos */
    title_h5.addEventListener('click', function () {
        if (click_cb) {
            click_cb.apply(app);
        }
    }, true);

    /* Métodos protegidos */
    this.attach = function (HTMLobject) {
        if (HTMLobject && HTMLobject.appendChild) {
            HTMLobject.appendChild(element);
            empreendemia.ui.content.roll.sheets.fitHeight();
        }
    };
    this.detach = function () {
        if (element.parentNode && element.parentNode && element.parentNode.removeChild) {
            element.parentNode.removeChild(element);
        }
    };

    /* Elementos específicos de ferramenta */
    this.action = new sdk.modules.ui.action(app);
    this.data = new sdk.modules.ui.data(app);
    this.dataset = new sdk.modules.ui.dataset(app);
    this.value = new sdk.modules.ui.value(app);

    /* Métodos públicos */
    this.loading = function (value) {
        if (value) {
            element.setAttribute('class', 'related entity loading');
        } else {
            element.setAttribute('class', 'related entity');
        }
    };
    this.heading = this.title = function (value) {
        if (value) {
            title_h4.innerHTML = value;
        } else {
            return title_h4.innerHTML;
        }
    };
    this.subtitle = function (value) {
        if (value) {
            title_h5.innerHTML = value;
        } else {
            return title_h5.innerHTML;
        }
    };
    this.description = function (value) {
        if (value) {
            description_p.innerHTML = value;
        } else {
            return description_p.innerHTML;
        }
    };
    this.label = function (value) {
        //@TODO implementar método
    };
    this.thumbnail = function (value) {
        //@TODO implementar método
    };
    this.click = function (value) {
        if (value) {
            click_cb = value;
        } else {
            if (click_cb) {
                click_cb.apply(app);
            }
        }
    }
    this.datasets = new Collection(datasets_div, [this.dataset]);
}
