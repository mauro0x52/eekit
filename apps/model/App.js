/** App
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de Aplicativo
 */

var Source   = require('./Source.js').Source,
    mongoose = require('mongoose'),
    crypto   = require('crypto'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    appSchema,
    App;

appSchema = new Schema({
    name        : {type : String, trim : true, required : true},
    slug        : {type : String, trim : true, unique : true},
    creator     : {type : String, trim : true, required : true},
    compulsory  : {type: Boolean}
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : gera slug do app
 */
appSchema.pre('save', function(next) {
    var crypto = require('crypto'),
        slug, foundSlug,
        charFrom = 'àáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ',
        charTo   = 'aaaaaaceeeeiiiinooooooouuuuyy',
        app = this;

    this.name = this.name.replace(/\s+/g, ' ');

    slug = this.name;
    slug = slug.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '-').toLowerCase();
    // remove acentos
    for (var i = 0; i < charFrom.length; i++) {
        slug = slug.replace(new RegExp(charFrom.charAt(i), 'g'), charTo.charAt(i))
    }
    slug = slug.replace(/[^a-z,0-9,\-]/g, '');

    App.find({slug : slug, _id : {$ne : this._id}}, function (error, data) {
        if (error) next(error);
        else {
            if (data.length === 0) {
                app.slug = slug;
            }
            else {
                app.slug = slug + '-' + data.length + '' + crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 1);
            }
            next();
        }

    });
});


/** FindByIdentity
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Procura um app pelo id ou pelo slug
 * @param id : id ou slug do app
 * @param cb : callback a ser chamado
 */
appSchema.statics.findByIdentity = function (id, cb) {
    "use strict";


    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        App.findById(id, cb);
    } else {
        // procura por slug
        App.findOne({slug : id}, cb);
    }
};

/*  Exportando o pacote  */
App = exports.App = mongoose.model('App', appSchema);