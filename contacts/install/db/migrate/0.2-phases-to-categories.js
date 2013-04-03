/**
 * Migração da versão 0.2
 * Fases para categorias e novas categorias padrão
 *
 * @author Mauro Ribeiro
 * @since  2013-02-08
 */

var users = db.users.find();

while (users.hasNext()) {
    var user = users.next();
    if (user.phases !== undefined && user.categories === undefined) {
        user.categories = user.phases;
        delete user.phases;
        for (var i in user.categories) {
            user.categories[i].type = 'clients';
            user.categories[i].color = 'red';
            delete user.categories[i].childs;
            if (user.categories[i].name === 'Lead') {
                user.categories[i].name = 'Potencial';
            }
        }
        user.categories.push({_id : new ObjectId(), name : 'Fornecedor', type : 'suppliers', color : 'green'});
        user.categories.push({_id : new ObjectId(), name : 'Ex-fornecedor', type : 'suppliers', color : 'green'});
        user.categories.push({_id : new ObjectId(), name : 'Parceiro', type : 'partners', color : 'gold'});
        user.categories.push({_id : new ObjectId(), name : 'Revendedor', type : 'partners', color : 'gold'});
        user.categories.push({_id : new ObjectId(), name : 'Amigos', type : 'personals', color : 'blue'});
        user.categories.push({_id : new ObjectId(), name : 'Família', type : 'personals', color : 'blue'});
        user.categories.push({_id : new ObjectId(), name : 'Trabalho', type : 'personals', color : 'blue'});
    }
    db.users.save(user);
}