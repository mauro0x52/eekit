/** Tests Apps.Source
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Source do serviço Apps
 */

var should = require("should"),
    api = require("./utils.js").api,
    db = require("./utils.js").db,
    rand = require("./utils.js").rand;

describe('GET /app/:app_slug/source', function () {
    it('aplicativo inexistente', function(done) {
        api.get('apps', '/app/inexistente/source', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('ferramenta existente', function(done) {
        api.get('apps', '/app/tarefas/source', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('source').include('app={');
                done();
            }
        });
    });
});
