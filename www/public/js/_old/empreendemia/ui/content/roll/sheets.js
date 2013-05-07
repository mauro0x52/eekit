/** Logo
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : renderiza o container de colunas da empreendemia
 */

empreendemia.ui.sheets = function () {
    var element = document.createElement('div'),
        that = this;

    /* CSS */
    element.setAttribute('class', 'sheets');

    /* Métodos protegidos */
    this.fitHeight = function () {
        var apps = that.apps.get();
        for (var i in apps) {
            apps[i].height();
        }
    };
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
    this.apps = new Collection(element, [sdk.modules.ui.entity, sdk.modules.ui.list, sdk.modules.ui.frame]);
}