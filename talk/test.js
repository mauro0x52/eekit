var xmpp = require('node-xmpp');

jabber = new xmpp.Client({
	jid: "rafaerthal@gmail.com",
	password: "rafael90",
	host: "talk.google.com",
	port: 5222
});

jabber.on('stanza', function(stanza) {
	console.log(stanza);
});