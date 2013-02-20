/** Itau
 * @author : Rafael Erthal
 * @since : 2013-02
 *
 * @description : Representação da entidade de boleto do itau
 */

var Itau = function (params) {

}

require('util').inherits(Itau, require('./Billet').Billet);

/*  Exportando o pacote  */
exports.Itau = Itau;
