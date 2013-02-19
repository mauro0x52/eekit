/** Fieldset
 *
 * @autor : Rafael Erthal
 * @since : 2012-10
 *
 * @description : implementa conjunto de inputs
 */

sdk.modules.ui.fieldset = function (app) {
    return function (params) {
        var parent,
            element = document.createElement('div'),
            legend_legend = document.createElement('legend'),
            fields_ul = document.createElement('ul');

        /* CSS */
        element.setAttribute('class', 'field-set');
        legend_legend.setAttribute('class', 'hide');
        fields_ul.setAttribute('class', 'fields');

        /* Hierarquia */
        element.appendChild(legend_legend);
        element.appendChild(fields_ul);

        /* Métodos protegidos */
        this.validate = function () {
            var inputs = this.fields.get(),
                valid = true;

            for (var i in inputs) {
                if (inputs[i].validate && !inputs[i].validate()) {
                    valid = false;
                }
            }
            return valid;
        }
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
            if (value === '') {
                legend_legend.setAttribute('class', 'hide');
            }
            if (value) {
                legend_legend.setAttribute('class', 'legend');
                legend_legend.innerHTML = value;
            } else {
                return legend_legend.innerHTML;
            }
        };
        this.fields = new Collection(fields_ul, [app.ui.inputText,app.ui.inputPassword,app.ui.inputDate,app.ui.inputSelector]);
        /* Setando valores iniciais */
        if (params) {
            this.legend(params.legend);
            this.fields.add(params.fields);
        }
    };
}