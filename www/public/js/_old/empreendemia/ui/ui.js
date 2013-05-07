/** Ui
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa o namespace da ui
 */

empreendemia.ui = function () {
    var element = document.body,
        body_div = document.createElement('div');

    /* CSS */
    body_div.setAttribute('class', 'body');

    /* Hierarquia */
    element.innerHTML = '';
    element.appendChild(body_div);
    
    /* Elementos específicos do empreendemia */
    this.appIcon = empreendemia.ui.appIcon;
    this.appNavigable = empreendemia.ui.appNavigable;
    this.userOption = empreendemia.ui.userOption;
    this.appMenu = empreendemia.ui.appMenu;
    this.helper = empreendemia.ui.helper;
    
    /*Método públicos*/
    this.header = new empreendemia.ui.header();
    this.content = new empreendemia.ui.content();
    this.feedback = new empreendemia.ui.feedback();
    
    this.header.attach(body_div);
    this.content.attach(body_div);
    this.feedback.attach(body_div);
}