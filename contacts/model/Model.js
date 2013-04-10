/** Model
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Montagem da model
 */
var config   = require('./../config.js'),
    mongoose = require('mongoose');

/*  Conectar com o banco de dados  */
mongoose.connect('mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.url + ':' + config.mongodb.port + '/' + config.mongodb.db);

/*  Exportar name-space  */
exports.Contact = require('./Contact.js').Contact;
exports.Category = require('./Category.js').Category;
exports.Company = require('./Company.js').Company;
exports.Field = require('./Field.js').Field;
exports.FieldValue = require('./FieldValue.js').FieldValue;
