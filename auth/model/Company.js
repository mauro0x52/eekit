/**
 * Model da Empresa
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 */

var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    companySchema;

companySchema = new Schema({
    name        : {type : String, required : true},
    services    : [require('./Service.js').Service],
    users       : [{type : objectId}]
});


/**
 * Antes de salvar
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 */
companySchema.pre('save', function (next) {
    if (this.isNew) {
        this.services = [{
            service : 'www',
            apps : []
        }];
        console.log(this)
        next();
    } else {
        next();
    }
});


/**
 * Autentica uma empresa em um serviço
 *
 * @author Mauro Ribeiro
 * @since  2013-03
 *
 * @param service   serviço a ser autenticado
 * @param cb        callback a ser chamado
 */
companySchema.methods.authorize = function (service, cb) {
    "use strict";

    var i, found;

    for (i in this.services) {
        if (this.services[i].service === service) {
            found = this.services[i];
        }
    }
    if (!found) {
        this.services.push({
            service : service
        });

        this.save(function (error) {
            cb(error);
        });
    } else {
        cb();
    }
};

Company = exports.Company = mongoose.model('Company', companySchema);