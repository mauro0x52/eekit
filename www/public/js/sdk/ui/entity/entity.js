/** Entity
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa a entity da UI de ferramenta
 */

sdk.modules.ui.entity = function (app) {
    var element = document.createElement('div'),
        header_div = document.createElement('div'),
        title_h4 = document.createElement('h4'),
        body_div = document.createElement('div'),
        menu_div = document.createElement('div'),
        actions_menu = document.createElement('menu'),
        title_h5 = document.createElement('h5'),
        description_p = document.createElement('p'),
        datasets_div = document.createElement('div'),
        related_div = document.createElement('div'),
        loading_div = document.createElement('div'),
        legend_div = document.createElement('div'),
        image_div = document.createElement('div');

    /* CSS */
    element.setAttribute('class', 'sheet entity');
    header_div.setAttribute('class', 'header');
    title_h4.setAttribute('class', 'title');
    body_div.setAttribute('class', 'body');
    menu_div.setAttribute('class', 'menu');
    actions_menu.setAttribute('class', 'actions');
    title_h5.setAttribute('class', 'title');
    description_p.setAttribute('class', 'description');
    datasets_div.setAttribute('class', 'data-sets');
    related_div.setAttribute('class', 'related');
    loading_div.setAttribute('class', 'loading');
    legend_div.setAttribute('class', 'legend');
    legend_div.innerHTML = 'carregando';
    image_div.setAttribute('class', 'image');

    /* Hierarquia */
    element.appendChild(header_div);
    header_div.appendChild(title_h4);
    element.appendChild(body_div);
    body_div.appendChild(menu_div);
    menu_div.appendChild(actions_menu);
    body_div.appendChild(title_h5);
    body_div.appendChild(description_p);
    body_div.appendChild(datasets_div);
    body_div.appendChild(related_div);
    element.appendChild(loading_div);
    loading_div.appendChild(legend_div);
    loading_div.appendChild(image_div);

    /* Eventos */
    element.addEventListener('click', function (event) {
        if (!app.ui.selected()) {
            event.stopPropagation();
            event.preventDefault();
        }
        empreendemia.ui.content.navigation.focus(app.ui);
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
    this.height = function (value) {
        var height = 460;

        if (document.body && document.body.offsetWidth) {
            height = document.body.offsetHeight;
        }
        if (document.compatMode=='CSS1Compat' &&
            document.documentElement &&
            document.documentElement.offsetWidth
        ) {
            height = document.documentElement.offsetHeight;
        }
        if (window.innerWidth && window.innerHeight) {
            height = window.innerHeight;
        }

        body_div.style.height = height-155;
    };
    this.loading = function (value) {
        if (value) {
            element.setAttribute('class', 'sheet entity loading');
        } else {
            setTimeout(function () {element.setAttribute('class', 'sheet entity');}, 500);
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
    this.actions = new Collection(actions_menu, [this.action]);
    this.datasets = new Collection(datasets_div, [this.dataset]);
    this.embbeds = new Collection(related_div, [sdk.modules.ui.embeddedList, sdk.modules.ui.embeddedEntity])
}
