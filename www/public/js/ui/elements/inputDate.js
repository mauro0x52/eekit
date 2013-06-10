/**
 * Datepicker do eekit
 *
 * @author Mauro Ribeir, Rafael Erthal
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection'),
    Helper     = module.use('helper'),
    InputError = module.use('inputError');

module.exports(new Class(function (params) {

    var element,
        legend, input, errors, date_picker, month_name, month_days,
        previous_month, next_month,
        menu_today, menu_none, menu_tomorrow,
        changing_month = false,
        self = this,
        change_cb;

    element = new Element('li', {attributes : {'class' : 'field date'}, html : [
        new Element('div', {attributes : {'class' : 'legend'}, html : [
            legend = new Element('label', {attributes : {'class' : 'text'}})
        ]}),
        new Element('div', {attributes : {'class' : 'data'}, html : [
            input  = new Element('input', {attributes : {'class' : 'input', 'type' : 'text', 'autocomplete' : 'off'}}),
            date_picker = new Element('div', {attributes : {'class' : 'date-picker hide'}, html : [
                new Element('div', {attributes : {'class' : 'calendar'}, html : [
                    new Element('div', {attributes : {'class' : 'month'}, html : [
                        previous_month = new Element('div', {attributes : {'class' : 'previous-month'}, html : '«'}),
                        month_name = new Element('div', {attributes : {'class' : 'date'}}),
                        next_month = new Element('div', {attributes : {'class' : 'next-month'}, html : '»'})
                    ]}),
                    new Element('div', {attributes : {'class' : 'week-days'}, html : [
                        new Element('div', {attributes : {'class' : 'day weekend'}, html : 'D'}),
                        new Element('div', {attributes : {'class' : 'day'}, html : 'S'}),
                        new Element('div', {attributes : {'class' : 'day'}, html : 'T'}),
                        new Element('div', {attributes : {'class' : 'day'}, html : 'Q'}),
                        new Element('div', {attributes : {'class' : 'day'}, html : 'Q'}),
                        new Element('div', {attributes : {'class' : 'day'}, html : 'S'}),
                        new Element('div', {attributes : {'class' : 'day weekend'}, html : 'S'})
                    ]}),
                    month_days = new Element('div', {attributes : {'class' : 'month-days'}})
                ]}),
                new Element('div', {attributes : {'class' : 'presets'}, html : [
                    new Element('menu', {attributes : {'class' : 'menu'}, html : [
                        menu_none = new Element('li', {attributes : {'class' : 'item'}, html : 'nenhuma'}),
                        menu_today = new Element('li', {attributes : {'class' : 'item'}, html : 'hoje'}),
                        menu_tomorrow = new Element('li', {attributes : {'class' : 'item'}, html : 'amanhã'})
                    ]})
                ]}),
                new Element('div', {attributes : {'class' : 'arrow'}, html : [
                    new Element('div', {attributes : {'class' : 'fill'}})
                ]}),
            ]}),
            errors = new Element('ul', {attributes : {'class' : 'errors hide'}})
        ]})
    ]});

    element.template = this;
    this.id     = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    /* Eventos */
    input.event('change').bind(function () {
        if (change_cb) {
            change_cb.apply(self);
        }
    });
    menu_today.event('click').bind(function () {
        var date = new Date();
        self.value(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
    });
    menu_tomorrow.event('click').bind(function () {
        var date = new Date();
        self.value((date.getDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
    });
    menu_none.event('click').bind(function () {
        self.value('');
    });
    previous_month.event('click').bind(function (evt) {
        self.previousMonth();
        changing_month = true;
        input.event('focus').trigger();
    }, true);
    next_month.event('click').bind(function (evt) {
        self.nextMonth();
        changing_month = true;
        input.event('focus').trigger();
    }, true);
    input.event('focus').bind(function () {
        date_picker.attribute('class').set('date-picker');
        month_name.html.set(self.monthName());
        self.monthDays();
    });
    input.event('blur').bind(function () {
        setTimeout(function () {
            if (!changing_month) {
                date_picker.attribute('class').set('hide');
            }
            changing_month = false;
        }, 150);

    });

    /**
     * Controla a legenda do input
     *
     * @author Mauro Ribeir, Rafael Erthal
     * @since  2013-05
     */
    this.legend = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'inputDate.js',
                    method    : 'legend',
                    message   : 'Legend value must be a string',
                    arguments : arguments
                });
            }

            legend.html.set(value);
        } else {
            return legend.html.get()[0];
        }
    };

    /**
     * Controla o valor
     *
     * @author Mauro Ribeir, Rafael Erthal
     * @since  2013-05
     */
    this.value = function (value) {
        if (value || value === '') {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'inputDate.js',
                    method    : 'value',
                    message   : 'Value value must be a string',
                    arguments : arguments
                });
            }

            input.attribute('value').set(value);
            self.change();
        } else {
            return input.attribute('value').get();
        }
    };

    /**
     * Controla o callback de change
     *
     * @author Mauro Ribeir, Rafael Erthal
     * @since  2013-05
     */
    this.change = function (value) {
        if (value) {

            if (value.constructor !== Function) {
                throw new Error({
                    source    : 'inputDate',
                    method    : 'change',
                    message   : 'Change value must be a function',
                    arguments : arguments
                });
            }

            change_cb = value;
        } else if (change_cb) {
            change_cb.apply(self);
        }
    };

    /**
     * Escolhe mes anterior
     *
     * @author Mauro Ribeir, Rafael Erthal
     * @since  2013-05
     */
    this.previousMonth = function () {
        var olddate = self.date(),
            date = new Date(olddate.getFullYear(), olddate.getMonth() - 1, olddate.getDate());

        self.value(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
    };

    /**
     * Escolhe próximo mês
     *
     * @author Mauro Ribeir, Rafael Erthal
     * @since  2013-05
     */
    this.nextMonth = function () {
        var olddate = self.date(),
            date = new Date(olddate.getFullYear(), olddate.getMonth() + 1, olddate.getDate());

        if (olddate.getMonth() + 1 != date.getMonth()) {
            date = new Date(olddate.getFullYear(), olddate.getMonth() + 2, 0);
        }

        self.value(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
    };


    /**
     * Controla o valor da data
     *
     * @author Mauro Ribeir, Rafael Erthal
     * @since  2013-05
     */
    this.date = function () {
        var value = self.value().split('/'),
            today = new Date,
            day,month,year;

        switch (value.length) {
            case 0: {
                return false;
            }
            case 1: {
                day = value[0];
                if (day.length === 2) {
                    return new Date(today.getFullYear(), today.getMonth(), parseInt(day));
                } else {
                    return new Date();
                }
            }
            case 2: {
                day = value[0],
                month = value[1];
                if (month.length === 2) {
                    return new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day));
                } else {
                    return new Date(today.getFullYear(), today.getMonth(), parseInt(day));
                }
            }
            case 3: {
                day = value[0],
                month = value[1],
                year = value[2];
                if (year.length === 4) {
                    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                } else {
                    return new Date(today.getFullYear(), parseInt(month) - 1, parseInt(day));
                }
            }
        }
    };

    /**
     * Pega o nome do mês
     *
     * @author Mauro Ribeir, Rafael Erthal
     * @since  2013-05
     */
    this.monthName = function () {
        var date = self.date();

        switch (date.getMonth()) {
            case  0: return 'janeiro de ' + date.getFullYear();
            case  1: return 'fevereiro de ' + date.getFullYear();
            case  2: return 'março de ' + date.getFullYear();
            case  3: return 'abril de ' + date.getFullYear();
            case  4: return 'maio de ' + date.getFullYear();
            case  5: return 'junho de ' + date.getFullYear();
            case  6: return 'julho de ' + date.getFullYear();
            case  7: return 'agosto de ' + date.getFullYear();
            case  8: return 'setembro de ' + date.getFullYear();
            case  9: return 'outubro de ' + date.getFullYear();
            case 10: return 'novembro de ' + date.getFullYear();
            case 11: return 'dezembro de ' + date.getFullYear();
        }
    };

    /**
     * Gera os dias do mês
     *
     * @author Mauro Ribeir, Rafael Erthal
     * @since  2013-05
     */
    this.monthDays = function () {

        function monthday (date_i) {
            var date = new Date(date_i.getFullYear(), date_i.getMonth(), date_i.getDate(), 1),
                element = new Element('li', {html : '1'}),
                style = 'day',
                today = new Date(),
                selected_month = self.date();

            element.html.set(date.getDate().toString());

            if (date.getDay() === 0 || date.getDay() === 6) {
                style += ' weekend';
            }
            if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
                style += ' today';
            }
            if (date.getFullYear() !== selected_month.getFullYear() || date.getMonth() !== selected_month.getMonth()) {
                style += ' previous-month';
            }
            if (date.getFullYear() === selected_month.getFullYear() && date.getMonth() === selected_month.getMonth() && date.getDate() === selected_month.getDate()) {
                style += ' selected';
            }
            element.attribute('class').set(style);

            element.event('click').bind(function () {
                self.value(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
                self.change();
            });

            return element;
        }

        var today = this.date(),
            month_start = new Date(today.getFullYear(), today.getMonth(), 1, 1),
            current_date = new Date(today.getFullYear(), today.getMonth(), 1, 1);

        month_days.html.set(' ');

        current_date.setDate(current_date.getDate() - current_date.getDay());
        while (current_date < month_start) {
            month_days.html.attach(monthday(current_date));

            current_date.setDate(current_date.getDate() + 1);
        }

        current_date.setMonth(month_start.getMonth(), 1);
        while (current_date.getMonth() === month_start.getMonth()) {
            month_days.html.attach(monthday(current_date));

            current_date.setDate(current_date.getDate() + 1);
        }

        current_date.setDate(0);
        current_date.setMonth(month_start.getMonth() + 1, 1);
        while (current_date.getDay() !== 0) {
            month_days.html.attach(monthday(current_date));

            current_date.setDate(current_date.getDate() + 1);
        }
    }
    /**
     * Controla a visibilidade do input
     *
     * @author Mauro Ribeir, Rafael Erthal
     * @since  2013-05
     */
    this.visibility = function (value) {
        if (value) {

            if (value !== 'hide' && value !== 'show') {
                throw new Error({
                    source    : 'inputDate.js',
                    method    : 'visibility',
                    message   : 'Visibility value must be "hide" or "show"',
                    arguments : arguments
                });
            }

            switch (value) {
                case 'hide' :
                    element.attribute('class').set('field date hide');
                    break;
                case 'show' :
                    element.attribute('class').set('field date');
                    break;
            }
        } else {
            return element.attribute('class').get().replace('field date', '');
        }
    };

    /**
     * Controla orientador
     *
     * @author Mauro Ribeir, Rafael Erthal, Rafael Erthal
     * @since  2013-05
     */
    this.helper = new Helper(element);

    /**
     * Controla os erros
     *
     * @author Mauro Ribeir, Rafael Erthal, Rafael Erthal
     * @since  2013-05
     */
    this.errors = new Collection(errors, [InputError]);

    /*
     * Valores iniciais
     */
    if (params) {
        this.legend(params.legend);
        this.value(params.value);
        this.change(params.change);
    }
}));