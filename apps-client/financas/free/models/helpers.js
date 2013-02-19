/**
 * Model dos helpers
 *
 * @author Rafael Erthal, Mauro Ribeiro
 * @since  2013-02
 */

function toArray (obj) {
    var res = [];
    for (var i in obj) {
        res.push(obj[i]);
    }
    return res;
}

app.models.helpers = {};

/**
 * @where : fluxo de caixa / botão receita
 */
app.models.helpers.noTransactions = function (countTransactions) {
    if (countTransactions === 0) {
        app.ui.actions.get()[1].helper.description('Comece registrando o que você receberá ou pagará ainda esta semana');
        app.ui.actions.get()[1].helper.example('Ex.: \"Serviço para a empresa Xavier - R$ xx,xx\" ou \"Conta de telefone e internet - R$ xx,xx\"');
    }
}

/**
 * @where : menu / contas
 */
app.models.helpers.firstTransaction = function (countTransactions, accounts) {
    var accountsArray = toArray(accounts);
    if (countTransactions === 1 && accountsArray[0].name === 'Banco' && accountsArray[1].name === 'Caixa' && accountsArray.length === 2) {
        app.ui.menu.get()[2].helper.description('Organize as contas bancárias e caixas da sua empresa');
        app.ui.menu.get()[2].helper.example('Além de organizar suas contas, aqui você pode cadastrar as informações da sua conta para conseguir acessá-las a qualquer momento.');
    }
}

/**
 * @where : contas / editar conta
 */
app.models.helpers.defaultAccounts = function (accounts) {
    var accountsArray = toArray(accounts);
    if (accountsArray[0].name === 'Banco' && accountsArray[1].name === 'Caixa' && accountsArray.length === 2) {
        app.ui.groups.get()[0].items.get()[0].helper.description('Preencha as informações sobre sua conta bancária');
        app.ui.groups.get()[0].items.get()[0].helper.example('Ao completar as informações sobre suas contas, você saberá a origem ou destino de cada transação financeira e poderá conciliar os valores a qualquer momento.');
    }
}

/**
 * @where : menu / categorias
 */
app.models.helpers.defaultCategories = function (categories, accounts) {
    var categoriesArray = toArray(categories),
        accountsArray = toArray(accounts);
    if (
            categoriesArray[0].name=='Aluguel' &&
            categoriesArray[1].name=='Comissão' &&
            categoriesArray[2].name=='Despesas gerais' &&
            categoriesArray[3].name=='Divulgação' &&
            categoriesArray[4].name=='Impostos' &&
            categoriesArray[5].name=='Material de Escritório' &&
            categoriesArray[6].name=='Produto 1' &&
            categoriesArray[7].name=='Produto 2' &&
            categoriesArray[8].name=='Receita não operacional' &&
            categoriesArray[9].name=='Receitas Gerais' &&
            categoriesArray[10].name=='Salários' &&
            categoriesArray[11].name=='Telefone e internet' &&
            categoriesArray[12].name=='Vendas' &&
            categoriesArray.length === 13 &&
            (accountsArray[0].name !== 'Banco' || accountsArray[1].name !== 'Caixa' || accountsArray.length !== 2)
    ) {
        app.ui.menu.get()[1].helper.description('Classifique suas despesas e receitas como preferir');
        app.ui.menu.get()[1].helper.example('Ao definir categorias você consegue ver seus resultados financeiros divididos, ajudando assim no processo de decisão e planejamento da sua empresa.');
    }
}


/**
 * @where : categorias / botão adicionar categoria
 */
app.models.helpers.defaultCategoriesB = function (categories, accounts) {
    if (
            categories[0].name=='Aluguel' &&
            categories[1].name=='Comissão' &&
            categories[2].name=='Despesas gerais' &&
            categories[3].name=='Divulgação' &&
            categories[4].name=='Impostos' &&
            categories[5].name=='Material de Escritório' &&
            categories[6].name=='Produto 1' &&
            categories[7].name=='Produto 2' &&
            categories[8].name=='Receita não operacional' &&
            categories[9].name=='Receitas Gerais' &&
            categories[10].name=='Salários' &&
            categories[11].name=='Telefone e internet' &&
            categories[12].name=='Vendas' &&
            categories.length === 13
    ) {
        app.ui.actions.get()[0].helper.description('Qual é uma boa categoria para eu usar?');
        app.ui.actions.get()[0].helper.example('Classificar gastos é normalmente mais tranquilo, mas a parte de receitas que pode complicar mais. O que vemos normalmente é que boas categorias são por nome ou tipo de produto/serviço que a empresa oferece. Ex.: \"consultoria xpto\", \"assessoria financeira\", \"serviço de limpeza completo\" etc.');
    }
}

/**
 * @where : fluxo de caixa / botão exportar dados
 */
app.models.helpers.thirdTransaction = function (countTransactions) {
    if (countTransactions === 3) {
        app.ui.actions.get()[0].helper.description('Ao usar os filtros, você consegue selecionar um período com transações e baixar os dados');
        app.ui.actions.get()[0].helper.example('Como toda a empresa precisa de uma contabilidade bem feita, aqui você pode baixar os dados do último mês, por exemplo, para então enviá-los ao seu Contador. Assim você economiza o seu tempo de controle financeiro e facilita a vida do seu Contador.');
    }
}

/**
 * @where : fluxo de caixa / saldo do dia
 */
app.models.helpers.sixthTransaction = function (countTransactions) {
    if (countTransactions === 6) {
        app.ui.groups.get()[0].groups.get()[0].footer.helper.description('Você já percebeu que pode ver o seu saldo a cada dia?');
        app.ui.groups.get()[0].groups.get()[0].footer.helper.example('Ao final de cada dia você consegue visualizar o saldo das contas selecionadas e assim verificar quando seu caixa estará num nível crítico no futuro.');
    }
}
