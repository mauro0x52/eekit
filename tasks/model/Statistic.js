/**
 * Statistic
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    statisticSchema, Statistic;

statisticSchema = new schema({
    /**
     * id do usuario
     */
    user  : {type : objectId, required : true},
    /**
     * categoria de atividade do usuário
     */
    label : {type : String, 'enum' : ['new', 'active', 'engaged', 'retained'], 'default' : 'new'},
    /**
     * data da última atualização da categoria
     */
    date  : {type : Date},
    /**
     * contabilidade
     */
    count : {
        tasks : {type : Number, 'default' : 0},
        done : {type : Number, 'default' : 0}
    }
});



/**
 * Incrementa o número de tarefas
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
statisticSchema.statics.inc = function (field, user_id) {
    "use strict";

    Statistic.findOne({user : user_id}, function(error, statistic) {
        if (!statistic) {
            statistic = new Statistic({user : user_id});
        }
        statistic.count[field] += 1;

        /* verifica se engajou */
        if (statistic.count.done >= 3) {
            statistic.label = 'retained';
            statistic.date = new Date();
        } else if (statistic.count.tasks >= 3) {
            statistic.label = 'engaged';
            statistic.date = new Date();
        } else if (statistic.count.tasks >= 1) {
            statistic.label = 'active';
            statistic.date = new Date();
        }
        /* verifica se ativou */
        statistic.save();
    });

};

/*  Exportando o pacote  */
exports.Statistic = Statistic = mongoose.model('Statistics', statisticSchema);