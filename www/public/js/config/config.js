/*
 * COnfigurações do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var ajax = module.use('ajax');

ajax.get({url : 'http://' + auth + '/services'}, function (services) {
	ajax.get({url : 'http://' + services.services.apps.host + ':' + services.services.apps.port + '/apps'}, function (apps) {
		module.exports({
			services : services.services,
			apps     : apps.apps
		})
	});
})