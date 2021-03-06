/** Model
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Montagem da model
 */
var config   = require('./../config.js'),
    mongoose = require('mongoose');

mongoose.set('debug', true);

/*  Conectar com o banco de dados  */
if (config.mongodb.username && config.mongodb.password) {
    mongoose.connect('mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.url + ':' + config.mongodb.port + '/' + config.mongodb.db);
} else {
    mongoose.connect('mongodb://' + config.mongodb.url + ':' + config.mongodb.port + '/' + config.mongodb.db);
}

/*  Exportar name-space  */
exports.User = require('./User.js').User;
exports.Company = require('./Company.js').Company;
exports.Token = require('./Token.js').Token;
