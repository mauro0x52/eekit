/**
 * Caixa
 *
 * @author : Mauro Ribeiro
 * @since : 2013-04
 *
 * @description : Representação da entidade de boleto da Caixa
 */

var Billet = {
    bank : 'Caixa',
    bankId : '104',
    wallets : ['sigcb'] // SICOB e SINCO estão deprecados
}

/**
 * Valida os dados do boleto para a Caixa
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 *
 * @param billet boleto
 * @param cb callback
 */
Billet.validate = function (billet, cb) {
    var valid = true, error = null, errors = {},
        util = require('util');

    constructError = function (path, type) {
        return { message : 'Validator "'+type+'" failed for path '+path, name : 'ValidatorError', path : path, type : type };
    }
    ValidationError = function (errors) {
        Error.call(this);
        Error.captureStackTrace(this, this.constructor);

        this.message = 'Validation failed';
        this.name = 'ValidationError';
        this.errors = errors;
    }
    util.inherits(ValidationError, Error);

    /* obrigatórios */
    if (!billet.wallet || this.wallets.indexOf(billet.wallet.toString()) === -1) {
        valid = false;
        errors.wallet = constructError('wallet', 'enum');
    }
    if (!billet.agency || /^\d{4}$/.test(billet.agency) === false) {
        valid = false;
        errors.agency = constructError('agency', '\\d{4}');
    }
    /* na verdade trata-se de um codigo do cedente */
    if (!billet.account || /^\d{6}$/.test(billet.account) === false) {
        valid = false;
        errors.account = constructError('account', '\\d{6}');
    }
    if (!billet.dueDate) {
        valid = false;
        errors.dueDate = constructError('dueDate', 'required');
    }
    if (!billet.creationDate) {
        valid = false;
        errors.creationDate = constructError('creationDate', 'required');
    }
    if (!billet.value) {
        valid = false;
        errors.value = constructError('value', 'required');
    }

    if (valid) {
        /* opcional */
        if (!billet.ourNumber) {
            billet.ourNumber = this.generateOurNumber();
        } else if (/^24\d{15}$/.test(billet.ourNumber) === false) {
            valid = false;
            errors.ourNumber = constructError('ourNumber', '24\\d{15}');
        }
        billet.bank = this.bank;
    } else {
        error = new ValidationError(errors);
    }

    cb(error);
}

/**
 * Formata os dados tudo bonitinho para imprimir o boleto
 *
 * @author Mauro Ribeiro
 * @since  2013-04
 *
 * @param billet boleto
 * @param cb callback
 */
Billet.print = function (billet, cb) {
    var line, free, freeDv,
        fValue, fOurNumber, fOurNumberDv, fAgency, fAccount, fAccountDv, dv,
        print = {},
        that = this;

    this.validate(billet, function (error) {
        if (error) {
            cb(error);
        } else {
            fValue = that.formatNumber(billet.value.toFixed(2), 10, 0, 'value');
            fOurNumber = that.formatNumber(billet.ourNumber, 17, 0);
            fAgency = that.formatNumber(billet.agency, 4, 0);
            fAccount = that.formatNumber(billet.account, 6, 0);
            fAccountDv = that.modulus11(fAccount);

            free = fAccount + fAccountDv + that.formatNumber(fOurNumber.substring(2,5), 3, 0) + that.formatNumber(fOurNumber.substring(0,1), 1, 0) + that.formatNumber(fOurNumber.substring(5,8), 3, 0) + that.formatNumber(fOurNumber.substring(1,2), 1, 0) + that.formatNumber(fOurNumber.substring(8), 9, 0);
            freeDv = that.ourNumberVerificationDigit(free);

            fOurNumberDv = that.ourNumberVerificationDigit(fOurNumber);
console.log(billet.bankId + '' + billet.currency + '' + that.dueFactor(billet.dueDate) + '' + fValue + '' + free + '' + freeDv)
            dv = that.codeVerificationDigit(billet.bankId + '' + billet.currency + '' + that.dueFactor(billet.dueDate) + '' + fValue + '' + free + '' + freeDv);

            line = billet.bankId + '' + billet.currency + '' + dv + '' + that.dueFactor(billet.dueDate) + '' + fValue + '' + free + '' + freeDv;

            for (var i in billet) {
                if (typeof billet[i] !== 'function' && i[0] !== '_') {
                    print[i] = billet[i];
                }
            }

            print.bankIdVD = that.bankVerificationDigit(billet.bankId);
            print.ourNumber = fOurNumber + '-' + fOurNumberDv;
            print.account = print.account+'-'+fAccountDv
            print.bank = that.bank;
            print.digitCode = that.digitCode(line);
            print.barCodeNumber = line;
            print.barCode = that.barCode(line);
            print.wallet = 'SR';
            cb(null, print);
        }
    });
}

/**
 * Gera nosso número
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 */
Billet.generateOurNumber = function () {
    var date = new Date(),
        number;
    number = (parseInt(date.getTime()/1000,10)%100000000).toString();
    number = this.formatNumber(number, 15, 0);
    return '24'+number;
}

/**
 * Calcula dígito de verificação do banco
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param bankId string contendo o id do banco
 */
Billet.bankVerificationDigit = function (bankId) {
    var part1, part2;
    part1 = bankId.substring(0, 3);
    part2 = this.modulus11(part1);
    return part2;
}

/**
 * Calcula dígito de verificação do nosso numero
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param number string de caracteres com os dados do boleto
 */
Billet.ourNumberVerificationDigit = function (number) {
    var mod, digit, verificationDigit;
    mod = this.modulus11(number, 9, 1);

    digit = 11 - mod;
    if (digit === 0 || digit === 1 || digit === 10 || digit === 11) {
        verificationDigit = 1;
    } else {
        verificationDigit = digit;
    }
    return verificationDigit;
}

/**
 * Calcula dígito de verificação do número do código de barra
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 *
 * @param number string de caracteres com os dados do boleto
 */
Billet.codeVerificationDigit = function (number) {
    var mod, digit, verificationDigit;
    mod = this.modulus11(number, 9, 1);

    if (mod === 0 || mod === 1 || mod === 10) {
        verificationDigit = 1;
    } else {
        verificationDigit = 11 - mod;
    }
    return verificationDigit;
}

/**
 * Formata número preenchendo vazios com caracteres
 * baseado no BoletoPHP
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param number string de caracteres
 * @param loop número de caracteres
 * @param insert caracter a ser inserido
 * @param type tipo de valor
 */
Billet.formatNumber = function (number, loop, insert, type) {
    number = number.toString();

    if (!type) type = 'general';
    if (type === 'general') {
        number = number.replace(',', '');
        number = number.replace('.', '');
        while (number.length < loop) {
            number = insert + number;
        }
    } else if (type === 'value') {
        /* retira as virgulas, formata o numero e preenche com zeros */
        number = number.replace(',', '');
        number = number.replace('.', '');
        while (number.length < loop) {
            number = insert + number;
        }
    } else if (type === 'convenant') {
        while (number.length < loop) {
            number = insert + number;
        }
    }
    return number;
}

/**
 * Gera o código de barras
 * baseado no BoletoPHP
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param value número do código de barras
 */
Billet.barCode = function (value) {
    var bars = ['00110', '10001', '01001', '11000', '00101', '10100', '01100', '00011', '10010', '01010'],
        f1, f2, f, text, i, barCode;

    for (f1 = 9; f1 >= 0; f1--) {
        for (f2 = 9; f2 >=0; f2--) {
            f = (f1 * 10) + f2;
            text = '';
            for (i = 1; i < 6; i++) {
                text += bars[f1].substring(i-1,i)+bars[f2].substring(i-1,i);
            }
            bars[f] = text;
        }
    }

    barCode = 'bwbw';

    text = value;
    if (text.length % 2 != 0) {
        text = 0 + text;
    }

    while (text.length > 0) {
        i = Math.round(parseInt(text.substring(0,2),10));
        text = text.substring(2, text.length);
        f = bars[i];
        for (i = 1; i < 11; i += 2) {
            if (f.substring(i-1,i) === '0') {
                barCode += 'b';
            } else {
                barCode += 'B';
            }
            if (f.substring(i,i+1) === '0') {
                barCode += 'w';
            } else {
                barCode += 'W';
            }
        }
    }

    barCode += 'Bwb'

    return barCode;
}

/**
 * Calcula a linha digitável do número do código de barras
 * baseado no BoletoPHP
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param code número do código de barras
 */
Billet.digitCode = function (code) {
    var bank, moeda, ccc, ddnnum, dv1,
        resnum, dac1, dddag, dv2,
        resag, contadac, zeros, dv3,
        dv4,
        factor, value,
        set1, set2, set3,
        field1, field2, field3, field4, field5;

    bank = code.substring(0, 3);
    moeda = code.substring(3, 4);
    dv4 = code.substring(4, 5);
    factor = code.substring(5, 9);
    value = code.substring(9, 19);
    ccc = code.substring(19, 22);
    ddnnum = code.substring(22, 24);
    resnum = code.substring(24, 30);
    dac1 = code.substring(30, 31);
    dddag = code.substring(31, 34);
    resag = code.substring(34, 35);
    contadac = code.substring(35, 41);
    zeros = code.substring(41, 44);

    set1 = bank + '' + moeda + '' + ccc + '' + ddnnum;
    dv1 = this.modulus10(set1);

    set2 = resnum + '' + dac1 + '' + dddag;
    dv2 = this.modulus10(set2);

    set3 = resag + '' + contadac + '' + zeros;
    dv3 = this.modulus10(set3);

    field1 = set1.substring(0,5) + '.' + set1.substring(5,9)+dv1;
    field2 = set2.substring(0,5) + '.' + set2.substring(5,10)+dv2;
    field3 = set3.substring(0,5) + '.' + set3.substring(5,10)+dv3;
    field4 = dv4;
    field5 = factor+value;

    return field1 + ' ' + field2 + ' ' + field3 + ' ' + field4 + ' ' + field5;
}

/**
 * Fator da data de vencimento
 * baseado no BoletoPHP
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param date data de vencimento
 */
Billet.dueFactor = function (date) {
    var dateEnd, dateStart, days;

    dateEnd = new Date(date);
    dateStart = new Date(1997, 9, 7);

    days = Math.floor((dateEnd.getTime() - dateStart.getTime())/86400000);

    return days;
}

/**
 * Módulo 10
 * baseado no BoletoPHP
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param number string de caracteres numéricos
 */
Billet.modulus10 = function (number) {
    var total = 0 , factor = 2,
        temp, temp0, mod10, digit;

    number = number.toString();

    // separação dos números
    for (var i = number.length - 1; i >= 0; i--) {
        // efetua multiplicação do número pelo fator
        temp = (parseInt(number[i],10) * factor).toString();
        temp0 = 0;
        // soma todos os dígitos do número * fator
        for (var j in temp) {
            temp0 += parseInt(temp[j],10);
        }
        total += temp0;
        // intercala fator de multiplicação
        if (factor == 2) {
            factor = 1;
        } else {
            factor = 2;
        }
    }

    // cálculo do modulo 10
    mod10 = total % 10;
    if (mod10 == 0) {
        digit = 0;
    } else {
        digit = 10 - mod10;
    }
    return digit;
}

/**
 * Módulo 11
 * baseado no BoletoPHP
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param number string de caracteres numéricos
 */
Billet.modulus11 = function (number, base, r) {
    var sum = 0, factor = 2,
        digit;
    if (!r) r = 0;
    if (!base) base = 9;

    number = number.toString();

    // separação dos números
    for (var i = number.length - 1; i >= 0; i--) {
        // soma dos dígitos da multiplicação do número isolado pelo fator
        sum += parseInt(number[i],10) * factor;
        if (factor === base) {
            // restaura fator de multiplicação para 1
            factor = 1;
        }
        factor++;
    }

    // cálculo do módulo 11
    if (r === 0) {
        sum *= 10;
        digit = sum % 11;
        if (digit === 10) {
            digit = 0;
        }
        return digit;
    } else {
        return sum % 11;
    }
}

/*  Exportando o pacote  */
exports.Caixa = Billet;