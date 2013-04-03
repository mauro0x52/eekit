/**
 * Migração da versão 1.0
 * Novo Auth
 *
 * @author Mauro Ribeiro
 * @since  2013-04-03
 */

use contacts;

db.users.renameCollection('companies');
var companies = db.companies.find();

while (companies.hasNext()) {
    /* atualiza a empresa */
    var company = companies.next();
    var user_id = company.user.toString().substring(10,34);
    company.company = ObjectId(user_id.substring(0,8)+'000000'+user_id.substring(14));
    delete company.user;
    db.companies.save(company);

    /* atualiza os contatos da empresa */
    var contacts = db.contacts.find({user : ObjectId(user_id)});

    while (contacts.hasNext()) {
        var contact = contacts.next();

        contact.company = contact.user;
        contact.author = ObjectId(user_id);

        delete contact.user;

        db.contacts.save(contact);
    }
}