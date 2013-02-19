/** Tests Apps.App
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller App do serviço Apps
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand;


describe('GET /apps', function () {
    it('url tem que existir', function(done) {
        api.get('apps', '/apps', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('lista aplicativos', function(done) {
        api.get('apps', '/apps', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('apps');
                for (var i = 0 ; i < data.apps.length; i = i + 1) {
                    data.apps[i].should.have.property('_id');
                    data.apps[i].should.have.property('slug');
                    data.apps[i].should.have.property('name');
                    data.apps[i].should.have.property('type');
                }
                done();
            }
        });
    });
});

describe('GET /app/[slug]', function () {
    it('url tem que existir', function(done) {
        api.get('apps', '/app/asfaexzcv', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.get('apps', '/app/inexistente', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('app existente', function(done) {
        api.get('apps', '/app/tarefas', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('app').have.property('_id');
                data.should.have.property('app').have.property('slug');
                data.should.have.property('app').have.property('name');
                data.should.have.property('app').have.property('type');
                done();
            }
        });
    });
});
