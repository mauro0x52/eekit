var express = require('express'),
    forever = require('forever');

var app = express();


app.get('/panel', function (request, response) {
    "use strict";

    response.render('../view/index.ejs');
});

app.get('/panel/service/:app', function (request, response) {
    "use strict";

    response.render('../view/service.ejs', { app : request.params.app });
});

/**
 * Reinicia um serviço
 *
 * @author Mauro Ribeiro, Rafael Erthal
 * @since  2013-05
 *
 * @param id    nome do script
 */
app.get('/service/:id/restart', function (request, response) {
    "use strict";

    response.contentType('json');

    if (request.param('secret', null) != 'm0n1t0rm4ne1r0p4r4vcs3rf3l1z') {
        response.send();
        return;
    }
    response.send({ message : 'restarting '+request.params.id+' service'});
    forever.restart(request.params.id + '.js');
});


/**
 * Reinicia todos os serviços
 *
 * @author Mauro Ribeiro, Rafael Erthal
 * @since  2013-05
 */
app.get('/services/restart', function (request, response) {
    "use strict";

    response.contentType('json');

    if (request.param('secret', null) != 'm0n1t0rm4ne1r0p4r4vcs3rf3l1z') {
        response.send();
        return;
    }

    response.send({ message : 'restarting services'});
    forever.restartAll()
});

/**
 * Visualiza recursos da maquina
 *
 * @author Mauro Ribeiro, Rafael Erthal
 * @since  2013-05
 */
app.get('/uptime', function (request, response) {
    "use strict";

    response.contentType('json');

    if (request.param('secret', null) != 'm0n1t0rm4ne1r0p4r4vcs3rf3l1z') {
        response.end();
        return;
    }

    var exec = require('child_process').exec,
        match;

    exec('uptime', function (error, stdout, stderr) {

        match = stdout.match(/(\d\d\:\d\d\:\d\d)\s+up\s+([0-9]+\s+days?,?\s+[0-9a-z\s\:]+),\s+[0-9]+\s+users?,\s+load\s+average:\s+(\d+\.\d\d),\s+(\d+\.\d\d),\s+(\d+\.\d\d)/);

response.send({
            localTime : match[1],
            upTime : match[2],
            loadAverage : {
                1 : match[3],
                5 : match[4],
                15 : match[5]
            }
        })
    });
});


/**
 * Visualiza processos da maquina
 *
 * @author Mauro Ribeiro, Rafael Erthal
 * @since  2013-05
 */
app.get('/processes', function (request, response) {
    "use strict";

    response.contentType('json');

    if (request.param('secret', null) != 'm0n1t0rm4ne1r0p4r4vcs3rf3l1z') {
        response.end();
        return;
    }
    var exec = require('child_process').exec,
        lines, match, processes = [];

    exec('ps aux --sort -%cpu', function (error, stdout, stderr) {
        lines = stdout.split('\n');
        delete lines[0]; // header

        for (var i in lines) {
            if (i !== 0) {
                match = lines[i].match(/^([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+(.*)$/);
                if (match && match[11]) {
                    processes.push({
                        user : match[1],
                        cpu : match[3],
                        memory : match[4],
                        command : match[11],
                        start : match[9],
                        time : match[10]
                    });
                }
            }
        }
        response.send({processes : processes});
    });
});

app.get('/service/:id/log', function (request, response) {
    "use strict";

    response.contentType('json');

    if (request.param('secret', null) != 'm0n1t0rm4ne1r0p4r4vcs3rf3l1z') {
        response.end();
        return;
    }

    forever.tail(request.params.id + '.js', function (error, data) {
        if (error) {
            response.send({ error : error });
        } else {
            if (data instanceof Array && data[0] && data[0].logs) {
                response.send({ log : data[0].logs });
            } else {
                response.send({ data : data });
            }
        }
    })
});

app.listen(8099);