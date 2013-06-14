module.exports = {
    tarefas : {
        'retained' : {
            status : {eq : 'engaged'},
            statusDate : {lt : -7},
            activityDate : {gte : 0, lt : 1}
        },
        'engaged' : {
            events : {
                'adicionar tarefa' : {gte : 3}
            }
        },
        'active' : {
            events : {
                'adicionar tarefa' : {gte : 1}
            }
        },
        'new' : {
            events : {
                'visualizar tarefas pendentes' : {gte : 1}
            }
        }
    },
    contatos : {
        'retained' : {
            status : {eq : 'engaged'},
            statusDate : {lt : -7},
            activityDate : {gte : 0, lt : 1}
        },
        'engaged' : {
            events : {
                'adicionar contato' : {gte : 3}
            }
        },
        'active' : {
            events : {
                'adicionar contato' : {gte : 1}
            }
        },
        'new' : {
            events : {
                'visualizar contatos' : {gte : 1}
            }
        }
    },
    financas : {
        'retained' : {
            status : {eq : 'engaged'},
            statusDate : {lt : -7},
            activityDate : {gte : 0, lt : 1}
        },
        'engaged' : {
            events : {
                'adicionar transação' : {gte : 3}
            }
        },
        'active' : {
            events : {
                'adicionar transação' : {gte : 1}
            }
        },
        'new' : {
            events : {
                'visualizar fluxo de caixa' : {gte : 1}
            }
        }
    }
}