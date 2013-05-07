/** Groupset
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa grupo de grupos
 */

sdk.modules.ui.groupset = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('li'),
            header_div = document.createElement('div'),
            header_name_h3 = document.createElement('h3'),
            header_icons_ul = document.createElement('ul'),
            header_actions_menu = document.createElement('menu'),
            groups_ol = document.createElement('ol'),
            footer_div = document.createElement('div'),
            footer_name_div = document.createElement('li'),
            footer_icons_ul = document.createElement('ul');

        /* CSS */
        element.setAttribute('class', 'group');
        header_div.setAttribute('class', 'header');
        header_name_h3.setAttribute('class', 'hide');
        header_icons_ul.setAttribute('class', 'icons');
        header_actions_menu.setAttribute('class', 'actions');
        groups_ol.setAttribute('class', 'groups');
        footer_div.setAttribute('class', 'footer hide');
        footer_name_div.setAttribute('class', 'name');
        footer_icons_ul.setAttribute('class', 'icons');

        /* Hierarquia */
        element.appendChild(header_div);
        header_div.appendChild(header_name_h3);
        header_div.appendChild(header_icons_ul);
        header_div.appendChild(header_actions_menu);
        element.appendChild(groups_ol);
        element.appendChild(footer_div);
        footer_div.appendChild(footer_name_div);
        footer_div.appendChild(footer_icons_ul);

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
        this.header = {
            title : function (value) {
                if (value === '') {
                    header_name_h3.setAttribute('class', 'hide');
                }
                if (value) {
                    header_name_h3.setAttribute('class', 'name');
                    header_name_h3.innerHTML = value;
                } else {
                    return header_name_h3.innerHTML;
                }
            },
            icons : new Collection(header_icons_ul, [app.ui.icon]),
            actions : new Collection(header_actions_menu, [app.ui.action])
        };
        this.footer = {
            title : function (value) {
                if (value === '') {
                    footer_div.setAttribute('class', 'hide');
                }
                if (value) {
                    footer_div.setAttribute('class', 'footer');
                    footer_name_div.innerHTML = value;
                } else {
                    return footer_name_div.innerHTML;
                }
            },
            icons : new Collection(footer_icons_ul, [app.ui.icon]),
            helper : new empreendemia.ui.helper(footer_div)
        };
        this.visibility = function (value) {
            if (value) {
                switch (value) {
                    case 'hide' :
                        element.setAttribute('class', 'group hide');
                        break;
                    case 'show' :
                        element.setAttribute('class', 'group');
                        break;
                    case 'fade' :
                        element.setAttribute('class', 'group fade');
                        break;
                }
            } else {
                return element.getAttribute('class').replace('group', '');
            }
        };
        this.groups = new Collection(groups_ol, [app.ui.groupset, app.ui.group]);
        /* Setando valores iniciais */
        if (params) {
            if (params.items) {
                this.items.add(params.items);
            }
            if (params.header) {
                this.header.title(params.header.title);
                if (params.header.icons) {
                    this.header.icons.add(params.header.icons);
                }
                if (params.header.actions) {
                    this.header.actions.add(params.header.actions);
                }
            }
            if (params.footer) {
                this.footer.title(params.footer.title);
                if (params.footer.icons) {
                    this.footer.icons.add(params.footer.icons);
                }
                if (params.footer.helper) {
                    this.footer.helper.description(params.footer.helper.description);
                    this.footer.helper.example(params.footer.helper.example);
                }
            }
        }
    };
}
