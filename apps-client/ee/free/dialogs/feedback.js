app.routes.dialog('/feedback', function (params, data) {
    app.ui.title('Enviar um feedback');

    var html = data.html,
        events = data.events,
        user = data.user,
        message = new app.ui.inputText({legend : 'Mensagem', name : 'message'}),
        email = new app.ui.inputText({legend : 'Email', name : 'email'}),
        fieldset = new app.ui.fieldset({legend : 'mensagem', fields : [message]});

    if (!user) {
        fieldset.fields.add(email);
    }

    app.ui.form.fieldsets.add(fieldset);
    app.ui.form.action('feedbackar!');

    message.focus();

    app.ui.form.submit(function () {
        app.ajax.post({
            url : 'http://' + app.config.services.www.host + ':' + app.config.services.www.port + '/feedback',
            data : {
                email : email.value() || user,
                message : message.value(),
                events : events,
                user : user,
                html : escape(html)
            }
        }, function (response) {
            if (!response) {
                app.close();
            }
        });
    });
});