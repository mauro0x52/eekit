/** Model
 * @author : Rafael Erthal
 * @since : 2012-09
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
exports.Task = require('./Task.js').Task;
exports.Category = require('./Category.js').Category;
exports.Company = require('./Company.js').Company;
