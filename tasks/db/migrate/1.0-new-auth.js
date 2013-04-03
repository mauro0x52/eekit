/**
 * Migração da versão 1.0
 * Novo Auth
 *
 * @author Mauro Ribeiro
 * @since  2013-04-03
 */

use tasks;

db.users.renameCollection('companies');
var companies = db.companies.find();

while (companies.hasNext()) {

    /* atualiza empresa */
    var company = companies.next();
    var user_id = company.user.toString().substring(10,34);
    company.company = ObjectId(user_id.substring(0,8)+'000000'+user_id.substring(14));
    delete company.user;
    db.companies.save(company);

    /* tarefas */
    var tasks = db.tasks.find({user : company._id});

    while (tasks.hasNext()) {
        var task = tasks.next();

        task.company = company._id;
        task.author = ObjectId(user_id);
        task.user = ObjectId(user_id);

        db.tasks.save(task);
    }
}