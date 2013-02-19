/** Item
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa item
 */

sdk.modules.ui.item = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('li'),
            thumbnail_div = document.createElement('div'),
            label_div = document.createElement('div'),
            thumbnail_a = document.createElement('a'),
            thumbnail_img = document.createElement('img'),
            title_h4 = document.createElement('h4'),
            title_anchor = document.createElement('a'),
            icons_ul = document.createElement('ul'),
            description_p = document.createElement('p'),
            actions_menu = document.createElement('menu'),
            arrow_div = document.createElement('div'),
            fill_div = document.createElement('div'),
            drop_cb,
            drag_cb,
            click_cb,
            that = this,
            droppableGroups;

        /* CSS */
        element.setAttribute('class', 'item');
        thumbnail_div.setAttribute('class', 'thumbnail');
        label_div.setAttribute('class', 'hide');
        thumbnail_a.setAttribute('class', 'anchor');
        thumbnail_img.setAttribute('class', 'hide');
        title_h4.setAttribute('class', 'title');
        title_anchor.setAttribute('class', 'hide');
        icons_ul.setAttribute('class', 'icons');
        description_p.setAttribute('class', 'hide');
        actions_menu.setAttribute('class', 'actions');
        arrow_div.setAttribute('class', 'image arrow');
        fill_div.setAttribute('class', 'fill');

        /* Eventos */
        element.addEventListener('click', function (e) {
            var releasable = app.ui.releasable(),
                receptive =  app.ui.receptive();

            if (releasable && releasable.constructor === app.ui.item && receptive && receptive.constructor === app.ui.group) {

                e.preventDefault();
                e.stopPropagation();
                
                releasable.detach(document.body, ['aaa']);

                var items = receptive.items.get(),
                    position = 1;

                receptive.items.remove();
                for (var j in items) {
                    if (items[j] === that) {
                        releasable.drop(receptive, position);
                        position++;
                    }
                    items[j].drop(receptive, position);
                    position++;
                }
            }
        }, true);

        title_anchor.addEventListener('click', function (e) {
            if (click_cb) {
                click_cb.apply(app);
            }

            return false;
        }, true);

        /* Hierarquia */
        element.appendChild(label_div);
        element.appendChild(thumbnail_div);
        thumbnail_div.appendChild(thumbnail_a);
        thumbnail_a.appendChild(thumbnail_img);
        element.appendChild(title_h4);
        title_h4.appendChild(title_anchor);
        element.appendChild(icons_ul);
        element.appendChild(description_p);
        element.appendChild(actions_menu);
        element.appendChild(arrow_div);
        arrow_div.appendChild(fill_div);

        /* Métodos protegidos */
        this.attach = function (HTMLobject, collection) {
            if (HTMLobject && collection && HTMLobject.appendChild) {
                parent = collection
                HTMLobject.appendChild(element);
            }
        };
        this.detach = function (HTMLobject, collection) {
            if (HTMLobject && collection && HTMLobject.removeChild && element) {
                HTMLobject.removeChild(element);
            } else {
                parent.remove(that);
            }
        };
        /* Métodos públicos */
        this.droppableGroups = function (value) {
            if (value && value.constructor === Array) {
                droppableGroups = value;
            } else {
                return droppableGroups;
            }
        };
        this.label = {
            color : function (value) {
                if (value === '') {
                    label_div.setAttribute('class', 'hide');
                }
                if (value) {
                    label_div.setAttribute('class', 'label ' + value);
                } else {
                    return label_div.getAttribute('class').replace('label');
                }
            },
            legend : function (value) {
                if (value === '') {
                    label_div.setAttribute('class', 'hide');
                }
                if (value) {
                    label_div.innerHTML = value;
                } else {
                    return label_div.innerHTML;
                }
            }
        };
        this.thumbnail = function (value) {
            if (value === '') {
                thumbnail_img.setAttribute('class', 'hide');
            }
            if (value) {
                thumbnail_img.setAttribute('class', 'image');
                thumbnail_img.setAttribute('src', value);
            } else {
                return thumbnail_img.getAttribute('src');
            }
        };
        this.title = function (value) {
            if (value === '') {
                title_anchor.setAttribute('class', 'hide');
            }
            if (value) {
                title_anchor.setAttribute('class', 'anchor');
                title_anchor.innerHTML = value;
            } else {
                return title_anchor.innerHTML;
            }
        };
        this.description = function (value) {
            if (value === '') {
                description_p.setAttribute('class', 'hide');
            }
            if (value) {
                description_p.setAttribute('class', 'description');
                description_p.innerHTML = value;
            } else {
                return description_p.innerHTML;
            }
        };
        this.href = function (value) {
            if (value === '') {
                element.setAttribute('class', 'item');
            } else if (value) {
                element.setAttribute('class', 'item clickable');
            }
            if (value) {
                thumbnail_a.setAttribute('href', value);
                title_anchor.setAttribute('href', value);
            } else {
                return thumbnail_a.getAttribute('href');
            }
        };
        this.click = function (value) {
            if (value) {
                element.setAttribute('class', 'item clickable');
                click_cb = value;
            } else {
                element.setAttribute('class', 'item');
                if (click_cb) {
                    click_cb.apply(app);
                }
            }
        }
        this.drop = function (value, position) {
            if (value && !position) {
                drop_cb = value;
            } else {
                if (position) {
                    var droppableGroups = that.droppableGroups();
                    for (var i = 0; i < droppableGroups.length; i++) {
                        droppableGroups[i].droppable(false);
                    }

                    app.ui.receptive(null);
                    app.ui.releasable(null);
                    value.items.add(that);
                    document.stopDrag();
                    element.setAttribute('style', '');
                    if (click_cb) {
                        element.setAttribute('class', 'item clickable');
                    } else {
                        element.setAttribute('class', 'item');
                    }
                    if (drop_cb) {
                        drop_cb(value, position);
                    }
                }
            }
        };
        this.drag = function (value) {
            if (value) {
                drag_cb = value;
            } else {
                if (app.ui.releasable && !app.ui.releasable()) {
                    var droppableGroups = that.droppableGroups();
                    for (var i in droppableGroups) {
                        droppableGroups[i].droppable(true);
                    }

                    app.ui.receptive(null);
                    app.ui.releasable(that);
                    that.detach();
                    document.startDrag(element);
                    if (drag_cb) {
                        drag_cb();
                    }
                }
            }
        };
        this.visibility = function (value) {
            if (value) {
                switch (value) {
                    case 'hide' :
                        element.setAttribute('class', 'item hide');
                        break;
                    case 'show' :
                        if (click_cb) {
                            element.setAttribute('class', 'item clickable');
                        } else {
                            element.setAttribute('class', 'item');
                        }
                        break;
                    case 'fade' :
                        element.setAttribute('class', 'item fade');
                        break;
                }
            } else {
                return element.getAttribute('class').replace('item', '');
            }
        };
        this.icons = new Collection(icons_ul, [app.ui.icon]);
        this.actions = new Collection(actions_menu, [app.ui.action]);
        this.helper = new empreendemia.ui.helper(element);
        /* Setando valores iniciais */
        if (params) {
            this.thumbnail(params.thumbnail);
            this.title(params.title);
            this.description(params.description);
            this.href(params.href);
            this.visibility(params.visibility);
            this.icons.add(params.icons);
            this.actions.add(params.actions);
            this.droppableGroups(params.droppableGroups);
            this.drop(params.drop);
            this.click(params.click);
            if (params.label) {
                this.label.color(params.label.color);
                this.label.legend(params.label.legend);
            }
            if (params.helper) {
                this.helper.description(params.helper.description);
                this.helper.example(params.helper.example);
            }
        }
    };
}