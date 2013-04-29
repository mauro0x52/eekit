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
                                            'Olá ' + data.user.name + ', tudo bom?<br />' +
                                            'Legal que está usando o Empreendekit. <br />' +
                                            'Agora para te ajudar a continuar organizando o prazo dos seus clientes, separei 2 dicas: <br /><br />' +
                                            '1) Adicione um contato<br />' +
                                            '2) Adicione uma tarefa no contato<br /><br />' +
                                            'Para melhorar o desempenho da sua empresa, recomendo que faça isso para seus 3 principais clientes. Você já vai ver a diferença.<br /><br />' +
                                            'Pra acessar o Empreendekit, <a href="http://www.empreendekit.com.br/?utm_source=sendgrid&utm_medium=email&utm_content=email24h-contatos&utm_campaign=lifecycle#!/contatos">clique aqui</a>.<br /><br />' +
                                            'Abraços<br />' +
                                            'Lucas<br /><br />',
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
		labels : ['adicionar tarefa'],
		minimum : 1,
        app : 'tarefas'
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
                                    subject : 'Dica para organizar melhor todas as suas tarefas',
                                    html :  '' +
                                            'Olá ' + data.user.name + ', tudo bom?<br />' +
                                            'Legal que está usando o Empreendekit. <br />' +
                                            'Agora para te ajudar organizar melhor suas tarefas, separei 2 dicas:<br /><br />' +
                                            '1) Adicione suas principais tarefas dessa próxima semana<br />' +
                                            '2) Crie lembretes para as principais<br /><br />' +
                                            'Assim você não se preocupa em esquecer de fazer tarefas, pagamentos ou cobranças e pode se dedicar mais a seus clientes.<br /><br />' +
                                            'Pra acessar o Empreendekit, <a href="http://www.empreendekit.com.br/?utm_source=sendgrid&utm_medium=email&utm_content=email24h-tarefas&utm_campaign=lifecycle#!/tarefas">clique aqui</a>.<br /><br />' +
                                            'Abraços<br />' +
                                            'Lucas<br /><br />',
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
		minimum : 1,
        app : 'finanças'
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
                                    from : 'gabriel@empreendemia.com.br',
                                    subject : 'O último passo para sair da planilha',
                                    html :  '' +
                                            'Olá ' + data.user.name + ', tudo bom?<br />' +
                                            'Legal que está usando o Empreendekit. <br />' +
                                            'Agora para te ajudar a sair da planilha de excel, separei 2 dicas:<br /><br />' +
                                            '1) Adicione as movimentações dessa próxima semana<br />' +
                                            '2) Crie lembretes para as principais<br /><br />' +
                                            'Assim você não se preocupa em esquecer de fazer pagamentos ou cobranças e pode se dedicar mais a seus clientes.<br /><br />' +
                                            'Pra acessar o Empreendekit, <a href="http://www.empreendekit.com.br/?utm_source=sendgrid&utm_medium=email&utm_content=email24h-financas&utm_campaign=lifecycle#!/financas">clique aqui</a>.<br /><br />' +
                                            'Abraços<br />' +
                                            'Gabriel<br /><br />',
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

/* Lifecycle de pagamento 10 dias */
Event.groupByUser(function (error, users) {
    if (error) {
        console.log(error);
    } else {
        for (var i in users) {
            var date = (new Date() - new Date(users[i].firstEvent)) / (1000 * 60 * 60 * 24);
            if (date > 10 && date < 11) {
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
                                subject : 'Seu período de testes do EmpreendeKit acaba em 5 dias',
                                html :  '' +
                                        '<p>Olá ' + data.user.name + ', tudo bom?</p>' +
                                        '<p>Estou mandando este e-mail porque o seu período de testes do EmpreendeKit está terminando. </p>' +
                                        '<p>Existe alguma forma que posso te ajudar, ou sanar alguma dúvida?</p>' +
                                        '<p>Abraços<br />Lucas</p><br /><br />',
                                name : 'lifecycle fim do test drive 10 dias',
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


/* Lifecycle de pagamento 15 dias */
Event.groupByUser(function (error, users) {
    if (error) {
        console.log(error);
    } else {
        for (var i in users) {
            var date = (new Date() - new Date(users[i].firstEvent)) / (1000 * 60 * 60 * 24);
            if (date > 14 && date < 15) {
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
                                subject : 'Seu período de testes do EmpreendeKit acabou',
                                html :  '' +
                                        '<p>Olá ' + data.user.name + ', tudo bom?</p>' +
                                        '<p>O seu período de testes acabou, mas não precisa ser assim!</p>' +
                                        '<p>Você pode ativar o EmpreendeKit fazendo o pagamento de R$59,90 mensais (você pode cancelar quando quiser).</p>' +
                                        '<p>É só clicar no botão abaixo.</p>'+
                                        '<br /><br /><!-- INICIO FORMULARIO BOTAO PAGSEGURO --><form target="pagseguro" action="https://pagseguro.uol.com.br/v2/pre-approvals/request.html" method="post"><!-- NÃO EDITE OS COMANDOS DAS LINHAS ABAIXO --><input type="hidden" name="code" value="4D1DC72FC7C7FF9FF4CD2F9A1B9DDB2B" /><input type="image" src="https://p.simg.uol.com.br/out/pagseguro/i/botoes/assinaturas/209x48-assinar-assina.gif" name="submit" alt="Pague com PagSeguro - é rápido, grátis e seguro!" /></form><!-- FINAL FORMULARIO BOTAO PAGSEGURO --><br /><br />' +
                                        '<p>Se ainda tiver alguma dúvida e quiser falar conosco, é só me responder ou entrar em contato através de um dos canais abaixo, que ficaremos felizões de te atender:</p>'+
                                        '<p>Telefone: (11) 3230-9233<br />Skype: Empreendemia-fone<br />Email: <a href="mailto:contato@empreendekit.com.br">contato@empreendekit.com.br</a><br /><a href="https://www.facebook.com/Empreendemia">https://www.facebook.com/Empreendemia</a></p>' +
                                        '<p>Abraços<br />Lucas</p><br /><br />',
                                name : 'lifecycle fim do test drive 15 dias',
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