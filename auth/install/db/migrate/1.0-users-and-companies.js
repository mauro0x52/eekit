/**
 * Migração para a versão 1.0
 * Agora usuários pertencem a uma empresa, e não existe mais o profiles
 *
 * @author Mauro Ribeiro
 * @since
 */

use profiles;
var profilesArray = db.profiles.find().toArray();

use auth;
var users = db.users.find();

while (users.hasNext()) {
    var user = users.next();
    var company = {};

    /* atualiza o user */
    var user_id = user._id.toString().substring(10,34);
    user.informations = {};
    for (var i in profilesArray) {
        if (profilesArray[i].user.toString() === user._id.toString()) {
            if (profilesArray[i].name) {
                if (profilesArray[i].surname) {
                    user.name = profilesArray[i].name + ' ' + profilesArray[i].surname
                } else {
                    user.name = profilesArray[i].name
                }
            } else {
                user.name = 'Usuário'
            }
            if (profilesArray[i].phone) {
                user.informations.phone = profilesArray[i].phone;
            }
        }
    }

    /* cria a empresa */
    company._id = ObjectId(user_id.substring(0,8)+'000000'+user_id.substring(14));
    company.name = user.name;
    company.users = [user._id];
    company.services = [{service : 'www'}];

    user.company = company._id;

    /* apaga os dados antigos e inúteis */
    delete user.authorizedApps;
    delete user.status;
    delete user.thirdPartylogins;
    delete user.tokens;
    delete user.auths;

    db.users.save(user);

    db.companies.save(company);
}