/** Source
 * @author : Mauro Ribeiro
 * @since : 2012-12
 *
 * @description : Código do aplicativo
 */

var config = require('../config.js'),
    Source;

Source = { findOne : null };

/** FindOne
 * @author : Mauro Ribeiro
 * @since : 2012-09
 *
 * @description : Minifica o código da ferramenta
 */
Source.findOne = function (params, cb) {
    "use strict";

    var fs = require('fs'),
        //jsp = require('uglify-js').parser,
        //pro = require('uglify-js').uglify,
        File = require('file-utils').File,
        folderPath, appSlug,
        source,
        srcFiles, srcModels, srcMenu;

    appSlug = params.app.slug;

    srcFiles = [];
    srcModels = [];

    folderPath = config.appsFiles.path + '/' + appSlug + '/' + params.type;
    folderPath = folderPath.replace('//', '/');

    new File(folderPath).list(function (name, path) {
        if (name === 'menu.js') {
            srcMenu = {name : 'menu', path : path};
        } else if (/.*\/dialogs\/.*\.js$/.test(path)) {
            srcFiles.push({name : name.replace('.js', ''), path : path});
        } else if (/.*\/lists\/.*\.js$/.test(path)) {
            srcFiles.push({name : name.replace('.js', ''), path : path});
        } else if (/.*\/entities\/.*\.js$/.test(path)) {
            srcFiles.push({name : name.replace('.js', ''), path : path});
        } else if (/.*\/frames\/.*\.js$/.test(path)) {
            srcFiles.push({name : name.replace('.js', ''), path : path});
        } else if (/.*\/models\/.*\.js$/.test(path)) {
            srcModels.push({name : name.replace('.js', ''), path : path});
        }
        return true;
    }, function () {
        if (srcFiles.length + srcModels.length === 0) {
            cb({error : { message : 'source not found', name : 'NotFoundError', path : 'source'}})
        } else {
            var i = 0;
            source = '';

            if (srcMenu) {
                source += 'app.menu='
                source += fs.readFileSync(srcMenu.path, 'utf-8');
                source += ';'
            }

            source += 'app.models = {};'
            for (i = 0; i < srcModels.length; i++) {
                source += fs.readFileSync(srcModels[i].path, 'utf-8');
            }

            for (i = 0; i < srcFiles.length; i++) {
                source += fs.readFileSync(srcFiles[i].path, 'utf-8');
            }

            try {
                //source = jsp.parse(source); // parse code and get the initial AST
                //source = pro.gen_code(source); // compressed code here

                source = source;

                cb(undefined, source);
            }
            catch (error) {
                cb(error);
            }
        }
    });

};


/*  Exportando o pacote  */
exports.Source = Source;