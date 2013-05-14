/*
 * COnfigurações do eekit
 *
 * @author: rafael erthal
 * @since: 2013-05
 */

var ajax = module.use('ajax');

ajax.get({url : 'http://' + auth + '/services'}, function (data) {
	module.exports({
		services : data.services
	})
})