/** Model
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Montagem da model
 */
var config   = require('./../config.js'),
    mongoose = require('mongoose');

/*  Conectar com o banco de dados  */
if (config.mongodb.username && config.mongodb.password) {
    mongoose.connect('mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.url + ':' + config.mongodb.port + '/' + config.mongodb.db);
} else {
    mongoose.connect('mongodb://' + config.mongodb.url + ':' + config.mongodb.port + '/' + config.mongodb.db);
}
/*  Exportar name-space  */
exports.Billet= require('./Billet.js').Billet;