/** Auth
 * @author : Rafael Erthal
 * @since : 2013-02
 *
 * @description : Representação da entidade de autenticação de serviço
 */

var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    authSchema;

authSchema = new Schema({
    service : {type : String, required : true},
    apps    : [{type : objectId}],
    tokens  : [require('./Token.js').Token]
});

exports.Auth = authSchema;