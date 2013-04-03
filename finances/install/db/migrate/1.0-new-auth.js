/**
 * Migração da versão 1.0
 * Novo Auth
 *
 * @author Mauro Ribeiro
 * @since  2013-04-03
 */

use finances;

db.users.renameCollection('companies');
var companies = db.companies.find();

while (companies.hasNext()) {
    /* empresa */
    var company = companies.next();
    var user_id = company.user.toString().substring(10,34);
    company.company = ObjectId(user_id.toString().substring(0,8)+'000000'+user_id.toString().substring(14));
    delete company.user;
    db.companies.save(company);

    /* transacoes */
    var transactions = db.transactions.find({user : company._id});

    while (transactions.hasNext()) {
        var transaction = transactions.next();

        transaction.company = transaction.user;
        transaction.author = ObjectId(user_id);

        delete transaction.user;

        db.transactions.save(transaction);
    }
}

