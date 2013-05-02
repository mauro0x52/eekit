var express = require('express'),
    forever = require('forever');

var app = express();

app.get('/service/:id/restart', function (request, response) {
    if (request.param('secret', null) != 'm0n1t0rm4ne1r0p4r4vcs3rf3l1z') {
        response.end();
        return;
    }
    forever.restart(request.params.id + '.js');
    response.end('services restarted');
});

app.get('/services/restart', function (request, response) {
    if (request.param('secret', null) != 'm0n1t0rm4ne1r0p4r4vcs3rf3l1z') {
        response.end();
        return;
    }
    forever.restartAll()
    response.end('services restarted');
});

app.get('/resources', function (request, response) {
    if (request.param('secret', null) != 'm0n1t0rm4ne1r0p4r4vcs3rf3l1z') {
        response.end();
        return;
    }
    var exec = require('child_process').exec;
    exec('uptime', function (error, stdout, stderr) {
        response.send(stdout)
    });
});

app.get('/processes', function (request, response) {
    if (request.param('secret', null) != 'm0n1t0rm4ne1r0p4r4vcs3rf3l1z') {
        response.end();
        return;
    }
    var exec = require('child_process').exec,
        lines, match, result;

    exec('ps aux --sort -%cpu', function (error, stdout, stderr) {
        result = '<table>';
        lines = stdout.split('\n');
        for (var i in lines) {
            result += '<tr>'
            match = lines[i].match(/^([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+(.*)$/);
            result += '<td>'+match[1]+'</td>';
            result += '<td>'+match[2]+'</td>';
            result += '<td>'+match[3]+'</td>';
            result += '<td>'+match[4]+'</td>';
            result += '<td>'+match[5]+'</td>';
            result += '<td>'+match[6]+'</td>';
            result += '<td>'+match[7]+'</td>';
            result += '<td>'+match[8]+'</td>';
            result += '<td>'+match[9]+'</td>';
            result += '<td>'+match[10]+'</td>';
            result += '<td>'+match[11]+'</td>';
            result += '</tr>'
        }
        result += '</table>';
    });
});

app.get('/service/:id/log', function (request, response) {
    if (request.param('secret', null) != 'm0n1t0rm4ne1r0p4r4vcs3rf3l1z') {
        response.end();
        return;
    }
    forever.tail(request.params.id + '.js', function (error, services) {
        var log = services[0].logs;
        for (var i in log) {
            response.write(log[i] + '\n');
        }
        response.end();
    })
});

app.listen(8099)