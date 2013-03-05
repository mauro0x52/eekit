/** GetCookie
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : pega um cookie do navegador
 * @param c_name : nome do cookie
 */
function getCookie(c_name)
{
    var i,
        x,
        y,
        ARRcookies = document.cookie.split(";"),
        res;

    for (i=0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g,"");

        if (x==c_name) {
            res = unescape(y);
        }
    }
    return res;
}

/** SetCookie
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : insere um cookie do navegador
 * @param c_name : nome do cookie
 * @param value : valor do cookie
 * @param exdays : periodo de expiração do cookie
 */
function setCookie(c_name,value,exdays)
{
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);

    var c_value = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

/** JsonToQuery
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : converte um objeto jSon em query
 * @param obj : objeto que vai ser passado para string
 * @param label : label do objeto
 */
function jsonToQuery (obj, label) {
    var query_string = "",
        key;

    if (typeof obj === 'number' || typeof obj === 'string' || typeof obj === 'boolean' || (obj && obj.constructor === Date) || obj === null) {
        if (label){
            if (obj === null) {
                return label + '=';
            }
            if (obj && obj.replace) obj = obj.replace(/\n/g, "%0A");
            return label + '=' + obj;
        }
    } else {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                query_string += jsonToQuery(obj[key], (label ? label + '[' + key + ']' : key)) + '&';
            }
        }
        return query_string.slice(0, query_string.length - 1);
    }
};

/** QueryToJson
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : converte a query em JSON
 */
function queryToJson (value) {
    var href = value;
    var qStr = href.replace(/(.*?\?)/, '');
    var qArr = qStr.split('&');
    var stack = {};
    for (var i in qArr) {
        var a = qArr[i].split('=');
        var name = a[0],
            value = isNaN(a[1]) ? a[1] : parseFloat(a[1]);
        if (name.match(/(.*?)\[(.*?)]/)) {
            name = RegExp.$1;
            var name2 = RegExp.$2;
            //alert(RegExp.$2)
            if (name2) {
                if (!(name in stack)) {
                    stack[name] = {};
                }
                stack[name][name2] = value;
            } else {
                if (!(name in stack)) {
                    stack[name] = [];
                }
                stack[name].push(value);
            }
        } else {
            stack[name] = value;
        }
    }
    return stack;
};

/** AjaxRequest
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : realiza chamada AJAX
 * @param url : endereço a ser chamado pelo http
 * @param method : método da chamada AJAX
 * @param data : data a ser enviada pela chamada AJAX
 * @param cb : callback a ser chamado com a informação
 */
function ajaxRequest (url, method, data, cb, local) {
    var invocation;

    data = data || {};
    data.rand = (new Date).getTime();

    try {
        /* Testa chamada para o IE */
        if (local) {
            invocation = new XMLHttpRequest();
        } else if (window.XDomainRequest) {
            invocation = new XDomainRequest();
        } else {
            invocation = new XMLHttpRequest();
        }
        /* Verifica se ajax esta disponível no browser */
        if (invocation) {
            /* Callback de sucesso */
            invocation.onload = function () {
                if (cb) {
                    cb(invocation.responseText);
                }
            };
            /* Callback de falha */
            invocation.onerror = function (error) {
                cb("{error : 'ocorreu um erro ao acessar o servidor'}");
            };
            /* dispara a chamada */
            invocation.open(method, url + "?" + jsonToQuery(data), true);
            invocation.send();
        } else {
            console.error('unable to create request object');
        }
    } catch (error) {
        console.error(error);
    }
}

/** Collection
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Gerencia os filhos de um objeto HTML
 * @param HTMLobject : objeto que vai ter os filhos gerenciados
 * @param constructors : vetor de construtores que são aceitados no objeto
 */
function Collection (HTMLobject, constructors) {
    var childs_objects = [],
        that = this,
        classAttr = (HTMLobject.getAttribute('class') ? HTMLobject.getAttribute('class') : '').replace('hide', '');

    HTMLobject.setAttribute('class', classAttr + ' hide');

    function canPut (obj) {
        for (var i in constructors) {
            if (obj.constructor === constructors[i]) {
                return true;
            }
        }
        return false;
    }

    this.get = function (ids) {
        var i,
        res = [];
        if (ids === undefined) {
            for (i = 0; i < childs_objects.length; i = i + 1) {
                res.push(childs_objects[i]);
            }
        } else if (ids.constructor === Array) {
            for (i = 0; i < ids.length; i = i + 1) {
                res.push(this.get(ids[i]));
            }
        } else if (ids.constructor === String) {
            for (i = 0; i < childs_objects.length; i = i + 1) {
                if (childs_objects[i].getID() === ids) {
                    res = childs_objects[i];
                }
            }
        }
        return res;
    };

    this.add = function (elements) {
        var i;

        if (elements) {
            if (elements.constructor === Array) {
                for (i = 0; i < elements.length; i = i + 1) {
                    this.add(elements[i]);
                }
            } else {
                if (HTMLobject && elements && elements.attach && canPut(elements)) {
                    /* insere elemento */
                    childs_objects.push(elements);
                    elements.attach(HTMLobject, that);
                    /* remove classe hide */
                    if (childs_objects.length > 0) {
                        HTMLobject.setAttribute('class', classAttr);
                    } else {
                        HTMLobject.setAttribute('class', classAttr + ' hide');
                    }
                }
            }
        }
    };

    this.remove = function (ids) {
        var i, j,
            removeds = [],
            newarray = [];
        if (ids === undefined) {
            for (i = 0; i < childs_objects.length; i = i + 1) {
                removeds.push(i);
            }
        } else if (ids.constructor === Array) {
            for (i = 0; i < ids.length; i = i + 1) {
                for (j = 0; j < childs_objects.length; j = j + 1) {
                    if (childs_objects[j] === ids[i]) {
                        removeds.push(j);
                    }
                }
            }
        } else {
            for (i = 0; i < childs_objects.length; i = i + 1) {
                if (childs_objects[i] === ids) {
                    removeds.push(i);
                }
            }
        }
        for(i = 0; i < removeds.length; i = i + 1) {
            childs_objects[removeds[i]].detach(HTMLobject, that);
        }
        for(i = 0; i < childs_objects.length; i = i + 1) {
            var removed = false;
            for(j = 0; j < removeds.length; j = j + 1) {
                if (i === removeds[j]) {
                    removed = true;
                }
            }
            if (!removed) {
                newarray.push(childs_objects[i]);
            }
        }
        childs_objects = newarray;
        /* insere classe hide */
        if (childs_objects.length === 0) {
            HTMLobject.setAttribute('class', classAttr + ' hide');
        } else {
            HTMLobject.setAttribute('class', classAttr);
        }
    };
}

document.startDrag = function (html) {
    var onMouseMove = function (e) {
        var y = 0,
            x = 0;

        if (!e) {
            e = document.lastclick;
        }
        if (e.pageY) {
            y = e.pageY;
            x = e.pageX;
        } else {
            y = (e ? e.clientY : 0) + document.body.scrollTop;
            x = (e ? e.clientX : 0) + document.body.scrollLeft;
        }
        y -= 10;
        x += 10;
        if (y < 140) {
            y = 140;
        }
        html.style.top = y;
        html.style.left = x;
    };
    html.setAttribute('class', 'item draggable');
    document.body.appendChild(html);
    document.onmousemove = onMouseMove;
    onMouseMove();
};

document.stopDrag = function () {
    document.onmousemove = function () {

    };
};
