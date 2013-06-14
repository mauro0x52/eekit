/**
 * Migração da versão 1.1
 * Alimenta o banco de estatísticas
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */

use tracker;

var events = db.events.find({app : {$in : ['finanças', 'finan%E7as']}});
while (events.hasNext()) {
    var event = events.next();
    event.app = 'financas';
    db.events.save(event);
}

var events = db.events.find({app : {$nin : ['ee', 'tarefas', 'contatos', 'financas', 'boletos']}});
while (events.hasNext()) {
    var event = events.next();
    db.events.remove({_id : event._id});
}

var user_ids = db.events.distinct('user');

for (var i in user_ids) {
    var user_id = user_ids[i];
    var events = db.events.find({user : user_id}).sort({date : 1});
    var statistic = db.statistics.findOne({user : user_id});
    var firstEvent = true;

    if (!statistic) {
        statistic = {
            user : user_id,
            activityDate : new Date(),
            signupDate : new Date(),
            apps : {}
        }
    }

    while (events.hasNext()) {
        var event = events.next();

        if (event.app && event.label && event.user) {
            app = event.app.replace('.', '');
            label = event.label.replace('.', '');

            if (firstEvent) {
                statistic.signupDate = event.date;
                firstEvent = false;
            }

            if (app === 'auth' && label === 'cadastrar') {
                statistic.signupDate = event.date;
            }

            if (!statistic.apps) {
                statistic.apps = {};
            }

            if (!statistic.apps[app]) {
                statistic.apps[app] = {
                    status : 'new',
                    events : {}
                }
            }

            if (!statistic.apps[app].events[label]) {
                statistic.apps[app].events[label] = {
                    totalCount : 0,
                    statusCount : 0
                }
            }

            statistic.apps[app].events[label].lastDate = event.date;
            statistic.apps[app].events[label].totalCount++;
            statistic.apps[app].activityDate = event.date;
            statistic.apps[app].statusDate = event.date;
            statistic.activityDate = event.date;

            db.statistics.save(statistic);
        }
    }
}