var xmpp = require('node-xmpp');

gtalk = new xmpp.Client({
	jid     : "rafaerthal@gmail.com",
	password: "rafael90",
	host    : "talk.google.com",
	port    : 5222
});

gtalk.on('online', function(){
    console.log("ONLINE");        
	
	gtalk.send(
		new xmpp.Element('presence')
	);
	/*gtalk.send(
		new xmpp.Element('message',{ to: 'mauro0x52@gmail.com', type: 'chat'}).c('body').t('funfando bagarai essa bagaça!!! me manda uma menasgem de teste por favor')
    );*/

	gtalk.on('rawStanza', function (data) {
		console.log(data);
		console.log('-------------------------------')
	})

});

gtalk.on('error', function(e) {
    console.log(e);
});