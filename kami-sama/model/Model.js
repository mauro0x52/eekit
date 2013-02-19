/** Model
 * @author : Rafael Erthal
 * @since : 2013-01
 *
 * @description : Montagem da model
 */
var config   = require('./../config.js'),
    mongoose = require('mongoose');

/*  Conectar com o banco de dados  */
mongoose.connect('mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.url + ':' + config.mongodb.port + '/' + config.mongodb.db);

/*  Exportar name-space  */
exports.Event= require('./Event.js').Event;