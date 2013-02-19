/** Routes
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de rotas do navegador
 */
empreendemia.routes = {
    /** add
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : adiciona uma nova rota na address bar
     * @param value : valor a ser setado
     */
    set : function (value) {
        location.hash = '!/' + value;
    },
    
    /** get
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : retorna conjunto de rotas
     */
    get : function () {
        return location.hash.replace('#!/', '');
    }
};