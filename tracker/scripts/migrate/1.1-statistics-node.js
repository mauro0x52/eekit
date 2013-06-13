/**
 * Migração da versão 1.1
 * Atualiza o status da galera toda
 *
 * @author Mauro Ribeiro
 * @since  2013-06
 */

var Statistic = require('../../model/Model.js').Statistic;

Statistic.find(function(error, statistics) {
    if (error) {
        console.log(error);
    } else {
        for (var i in statistics) {
            console.log('atualizando '+statistics[i]._id)
            statistics[i].updateStatus();
        }
    }
})