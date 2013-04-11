var Event = require('./model/Model').Event,
    config = require('./config.js'),
	restler = require('restler');

/* Lifecycle do contatos */
Event.lifeCycle(
	{
		labels : ['marcar: contatos'],
		minimum : 1,
        app : 'ee'
	},{
		labels : ['adicionar tarefa', 'adicionar transação'],
		minimum : 1,
        app : 'contatos'
	},
	function (error, users) {
		if (error) {
			console.log(error);
		} else {
			for (var i in users) {
				if ((new Date() - new Date(users[i].firstEvent)) / (1000 * 60 * 60 * 24) < 1) {
					restler.get('http://'+config.services.auth.url+':'+config.services.auth.port+'/user/' + users[i].id, {
				        data: {
				            secret : config.security.secret
				        }
					}).on('success', function(data) {
						if (data && data.user && data.user.tokens) {
							restler.post('http://'+config.services.jaiminho.url+':'+config.services.jaiminho.port+'/mail/self' , {
								data : {
									token : data.user.tokens[0].token,
									from : 'lucas@empreendemia.com.br',
									subject : 'Dicas para organizar o prazo dos seus clientes',
									html :  '' +
                                            'Olá |FNAME|, tudo bom?<br />' +
                                            'Legal que está usando o Empreendekit. <br />' +
                                            'Agora para te ajudar a continuar organizando o prazo dos seus clientes, separei 2 dicas: <br /><br />' +
                                            '1) Adicione um contato<br />' +
                                            '2) Adicione uma tarefa no contato<br /><br />' +
                                            'Para melhorar o desempenho da sua empresa, recomendo que faça isso para seus 3 principais clientes. Você já vai ver a diferença.<br /><br />' +
                                            'Pra acessar o Empreendekit, <a href="http://www.empreendekit.com.br/?utm_source=sendgrid&utm_medium=email&utm_content=email24h-contatos&utm_campaign=lifecycle#!/contatos">clique aqui</a>.<br /><br />' +
                                            'Abraços<br />' +
                                            'Lucas',
									name : 'lifecycle ativação do contatos 1',
									service : 'tracker'
								}
							}).on('success', function(data) {
                                console.log(data);
                            }).on('error', function(error) {
                                console.log(error);
                            });
						}
					});
				}
			}
		}
	}
);

/* Lifecycle do tarefas */
Event.lifeCycle(
	{
		labels : ['marcar: tarefas'],
		minimum : 1,
        app : 'ee'
	},{
		labels : ['marcar tarefa como feita'],
		minimum : 1,
        app : 'tarefas'
	},
	function (error, users) {
		if (error) {
			console.log(error);
		} else {
            for (var i in users) {
                if ((new Date() - new Date(users[i].firstEvent)) / (1000 * 60 * 60 * 24) < 1) {
                    restler.get('http://'+config.services.auth.url+':'+config.services.auth.port+'/user/' + users[i]._id, {
                        data: {
                            secret : config.security.secret
                        }
                    }).on('success', function(data) {
                        if (data && data.user && data.user.tokens) {
                            restler.post('http://'+config.services.jaiminho.url+':'+config.services.jaiminho.port+'/mail/self' , {
                                data : {
                                    token : data.user.tokens[0].token,
                                    from : 'lucas@empreendemia.com.br',
                                    subject : 'Dica para organizar melhor todas as suas tarefas',
                                    html :  '' +
                                            'Olá |FNAME|, tudo bom?<br />' +
                                            'Legal que está usando o Empreendekit. <br />' +
                                            'Agora para te ajudar organizar melhor suas tarefas, separei 2 dicas:<br /><br />' +
                                            '1) Adicione suas principais tarefas dessa próxima semana<br />' +
                                            '2) Crie lembretes para as principais<br /><br />' +
                                            'Assim você não se preocupa em esquecer de fazer tarefas, pagamentos ou cobranças e pode se dedicar mais a seus clientes.<br /><br />' +
                                            'Pra acessar o Empreendekit, <a href="http://www.empreendekit.com.br/?utm_source=sendgrid&utm_medium=email&utm_content=email24h-tarefas&utm_campaign=lifecycle#!/tarefas">clique aqui</a>.<br /><br />' +
                                            'Abraços<br />' +
                                            'Lucas',
                                    name : 'lifecycle ativação do tarefas 1',
                                    service : 'tracker'
                                }
                            }).on('success', function(data) {
                                console.log(data);
                            }).on('error', function(error) {
                                console.log(error);
                            });
                        }
                    });
                }
            }
		}
	}
);

/* Lifecycle do finanças */
Event.lifeCycle(
	{
		labels : ['marcar: finanças'],
		minimum : 1,
        app : 'ee'
	},{
		labels : ['adicionar transação'],
		minimum : 2,
        app : 'financas'
	},
	function (error, users) {
		if (error) {
			console.log(error);
		} else {
            for (var i in users) {
                if ((new Date() - new Date(users[i].firstEvent)) / (1000 * 60 * 60 * 24) < 1) {
                    restler.get('http://'+config.services.auth.url+':'+config.services.auth.port+'/user/' + users[i]._id, {
                        data: {
                            secret : config.security.secret
                        }
                    }).on('success', function(data) {
                        if (data && data.user && data.user.tokens) {
                            restler.post('http://'+config.services.jaiminho.url+':'+config.services.jaiminho.port+'/mail/self' , {
                                data : {
                                    token : data.user.tokens[0].token,
                                    from : 'gabriel@empreendemia.com.br',
                                    subject : 'O último passo para sair da planilha',
                                    html :  '' +
                                            'Olá |FNAME|, tudo bom?<br />' +
                                            'Legal que está usando o Empreendekit. <br />' +
                                            'Agora para te ajudar a sair da planilha de excel, separei 2 dicas:<br /><br />' +
                                            '1) Adicione as movimentações dessa próxima semana<br />' +
                                            '2) Crie lembretes para as principais<br /><br />' +
                                            'Assim você não se preocupa em esquecer de fazer pagamentos ou cobranças e pode se dedicar mais a seus clientes.<br /><br />' +
                                            'Pra acessar o Empreendekit, <a href="http://www.empreendekit.com.br/?utm_source=sendgrid&utm_medium=email&utm_content=email24h-financas&utm_campaign=lifecycle#!/financas">clique aqui</a>.<br /><br />' +
                                            'Abraços<br />' +
                                            'Gabriel',
                                    name : 'lifecycle ativação do finanças 1',
                                    service : 'tracker'
                                }
                            }).on('success', function(data) {
                                console.log(data);
                            }).on('error', function(error) {
                                console.log(error);
                            });
                        }
                    });
                }
            }
		}
	}
);

/* Lifecycle de pagamento */
Event.groupByUser(function (error, users) {
    if (error) {
        console.log(error);
    } else {
        for (var i in users) {
            var date = (new Date() - new Date(users[i].firstEvent)) / (1000 * 60 * 60 * 24);
            if (date > 10 && date < 11) {
                restler.get('http://'+config.services.auth.url+':'+config.services.auth.port+'/user/' + users[i]._id, {
                    data: {
                        secret : config.security.secret
                    }
                }).on('success', function(data) {
                    if (data && data.user && data.user.tokens) {
                        restler.post('http://'+config.services.jaiminho.url+':'+config.services.jaiminho.port+'/mail/self' , {
                            data : {
                                token : data.user.tokens[0].token,
                                from : 'lucas@empreendemia.com.br',
                                subject : 'O último passo para sair da planilha',
                                html :  '' +
                                        'Olá |FNAME|, tudo bom?<br />' +
                                        'Estou mandando este e-mail porque o seu período de testes do EmpreendeKit está terminando. <br />' +
                                        'Existe alguma forma que posso te ajudar, ou sanar alguma dúvida?<br /><br />' +
                                        'Abraços<br />' +
                                        'Lucas',
                                name : 'lifecycle fim do test drive',
                                service : 'tracker'
                            }
                        }).on('success', function(data) {
                            console.log(data);
                        }).on('error', function(error) {
                            console.log(error);
                        });
                    }
                });
            }
        }
    }
});