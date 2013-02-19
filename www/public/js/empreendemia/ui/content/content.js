/** Content
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : implementa o corpo da empreendemia
 */

empreendemia.ui.content = function () {
    var element = document.createElement('div'),
        tool_div = document.createElement('div');

    /* CSS */
    element.setAttribute('class', 'content');
    tool_div.setAttribute('class', 'tool');
    
    /* Hierarquia */
    element.appendChild(tool_div);
    
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
    this.navigation = new empreendemia.ui.navigation();
    this.roll = new empreendemia.ui.roll();
    
    /* Hierarquia */
    this.navigation.attach(tool_div);
    this.roll.attach(tool_div);
}