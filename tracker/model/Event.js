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

eventSchema.pre('init', function (next, doc) {
	if (!doc.user) {
		Event.findOne({ip : doc.ip, user : {$ne : null}}, function (error, event) {
			if (event) {
				doc.user = event.user;
			}
			next()
		});
	} else {
		next();
	}
})

eventSchema.statics.groupByUser = function (cb) {
	Event.find(function (error, events) {
	    var users = {};

        if (error) {
        	cb(error, null)
        } else {
	        for (var i = 0; i < events.length; i += 1) {
            	var id = events[i].user ? events[i].user.toString() : events[i].ip.toString().replace(/\./g, '_');
                if (users[id]) {
                    users[id].events.push(events[i]);
                    if (users[id].date < events[i].date) {
                        users[id].firstEvent = events[i].date;
                    }
                } else {
                    users[id] = {
                    	id : id,
                        firstEvent : events[i].date,
                        events : [events[i]] ,
                        utm : {},
                        ocurrences : function (app, labels, from, to) {
		                    var dateFrom = new Date(from),
			                    dateTo   = new Date(to),
			                    ocurrences = 0;

							for (var i in this.events) {
	                            if (
	                                (
	                                	this.events[i].date >= dateFrom ||
	                                	!from
                                	) && (
	                                	this.events[i].date <= dateTo ||
	                                	!to
                                	) && (
	                                	this.events[i].app === app ||
	                                	this.events[i].source === app ||
	                                	!app
                                	) && (
	                                	labels.indexOf(this.events[i].label) >= 0 ||
	                                	!labels ||
	                                	labels.length === 0
                                	)
	                            ) {
	                                ocurrences += 1;
	                            }
		                    }
		                    return ocurrences;
		                }
                    };
                }
                if (events[i].utm && (events[i].utm.source || events[i].utm.medium || events[i].utm.content || events[i].utm.campaign)) {
                	users[id].utm = events[i].utm;
                }
	        }
	        cb(null, users);
	    }
	});
};

eventSchema.statics.groupByUserFilter = function (filter, cb) {
	Event.find(filter, function (error, events) {
	    var users = {};

        if (error) {
        	cb(error, null)
        } else {
	        for (var i = 0; i < events.length; i += 1) {
            	var id = events[i].user ? events[i].user.toString() : events[i].ip.toString().replace(/\./g, '_');
                if (users[id]) {
                    users[id].events.push(events[i]);
                    if (users[id].date < events[i].date) {
                        users[id].firstEvent = events[i].date;
                    }
                } else {
                    users[id] = {
                    	id : id,
                        firstEvent : events[i].date,
                        events : [events[i]] ,
                        utm : {},
                        ocurrences : function (app, labels, from, to) {
		                    var dateFrom = new Date(from),
			                    dateTo   = new Date(to),
			                    ocurrences = 0;

							for (var i in this.events) {
	                            if (
	                                (
	                                	this.events[i].date >= dateFrom ||
	                                	!from
                                	) && (
	                                	this.events[i].date <= dateTo ||
	                                	!to
                                	) && (
	                                	this.events[i].app === app ||
	                                	this.events[i].source === app ||
	                                	!app
                                	) && (
	                                	labels.indexOf(this.events[i].label) >= 0 ||
	                                	!labels ||
	                                	labels.length === 0
                                	)
	                            ) {
	                                ocurrences += 1;
	                            }
		                    }
		                    return ocurrences;
		                }
                    };
                }
                if (events[i].utm && (events[i].utm.source || events[i].utm.medium || events[i].utm.content || events[i].utm.campaign)) {
                	users[id].utm = events[i].utm;
                }
	        }
	        cb(null, users);
	    }
	});
};

eventSchema.statics.user = function (user, cb) {
	var query = {};

	if (user.indexOf('_') > -1) {
		query = {ip : user.replace(/\_/g, '.')};
	} else {
		query = {user : user};
	}

	Event.find(query, function (error, events) {
	    var users = {};

        if (error) {
        	cb(error, null)
        } else {
	        for (var i = 0; i < events.length; i += 1) {
            	var id = events[i].user ? events[i].user.toString() : events[i].ip.toString().replace(/\./g, '_');
                if (users[id]) {
                    users[id].events.push(events[i]);
                    if (users[id].date < events[i].date) {
                        users[id].firstEvent = events[i].date;
                    }
                } else {
                    users[id] = {
                    	id : id,
                        firstEvent : events[i].date,
                        events : [events[i]] ,
                        utm : {},
                        ocurrences : function (app, labels, from, to) {
		                    var dateFrom = new Date(from),
			                    dateTo   = new Date(to),
			                    ocurrences = 0;

							for (var i in this.events) {
	                            if (
	                                (
	                                	this.events[i].date >= dateFrom ||
	                                	!from
                                	) && (
	                                	this.events[i].date <= dateTo ||
	                                	!to
                                	) && (
	                                	this.events[i].app === app ||
	                                	this.events[i].source === app ||
	                                	!app
                                	) && (
	                                	labels.indexOf(this.events[i].label) >= 0 ||
	                                	!labels ||
	                                	labels.length === 0
                                	)
	                            ) {
	                                ocurrences += 1;
	                            }
		                    }
		                    return ocurrences;
		                }
                    };
                }
                if (events[i].utm && (events[i].utm.source || events[i].utm.medium || events[i].utm.content || events[i].utm.campaign)) {
                	users[id].utm = events[i].utm;
                }
	        }
	        cb(null, users[id]);
	    }
	});
};

eventSchema.statics.signupUsersIds = function (days, cb) {
    var from, to, now, users_ids = [];

    now = new Date();
    from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
    to = new Date(now.getFullYear(), now.getMonth(), now.getDate() - days + 1);

    Event.find({date : {$gte : from, $lte : to}, label : 'cadastrar'}, function(error, events) {
        if (error) {
            cb(error)
        } else {
            for (var i in events) {
                if (events[i].user) {
                    users_ids.push(events[i].user);
                }
            }
            cb(null, users_ids);
        }
    });
};


eventSchema.statics.cohort = function (app, frequency, cb) {
	Event.groupByUser(function (error, users) {
        var cohorts = [],
	        date = new Date(2013,0,20,0);

        if (error) {
        	cb(error, null)
        } else {
	        while (date < new Date()) {
	            var cohort = {
		                date   : new Date(date),
		                users  : [],
		                filter : function (labels, minimum, utm, date) {
		                    var dateFrom = new Date(date || this.date),
			                    dateTo   = new Date(date || this.date),
			                    result   = [];
			                    dateTo.setDate(dateTo.getDate() + frequency);

		                    utm = utm || {};

		                    for (var i in this.users) {
		                    	if (
	                    			(
	                    				!this.users[i].utm ||
	                                	this.users[i].utm.source === utm.source ||
	                                	!utm.source
	                            	) && (
	                    				!this.users[i].utm ||
	                                	this.users[i].utm.medium === utm.medium ||
	                                	!utm.medium
	                            	) && (
	                    				!this.users[i].utm ||
	                                	this.users[i].utm.content === utm.content ||
	                                	!utm.content
	                            	) && (
	                    				!this.users[i].utm ||
	                                	this.users[i].utm.campaign === utm.campaign ||
	                                	!utm.campaign
	                            	) && (
	                        			this.users[i].ocurrences(app, labels, dateFrom, dateTo) >= minimum
	                        		)
	                    		) {
		                    		result.push(this.users[i]);
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
