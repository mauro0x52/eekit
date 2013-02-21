/**
 * Model de Tarefas
 *
 * @author Rafael Erthal, Mauro Ribeiro
 * @since  2012-11
 */
app.models.task = function (params) {
    /**
     * Id da categoria da tarefa
     */
    this.category = params.category;
    /**
     * Nome da tarefa
     */
    this.title = params.title;
    /**
     * Descrição da tarefa
     */
    this.description = params.description;
    /**
     * Se a tarefa foi feita
     */
    this.done = params.done;
    /**
     * Lista de embeddeds da tarefa
     */
    this.embeddeds = params.embeddeds;
    /**
     * Se a tarefa é importante
     */
    this.important = params.important || params.important === 'true';
    /**
     * Recorrência da tarefa
     */
    this.recurrence = params.recurrence;
    /**
     * Data de criação
     */
    this.dateCreated = params.dateCreated;
    /**
     * Data de atualização
     */
    this.dateUpdated = params.dateUpdated;
    /**
     * Prazo
     */
    this.dateDeadline = params.dateDeadline;
    /**
     * Prioridade
     */
    this.priority = params.priority;
    /**
     * Lembrete
     */
    this.reminder = params.reminder;
    /**
     * Identificador da tarefa
     */
    this._id = params._id;

   /**
    * Marca tarefa como não feita
    *
    * @author Rafael Erthal
    * @since  2012-09
    *
    * @param  cb : callback a ser chamado após a edição
    */
    this.markAsUndone = function (cb) {
        app.ajax.post({
            url : 'http://' + app.config.services.tasks.host + ':' + app.config.services.tasks.port + '/task/' + this._id + '/undone'
        }, cb);
    };

   /**
    * Marca tarefa como feita
    *
    * @author Rafael Erthal
    * @since  2012-09
    *
    * @param  cb : callback a ser chamado após a edição
    */
    this.markAsDone = function (cb) {
        app.ajax.post({
            url : 'http://' + app.config.services.tasks.host + ':' + app.config.services.tasks.port + '/task/' + this._id + '/done'
        }, cb);
        app.events.trigger('do task ' + this._id, this);
        app.tracker.event('marcar tarefa como feita');
    };

   /**
    * Drag'n drop da tarefa
    *
    * @author Rafael Erthal
    * @since  2013-02
    *
    * @param  cb : callback a ser chamado após a edição
    */
    this.changePriority = function (priority, date) {
        this.priority = priority;
        this.dateDeadline = date;
        this.save();

        app.events.trigger('drop task ' + this._id, this);
    };


   /**
    * Cria ou atualiza uma tarefa
    *
    * @author Mauro Ribeiro
    * @since  2012-11
    *
    * @param  cb : callback a ser chamado após salvar
    */
    this.save = function (cb) {
        var data = {
            category : this.category,
            title : this.title,
            description : this.description,
            done : this.done,
            embeddeds : this.embeddeds,
            important : this.important || this.important === 'true',
            recurrence : this.recurrence,
            dateCreated : this.dateCreated,
            dateUpdated : this.dateUpdated,
            dateDeadline : this.dateDeadline,
            priority : this.priority,
            reminder : this.reminder,
            _id : this._id
        }
        if (data._id) {
            // atualiza
            app.ajax.post({
                url : 'http://' + app.config.services.tasks.host + ':' + app.config.services.tasks.port + '/task/' + this._id + '/update',
                data : data
            }, function (response) {
                if (response) {
                    if (response.error) {
                        console.log(error);
                    } else {
                        if (cb) {
                            cb(response.task);
                        }
                    }
                }
            });
        } else {
            // cria novo
            app.ajax.post({
                url : 'http://' + app.config.services.tasks.host + ':' + app.config.services.tasks.port + '/task',
                data : data
            }, function (response) {
                if (response) {
                    if (response.error) {
                        console.log(error);
                    } else {
                        console.log('????')
                        app.tracker.event('adicionar tarefa');
                        cb(response.task);
                    }
                }
            });
        }
    } // save()

   /**
    * Remove uma tarefa
    *
    * @author Rafael Erthal
    * @since  2012-09
    *
    * @param  cb : callback a ser chamado após a exclusão
    */
    this.remove = function (cb) {
        app.ajax.post({
            url : 'http://' + app.config.services.tasks.host + ':' + app.config.services.tasks.port + '/task/' + this._id + '/delete'
        }, function (response) {
            if (response) {
                if (response.error) {
                    console.log(response.error);
                } else {
                    cb();
                }
            } else {
                cb();
            }
        });
    };

}


/**
 * Listagem de tarefas
 *
 * @author Rafael Erthal
 * @since  2012-09
 *
 * @param  data : filtragem
 * @param  cb : callback a ser executado após a listagem
 */
app.models.task.list = function (data, cb) {
    app.ajax.get({
        url : 'http://' + app.config.services.tasks.host + ':' + app.config.services.tasks.port + '/tasks',
        data : data
    }, function (response) {
        if (response) {
            if (response.error) {
                console.error(response.error)
            } else {
                var i, tasks = [];
                for (i in response.tasks) {
                    if (response.tasks.hasOwnProperty(i)) {
                        tasks.push(new app.models.task(response.tasks[i]));
                    }
                }
                cb.apply(app, [tasks]);
            };
        }
    });
};


/**
 * Procura uma tarefa específica
 *
 * @author  Rafael Erthal
 * @since   2012-09
 *
 * @param  id : id da tarefa
 * @param  cb : callback
 */
app.models.task.find = function (id, cb) {
    app.ajax.get({
        url : 'http://' + app.config.services.tasks.host + ':' + app.config.services.tasks.port + '/task/' + id,
        data : {}
    }, function (response) {
        if (response) {
            if (response.error) {
                console.error(response.error)
            } else {
                cb.apply(app, [new app.models.task(response.task)]);
            }
        }
    });
};
