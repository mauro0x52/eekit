/**
 * Statistic
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */

module.exports = function (params) {
    "use strict";

    /**
     * GET /statistics
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    params.app.get('/statistics', function (request,response) {
        if (request.param('secret', null) != 'tr4ck3r') {
            response.end();
            return;
        }

        response.contentType('text/html');

        var filter = request.param('filter');
        if (!filter) filter = '{}';

        filter = eval('('+filter+')');

        params.model.Statistic.find(filter, function (error, statistics) {
            if (error) {
                response.send(error);
            } else {
                response.render('../view/statistics', {statistics : statistics, filter : filter});
            }
        });
    });

    /**
     * GET /user/:id/statistic
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    params.app.get('/user/:id/statistic', function (request,response) {
        if (request.param('secret', null) != 'tr4ck3r') {
            response.end();
            return;
        }

        response.contentType('text/html');

        params.model.Statistic.findOne({user : request.params.id}, function (error, statistic) {
            if (error) {
                response.send(error);
            } else if (!statistic) {
                response.send('not found');
            } else {
                response.render('../view/user_statistic', {statistic : statistic});
            }
        });
    });
}
