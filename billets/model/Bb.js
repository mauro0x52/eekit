/**
 * Banco do Brasil
 *
 * @author : Mauro Ribeiro
 * @since : 2013-03
 *
 * @description : Representação da entidade de boleto do Banco do Brasil
 */

var Billet = {
    bank : 'Banco do Brasil',
    bankId : '001',
    wallets : ['18']
}

/**
 * Valida os dados do boleto para o Banco do Brasil
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param billet boleto
 * @param cb callback
 */
Billet.validate = function (billet, cb) {
    var valid = true, error = null, errors = {};

    constructError = function (path, type) {
        valid = false;
        return { message : 'Validator "'+type+'" failed for path '+path, name : 'ValidatorError', path : path, type : type };
    }

    /* obrigatórios */
    if (!billet.wallet || this.wallets.indexOf(billet.wallet.toString()) === -1) {
        valid = false;
        errors.wallet = constructError('wallet', 'enum');
    }
    if (!billet.agency || /^\d{4}$/.test(billet.agency) === false) {
        valid = false;
        errors.agency = constructError('agency', '\\d{4}');
    }
    if (!billet.account || /^\d{5}$/.test(billet.account) === false) {
        valid = false;
        errors.account = constructError('account', '\\d{5}');
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
    if (!billet.agreement || /^\d{6,8}$/.test(billet.agreement) === false) {
        valid = false;
        errors.agreement = constructError('agreement', '\\d{6,8}');
    }

    if (billet.agreement.length === 6) {
        if (!billet.ourNumber) {
            billet.ourNumber = this.generateOurNumber(17);
        } else if ((/^\d{1,17}$/.test(billet.ourNumber) === false)) {
            valid = false;
            errors.ourNumber = constructError('ourNumber', '\\d{1,17}');
        }
    } else if (billet.agreement.length === 7) {
        if (!billet.ourNumber) {
            billet.ourNumber = this.generateOurNumber(10);
        } else if ((/^\d{1,10}$/.test(billet.ourNumber) === false)) {
            valid = false;
            errors.ourNumber = constructError('ourNumber', '\\d{1,10}');
        }
    } else if (billet.agreement.length === 8) {
        if (!billet.ourNumber) {
            billet.ourNumber = this.generateOurNumber(9);
        } else if ((/^\d{1,9}$/.test(billet.ourNumber) === false)) {
            valid = false;
            errors.ourNumber = constructError('ourNumber', '\\d{1,9}');
        }
    }

    if (valid) {
    } else {
        error = {
            message : 'Validation failed',
            name : 'ValidationError',
            errors : errors
        }
    }

    cb(error);
}

/**
 * Formata os dados tudo bonitinho para imprimir o boleto
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param billet boleto
 * @param cb callback
 */
Billet.print = function (billet, cb) {
    var line,
        fValue, fAgency, fAccount, vd,
        fAgencyVD, fAccountVD, dueFactor,
        print = {},
        that = this;

    this.validate(billet, function (error) {
        if (error) {
            cb(error);
        } else {
            fValue = that.formatNumber(billet.value, 10, 0, 'value');
            fAgency = that.formatNumber(billet.agency, 4, 0);
            fAccount = that.formatNumber(billet.account, 8, 0);
            fAgencyVD = that.modulus11(fAgency);
            fAccountVD = that.modulus11(fAccount);
            dueFactor = that.dueFactor(billet.dueDate);

            for (var i in billet) {
                if (typeof billet[i] !== 'function' && billet.hasOwnProperty(i)) {
                    print[i] = billet[i];
                }
            }
            if (print.agreement.length === 6) {
                print.ourNumber = that.formatNumber(print.ourNumber, 17, 0);
                vd = that.modulus11(print.bankId + '' + print.currency + '' + dueFactor + '' + fValue + '' + '' + print.agreement + '' + print.ourNumber + '21', 9, 0, false);
                line = print.bankId + '' + print.currency + '' + vd + '' + dueFactor + '' + fValue + '' + '' + print.agreement + '' + print.ourNumber + '21';
                print.ourNumber = print.agreement + print.ourNumber +'-'+ that.modulus11(print.agreement + print.ourNumber);
            } else if (print.agreement.length === 7) {
                print.ourNumber = that.formatNumber(print.ourNumber, 10, 0);
                vd = that.modulus11(print.bankId + '' + print.currency + '' + dueFactor + '' + fValue + '000000' + '' + print.agreement + '' + print.ourNumber + '' + print.wallet, 9, 0, false);
                line = print.bankId + '' + print.currency + '' + vd + '' + dueFactor + '' + fValue + '000000' + '' + print.agreement + '' + print.ourNumber + '' + print.wallet;
                print.ourNumber = print.agreement + print.ourNumber;
            } else if (print.agreement.length === 8) {
                print.ourNumber = that.formatNumber(print.ourNumber, 9, 0);
                vd = that.modulus11(print.bankId + '' + print.currency + '' + dueFactor + '' + fValue + '000000' + '' + print.agreement + '' + print.ourNumber + '' + print.wallet, 9, 0, false);
                line = print.bankId + '' + print.currency + '' + vd + '' + dueFactor + '' + fValue + '000000' + '' + print.agreement + '' + print.ourNumber + '' + print.wallet;
                print.ourNumber = print.agreement + print.ourNumber +'-'+ that.modulus11(print.agreement + print.ourNumber);
            }

            print.agency = print.agency+'-'+fAgencyVD;
            print.account = print.account+'-'+fAccountVD;
            print.bankIdVD = that.bankVerificationDigit(billet.bankId);
            print.ourNumberVD = that.modulus10(fAgency + fAccount + billet.wallet + billet.ourNumber);
            print.bank = that.bank;
            print.digitCode = that.digitCode(line);
            print.barCodeNumber = line;
            print.barCode = that.barCode(line);
            cb(null, print);
        };
    });
}

/**
 * Gera nosso número
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 */
Billet.generateOurNumber = function (size) {
    var date = new Date(),
        time;

    if (!size) size = 10;

    time = (parseInt(date.getTime()/1000,10)).toString();
    return time.substring(time.length - size, time.length);
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
 * Calcula dígito de verificação do número do código de barra
 *
 * @author Mauro Ribeiro
 * @since  2013-02
 *
 * @param number string de caracteres com os dados do boleto
 */
Billet.codeVerificationDigit = function (number) {
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
        while (number.length < loop) {
            number = insert + number;
        }
    } else if (type === 'value') {
        /* retira as virgulas, formata o numero e preenche com zeros */
        number = number.replace(',', '');
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
    var free1, free2, free3,
        bank, moeda, dv1, dv2, dv3, dv4,
        factor, value,
        set1, set2, set3,
        field1, field2, field3, field4, field5;

    bank = code.substring(0, 3);
    moeda = code.substring(3, 4);
    free1 = code.substring(19, 24);
    free2 = code.substring(24,34);
    free3 = code.substring(34, 44);
    factor = code.substring(5, 9);
    value = code.substring(9, 19);

    dv4 = code.substring(4, 5);

    set1 = bank + '' + moeda + '' + free1;
    dv1 = this.modulus10(set1);

    set2 = free2;
    dv2 = this.modulus10(set2);

    set3 = free3;
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
Billet.modulus11 = function (number, base, r, digitx) {
    var sum = 0, factor = 2,
        digit;
    if (!base) base = 9;
    if (!r) r = 0;
    if (!digitx) digitx = true;

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
            digit = 'X';
        }
        if (digitx === false && (digit === 0 || digit === 'X' || digit > 9)) {
            digit = 1;
        }
        return digit;
    } else {
        return sum % 11;
    }
}

/*  Exportando o pacote  */
exports.Bb = Billet;