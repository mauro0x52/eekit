/**
 * Statistic
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    statisticSchema, Statistic,
    defaultApp, defaultEvent;

statisticSchema = new schema({
    /**
     * id do usuario
     */
    user  : {type : objectId, required : true},
    /**
     * data da última atualização do status
     */
    signupDate  : {type : Date},
    /**
     * data da última atividade do usuário
     */
    activityDate  : {type : Date},
    /**
     * lista de apps
     */
    apps : {type : schema.Types.Mixed, 'default' : {}}
});

newApp = function (data) {
    data = data ? data : {};
    return {
        /**
         * status de atividade do usuário
         */
        status : data.status ? data.status : 'new',
        /**
         * data da última atualização do status
         */
        statusDate : data.date ? data.date : new Date(),
        /**
         * data da última atividade do usuário no aplicativo
         */
        activityDate : data.date ? data.date : new Date(),
        /**
         * lista de eventos
         */
        events : data.events ? data.events : {}
    }
}

newEvent = function (data) {
    data = data ? data : {};
    return {
        /**
         * número de ocorrências
         */
        totalCount : data.count ? data.count : 0,
        /**
         * número de ocorrências desde a última atualização de status
         */
        statusCount : data.count ? data.count : 0,
        /**
         * data da última atualização do status
         */
        lastDate : data.date ? data.date : new Date()
    }
}


/**
 * Atualiza os status do usuário
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
statisticSchema.methods.updateStatus = function () {
    "use strict";

    var cohortRules = require('../scripts/cohortRules.js');
    var updated = false;
    var statistic = this;

    var compare = function (operator, a, b) {
        var res = false;

        switch (operator) {
            case 'eq'  : if (a == b) res = true; break;
            case 'gt'  : if (a >  b) res = true; break;
            case 'gte' : if (a >= b) res = true; break;
            case 'lt'  : if (a <  b) res = true; break;
            case 'lte' : if (a <= b) res = true; break;
            default : res = false; break;
        }

        return res;
    }

    /* para cada aplicativo do usuário */
    for (var app in statistic.apps) {

        /* verifica há regras para o app */
        if (cohortRules[app]) {

            /* para cada status do aplicativo */
            for (var status in cohortRules[app]) {

                var match = true;

                /* para cada regra do status */
                for (var rule in cohortRules[app][status]) {

                    /* a regra é status */
                    if (rule === 'status') {
                        if (cohortRules[app][status].status.eq !== statistic.apps[app].status) {
                            match = false;
                            break;
                        }
                    }
                    /* regra é data */
                    else if (rule === 'statusDate' || rule === 'activityDate') {
                        /* para cada operador */
                        for (var operator in cohortRules[app][status][rule]) {

                            var statDate, compDate, now = new Date();

                            statDate = new Date(statistic.apps[app][rule]);
                            compDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + cohortRules[app][status][rule][operator]);

                            if (!compare(operator, statDate, compDate)) {
                                match = false;
                                break;
                            }

                        }
                        if (!match) break;
                    }
                    /* regras são eventos */
                    else if (rule === 'events') {

                        /* para cada evento */
                        for (var event in cohortRules[app][status].events) {

                            /* se o usuário fez o evento */
                            if (statistic.apps[app].events[event]) {

                                /* para cada operador */
                                for (var operator in cohortRules[app][status][rule][event]) {

                                    var statCount, compCount;

                                    statCount = statistic.apps[app].events[event].totalCount;
                                    compCount = cohortRules[app][status].events[event][operator];

                                    if (!compare(operator, statCount, compCount)) {

                                        match = false;
                                        break;
                                    }

                                }
                                if (!match) break;

                            } else {
                                match = false;
                                break;
                            }

                        }

                    }

                }

                /* se bateu com algum critério e mudou o status*/
                if (match) {

                    if (statistic.apps[app].status !== status) {
                        updated = true;
                        statistic.apps[app].status = status;
                        statistic.apps[app].statusDate = new Date();
                        statistic.markModified('apps.'+app+'.status');
                        statistic.markModified('apps.'+app+'.statusDate');
                        /* zera os contadores do status */
                        for (var event in statistic.apps[app].events) {
                            statistic.apps[app].events[event].statusCount = 0;
                            statistic.markModified('apps.'+app+'.events.'+event+'.statusCount');
                        }
                    }
                    break;

                }

            }
        }
    }

    statistic.save();
};

/**
 * Incrementa o contador
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */
statisticSchema.statics.inc = function (event) {
    "use strict";
    if (event.app && event.label && event.user) {
        var app = event.app.replace('.','');
        var label = event.label.replace('.','');

        Statistic.findOne({user : event.user}, function(error, statistic) {
            /* se as estatísticas do usuário ainda não está criado */
            if (!statistic) {
                statistic = new Statistic({
                    user : event.user,
                    signupDate : new Date(),
                    activityDate : new Date()
                });
            }

            /* se o app ainda não tem estatística */
            if (!statistic.apps[app]) {
                statistic.apps[app] = newApp();
                statistic.markModified('apps.'+app);
            }

            /* se o evento ainda não tem estatística */
            if (!statistic.apps[app].events[label]) {
                statistic.apps[app].events[label] = newEvent();
            }

            /* contabiliza */
            statistic.apps[app].events[label].totalCount++;
            statistic.apps[app].events[label].statusCount++;
            statistic.apps[app].events[label].lastDate = new Date();
            statistic.markModified('apps.'+app+'.events.'+label);

            statistic.apps[app].activityDate = new Date();
            statistic.markModified('apps.'+app+'.activityDate');

            statistic.activityDate = new Date();

            statistic.updateStatus();
        });
    }
};

/*  Exportando o pacote  */
exports.Statistic = Statistic = mongoose.model('Statistics', statisticSchema);
