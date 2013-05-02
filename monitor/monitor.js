var express = require('express'),
    forever = require('forever');

var app = express();

app.get('/service/:id/restart', function (request, response) {
    forever.restart(request.params.id + '.js');
    response.end('services restarted');
});

app.get('/services/restart', function (request, response) {
    forever.restartAll()
    response.end('services restarted');
});

app.get('/resources', function (request, response) {
    var exec = require('child_process').exec;
    exec('uptime', function (error, stdout, stderr) {
        response.send(stdout)
    });

});

app.get('/service/:id/log', function (request, response) {
    forever.tail(request.params.id + '.js', function (error, services) {
        var log = services[0].logs;
        for (var i in log) {
            response.write(log[i] + '\n');
        }
        response.end();
    })
});

app.listen(8999)