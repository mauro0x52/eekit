/**
 * Home
 *
 * @author Rafael Erthal
 * @since 2013-01
 */

app.routes.frame('/', function (params, data) {
    app.tracker.event('visualizar home');
    app.ui.html([
    	{
    		tag : 'h3',
    		html : 'Olá, seja bem vindo!',
    		attributes : {
    			style : 'margin:20px'
    		}
    	},
    	{
    		tag : 'p',
    		html : 'Cadastre-se agora e escolha a sua ferramenta.',
    		attributes : {
    			style : 'margin:20px'
    		}
    	}
	]);
});