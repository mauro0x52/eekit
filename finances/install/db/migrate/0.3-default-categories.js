/**
 * Migração da versão 0.3
 * Transformando as categorias para categorias de despesa
 *
 * @author Mauro Ribeiro
 * @since  2013-02-08
 */

var users = db.users.find();

while (users.hasNext()) {
    var user = users.next();
    for (var i in user.categories) {
        if (user.categories[i].type === undefined) {
            user.categories[i].type = 'debt';
            user.categories[i].editable = true;
        }
    }
    db.users.save(user);
}