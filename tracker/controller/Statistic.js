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

        var filter = request.param('filter'),
            now, today, oneDayAgo,
            filterJson, filterStr;

        now = new Date();
        today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        oneDayAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

        if (!filter) filter = '{}';

        filterJson = eval('('+filter+')');

        params.model.Statistic.find(filterJson, function (error, statistics) {
            if (error) {
                response.send(error);
            } else {
                filterStr = filter;

                /* poe as aspas */
                filterStr = filterStr.replace(/(new Date\([0-9a-zA-Z\,\s\.\+\-\*\/\(\)]*\))/g, '\"$1\"');
                filterStr = filterStr.replace(/(((now)|(today)|(oneDayAgo))(\.[a-zA-Z]+\(\))?)/g, '\'$1\'');
                
                /* converta para json */
                filterStr = eval('('+filterStr+')');
                /* converte para string identada */
                filterStr = JSON.stringify(filterStr, undefined, 4);

                /* tira as aspas */
                filterStr = filterStr.replace(/['"](((now)|(today)|(oneDayAgo))(\.[a-zA-Z]+\(\))?)['"]/g, '$1');
                filterStr = filterStr.replace(/"(new Date\([0-9a-zA-Z\,\s\.\+\-\*\/\(\)]*\))"/g, '$1');

                response.render('../view/statistics', {statistics : statistics, filter : filterStr});
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
