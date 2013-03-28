/** Event
 * @author : Rafael Erthal
 * @since : 2012-10
 *
 * @description : Representação da entidade de evento
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    eventSchema,
    Event;

eventSchema = new schema({
    user        : {type : objectId},
    utm         : {
    	source   : {type : String},
    	medium   : {type : String},
    	content  : {type : String},
    	campaign : {type : String}
    },
    ip          : {type : String},
    date        : {type : Date},
    app         : {type : String},
    source      : {type : String},
    label       : {type : String}
});

/*eventSchema.pre('init', function (next, doc) {
	if (!doc.user) {
		Event.findOne({ip : this.ip, user : {$ne : null}}, function (error, event) {
			if (event) {
				doc.user = event.user;
			}
			next()
		});
	} else {
		next();
	}
})*/

eventSchema.statics.cohort = function (app, frequency, cb) {
	Event.find(function (error, events) {
        var cohorts = [],
	        date = new Date(2013,0,20,0),
	        users = {};

        if (error) {
        	cb(error, null)
        } else {
	        for (var i = 0; i < events.length; i += 1) {
            	var id = events[i].user ? events[i].user.toString() : events[i].ip.toString();
                if (users[id]) {
                    users[id].events.push(events[i]);
                    if (users[id].date < events[i].date) {
                        users[id].firstEvent = events[i].date;
                    }
                } else {
                    users[id] = {
                        firstEvent : events[i].date,
                        events : [events[i]] ,
                        utm : {}
                    };
                }
                if (events[i].utm && (events[i].utm.source || events[i].utm.medium || events[i].utm.content || events[i].utm.campaign)) {
                	users[id].utm = events[i].utm;
                }
	        }

	        while (date < new Date()) {
	            var cohort = {
	                date   : new Date(date),
	                users  : [],
	                filter : function (labels, minimum, utm, date) {
	                    var dateFrom = new Date(date || this.date),
		                    dateTo   = new Date(date || this.date),
		                    result   = [];
		                    dateTo.setDate(dateTo.getDate() + frequency),
		                    hasUtm = false;

		                for (var i in utm) {
		                	hasUtm = true;
		                }

	                    for (var i in this.users) {
	                        var ocurrences = 0;
	                        if (
	                        	(!hasUtm) ||
                        		(
                                	this.users[i].utm.source === utm.source &&
                                	this.users[i].utm.medium === utm.medium &&
                                	this.users[i].utm.content === utm.content &&
                                	this.users[i].utm.campaign === utm.campaign
                            	)
                        	) {
								for (var j in this.users[i].events) {
		                            if (
		                                this.users[i].events[j].date <= dateTo   &&
		                                this.users[i].events[j].date >= dateFrom &&
		                                (
		                                	this.users[i].events[j].app === app ||
		                                	this.users[i].events[j].source === app
	                                	) &&
		                                (
		                                	labels.indexOf(this.users[i].events[j].label) >= 0 ||
		                                	labels.length === 0
	                                	)
		                            ) {
		                                ocurrences += 1;
		                            }
		                        }
		                        if (ocurrences >= minimum) {
		                            result.push(this.users[i]);
		                        }
                        	}
	                    }
	                    return result;
	                }
	            };

	            var dateFrom = new Date(date),
	            dateTo   = new Date(date),
	            count    = 0;
	            dateTo.setDate(dateTo.getDate() + frequency);

	            for (var i in users) {
	                if (
	                    users[i].firstEvent > dateFrom &&
	                    users[i].firstEvent < dateTo
	                ) {
	                    cohort.users.push(users[i]);
	                }
	            }
	            cohorts.push(cohort);
	            date = new Date(dateTo);
	        }
	        if (cb) {
	        	cb(null, cohorts);
	        }
		}
	});
}

/*  Exportando o pacote  */
exports.Event = Event = mongoose.model('Events', eventSchema);
