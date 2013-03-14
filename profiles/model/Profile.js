/** Profile
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Representação da entidade de profile
 */

var mongoose = require('mongoose'),
    crypto   = require('crypto'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    profileSchema,
    Profile;

profileSchema = new schema({
    user      : {type : objectId},
    slug        : {type : String, trim : true, unique : true},
    name        : {type : String, required : true, trim : true},
    surname     : {type : String, trim : true},
    dateCreated : {type : Date},
    dateUpdated : {type : Date},
    about       : {type : String},
    phone       : {type : String},
    /* Dados para pesquisa dos usuário */
    role        : {type : String, trim : true},
    sector      : {type : String, trim : true},
    size        : {type : String, trim : true},
    why         : {type : String, trim : true}
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : gera slug do profile
 */
profileSchema.pre('save', function(next) {
    var crypto = require('crypto'),
        slug, foundSlug,
        charFrom = 'àáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ',
        charTo   = 'aaaaaaceeeeiiiinooooooouuuuyy',
        profile = this;

    this.name = this.name.replace(/\s+/g, ' ');

    slug = this.name + ' ' + this.surname;
    slug = slug.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '-').toLowerCase();
    // remove acentos
    for (var i = 0; i < charFrom.length; i++) {
        slug = slug.replace(new RegExp(charFrom.charAt(i), 'g'), charTo.charAt(i))
    }
    slug = slug.replace(/[^a-z,0-9,\-]/g, '');

    Profile.find({slug : slug, _id : {$ne : this._id}}, function (error, data) {
        if (error) next(error);
        else {
            if (data.length === 0) {
                profile.slug = slug;
            }
            else {
                profile.slug = slug + '-' + data.length + '' + crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 1);
            }
            next();
        }

    });
});

/** FindByIdentity
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Procura um profile pelo id ou pelo slug
 * @param id : id ou slug do profile
 * @param cb : callback a ser chamado
 */
profileSchema.statics.findByIdentity = function (id, cb) {
    "use strict";

    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        Profile.findById(id, cb);
    } else {
        // procura por slug
        Profile.findOne({slug : id}, cb);
    }
};

/*  Exportando o pacote  */
Profile = exports.Profile = mongoose.model('Profiles', profileSchema);