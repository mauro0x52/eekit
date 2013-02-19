/** InputDate
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa inputs
 */

sdk.modules.ui.inputDate = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('li'),
            legend_div = document.createElement('div'),
            text_label = document.createElement('label'),
            data_div = document.createElement('div'),
            input_text = document.createElement('input'),

            datepicker_div = document.createElement('div'),
            calendar_div = document.createElement('div'),
            month_div = document.createElement('div'),
            previousmonth_div = document.createElement('div'),
            date_div = document.createElement('div'),
            nextmonth_div = document.createElement('div'),
            weekdays_div = document.createElement('div'),
            sunday_div = document.createElement('div'),
            monday_div = document.createElement('div'),
            tuesday_div = document.createElement('div'),
            wednesday_div = document.createElement('div'),
            thursday_div = document.createElement('div'),
            friday_div = document.createElement('div'),
            saturday_div = document.createElement('div'),
            monthdays_ul = document.createElement('ul'),
            presets_div = document.createElement('div'),
            menu_menu = document.createElement('menu'),
            today_li = document.createElement('li'),
            tomorrow_li = document.createElement('li'),
            none_li = document.createElement('li'),
            arrow_div = document.createElement('div'),
            fill_div = document.createElement('div'),
            that = this,
            changing_month = false,
            cb;

        /* CSS */
        element.setAttribute('class', 'field date');
        legend_div.setAttribute('class', 'legend');
        text_label.setAttribute('class', 'text');
        data_div.setAttribute('class', 'data');
        input_text.setAttribute('class', 'input');
        input_text.setAttribute('autocomplete', 'off');
        input_text.setAttribute('type', 'text');

        datepicker_div.setAttribute('class', 'date-picker hide');
        calendar_div.setAttribute('class', 'calendar');
        month_div.setAttribute('class', 'month');
        previousmonth_div.setAttribute('class', 'previous-month');
        previousmonth_div.innerHTML = '&laquo;'
        date_div.setAttribute('class', 'date');
        nextmonth_div.setAttribute('class', 'next-month');
        nextmonth_div.innerHTML = '&raquo;'
        weekdays_div.setAttribute('class', 'week-days');
        sunday_div.setAttribute('class', 'day weekend');
        monday_div.setAttribute('class', 'day');
        tuesday_div.setAttribute('class', 'day');
        wednesday_div.setAttribute('class', 'day');
        thursday_div.setAttribute('class', 'day');
        friday_div.setAttribute('class', 'day');
        saturday_div.setAttribute('class', 'day weekend');
        sunday_div.innerHTML = 'D';
        monday_div.innerHTML = 'S';
        tuesday_div.innerHTML = 'T';
        wednesday_div.innerHTML = 'Q';
        thursday_div.innerHTML = 'Q';
        friday_div.innerHTML = 'S';
        saturday_div.innerHTML = 'S';
        monthdays_ul.setAttribute('class', 'month-days');
        presets_div.setAttribute('class', 'presets');
        menu_menu.setAttribute('class', 'menu');
        today_li.setAttribute('class', 'item');
        tomorrow_li.setAttribute('class', 'item');
        today_li.innerHTML = 'hoje';
        none_li.setAttribute('class', 'item');
        none_li.innerHTML = 'nenhuma';
        tomorrow_li.innerHTML = 'amanhã';
        arrow_div.setAttribute('class', 'arrow');
        fill_div.setAttribute('class', 'fill');

        /* Hierarquia */
        element.appendChild(legend_div);
        legend_div.appendChild(text_label);
        element.appendChild(data_div);
        data_div.appendChild(input_text);

        data_div.appendChild(datepicker_div);
        datepicker_div.appendChild(calendar_div);
        calendar_div.appendChild(month_div);
        month_div.appendChild(previousmonth_div);
        month_div.appendChild(date_div);
        month_div.appendChild(nextmonth_div);
        calendar_div.appendChild(weekdays_div);
        weekdays_div.appendChild(sunday_div);
        weekdays_div.appendChild(monday_div);
        weekdays_div.appendChild(tuesday_div);
        weekdays_div.appendChild(wednesday_div);
        weekdays_div.appendChild(thursday_div);
        weekdays_div.appendChild(friday_div);
        weekdays_div.appendChild(saturday_div);
        calendar_div.appendChild(monthdays_ul);
        datepicker_div.appendChild(presets_div);
        presets_div.appendChild(menu_menu);
        menu_menu.appendChild(none_li);
        menu_menu.appendChild(today_li);
        menu_menu.appendChild(tomorrow_li);
        datepicker_div.appendChild(arrow_div);
        arrow_div.appendChild(fill_div);

        /* Métodos protegidos */
        this.attach = function (HTMLobject, collection) {
            if (HTMLobject && collection && HTMLobject.appendChild) {
                parent = collection
                HTMLobject.appendChild(element);
            }
        };
        this.detach = function (HTMLobject, collection) {
            if (HTMLobject && collection && HTMLobject.removeChild) {
                HTMLobject.removeChild(element);
            } else {
                parent.remove(this);
            }
        };
        /* Métodos públicos */
        this.legend = function (value) {
            if (value) {
                text_label.innerHTML = value;
            } else {
                return text_label.innerHTML;
            }
        };
        this.name = function (value) {
            if (value) {
                input_text.setAttribute('name', value);
                text_label.setAttribute('for', value);
            } else {
                return input_text.getAttribute('name');
            }
        };
        this.value = function (value) {
            if (value) {
                input_text.value = value;
                this.change();
            } else {
                return input_text.value;
            }
        };
        this.change = function (value) {
            if (value) {
                cb = value;
            } else {
                if (cb) {
                    cb.apply(app);
                }
            }
        };
        this.show = function () {
            datepicker_div.setAttribute('class', 'date-picker');
            date_div.innerHTML = that.dateName();
            that.monthdays();
        };
        this.hide = function () {
            setTimeout(function () {
                if (!changing_month) {
                    datepicker_div.setAttribute('class', 'date-picker hide');
                } else {
                    input_text.focus();
                }
                changing_month = false;
            }, 200);
        };
        this.previousMonth = function () {
            changing_month = true;

            var olddate = that.date(),
                date = new Date(olddate.getFullYear(), olddate.getMonth() - 1, olddate.getDate());

            input_text.value = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            date_div.innerHTML = that.dateName();
            that.monthdays();
        };
        this.nextMonth = function () {
            changing_month = true;

            var olddate = that.date(),
                date = new Date(olddate.getFullYear(), olddate.getMonth() + 1, olddate.getDate());
            if (olddate.getMonth() + 1 != date.getMonth()) {
                date = new Date(olddate.getFullYear(), olddate.getMonth() + 2, 0);
            }

            input_text.value = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            date_div.innerHTML = that.dateName();
            that.monthdays();
        };
        this.date = function () {
            var value = input_text.value.split('/'),
                today = new Date,
                day,month,year;

            switch (value.length) {
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
        this.dateName = function () {
            var date = this.date();

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
        this.monthdays = function () {

            function monthday (date_i) {
                var date = new Date(date_i.getFullYear(), date_i.getMonth(), date_i.getDate(), 1),
                    element = document.createElement('li'),
                    style = 'day',
                    today = new Date();

                element.innerHTML = date.getDate();

                if (date.getDay() === 0 || date.getDay() === 6) {
                    style += ' weekend';
                }
                if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate()) {
                    style += ' today';
                }
                if (date.getFullYear() !== that.date().getFullYear() || date.getMonth() !== that.date().getMonth()) {
                    style += ' previous-month';
                }
                if (date.getFullYear() === that.date().getFullYear() && date.getMonth() === that.date().getMonth() && date.getDate() === that.date().getDate()) {
                    style += ' selected';
                }
                element.setAttribute('class', style);

                element.addEventListener('click', function () {
                    input_text.value = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                    that.change();
                }, true);

                return element;
            }

            var today = this.date(),
                month_start = new Date(today.getFullYear(), today.getMonth(), 1, 1),
                current_date = new Date(today.getFullYear(), today.getMonth(), 1, 1);

            monthdays_ul.innerHTML = '';

            current_date.setDate(current_date.getDate() - current_date.getDay());
            while (current_date < month_start) {
                monthdays_ul.appendChild(monthday(current_date));

                current_date.setDate(current_date.getDate() + 1);
            }

            current_date.setMonth(month_start.getMonth(), 1);
            while (current_date.getMonth() === month_start.getMonth()) {
                monthdays_ul.appendChild(monthday(current_date));

                current_date.setDate(current_date.getDate() + 1);
            }

            current_date.setDate(0);
            current_date.setMonth(month_start.getMonth() + 1, 1);
            while (current_date.getDay() !== 0) {
                monthdays_ul.appendChild(monthday(current_date));

                current_date.setDate(current_date.getDate() + 1);
            }
        }

        /* Eventos */
        input_text.addEventListener('change', function () {
            if (cb) {
                cb.apply(app);
            }
        }, true);
        input_text.addEventListener('keypress', function (e) {
            var typed = e.keyCode,
                increment = 0,
                olddate = that.date();

            if (typed === 9) {
                return true
            } else if (typed === 13) {
                e.preventDefault();
                var date = new Date(olddate.getFullYear(), olddate.getMonth(), olddate.getDate());
                input_text.value = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                input_text.blur();
                that.change();
            } else {
                e.preventDefault();
                switch (typed) {
                    case 37:
                        increment = -1;
                        break;
                    case 38:
                        increment = -7;
                        break;
                    case 39:
                        increment = 1;
                        break;
                    case 40:
                        increment = 7;
                        break;
                }

                var date = new Date(olddate.getFullYear(), olddate.getMonth(), olddate.getDate() + increment);

                input_text.value = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                date_div.innerHTML = that.dateName();
                that.monthdays();
                that.change();
            }

            return false;
        }, true);
        today_li.addEventListener('click', function () {
            var date = new Date();
            input_text.value = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            that.change();
        }, true);
        tomorrow_li.addEventListener('click', function () {
            var date = new Date();
            input_text.value = (date.getDate() + 1) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            that.change();
        }, true);
        none_li.addEventListener('click', function () {
            var date = new Date();
            input_text.value = '';
            that.change();
        }, true);
        previousmonth_div.addEventListener('click', this.previousMonth, true);
        nextmonth_div.addEventListener('click', this.nextMonth, true);
        input_text.addEventListener('focus', this.show, true);
        input_text.addEventListener('blur', this.hide, true);

        /* Setando valores iniciais */
        if (params) {
            this.legend(params.legend);
            this.name(params.name);
            this.value(params.value);
            this.change(params.change);
        }
    };
}
