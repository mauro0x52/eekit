/**
 * Home
 *
 * @author Rafael Erthal
 * @since 2013-01
 */

app.routes.frame('/', function (params, data) {
    var html = '';
    app.tracker.event('visualizar home');
    html += '<h3 style="margin:20px">Olá, seja bem vindo!</h3>';
    html += '<p style="margin:20px">Cadastre-se agora e escolha a sua ferramenta.</p>';
    app.ui.html(html);
});