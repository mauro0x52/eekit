/** Itau
 * @author : Rafael Erthal
 * @since : 2013-02
 *
 * @description : Representação da entidade de boleto do itau
 */

var Billet = {
    bank : 'Banco Itaú',
    wallets : ['175', '174', '178', '104', '109', '157']
}

Billet.billet = function (billet) {
    var line, code,
        fValue, fOurNumber, fAgency, fAccount, dv;

    billet.ourNumber = this.generateOurNumber();

    fValue = this.formatNumber(billet.value, 10, 0, 'value');
    fOurNumber = this.formatNumber(billet.ourNumber, 8, 0);
    fAgency = this.formatNumber(billet.agency, 4, 0);
    fAccount = this.formatNumber(billet.account, 5, 0);

    code = billet.bankId +''+ billet.currency +''+ this.dueFactor(billet.dueDate) +''+ fValue +''+ billet.wallet +''+ fOurNumber +''+ this.modulus10(fAgency+fAccount+billet.wallet+fOurNumber) +''+ fAgency +''+ fAccount +''+ this.modulus10(fAgency+fAccount) + '000';

    dv = this.codeVerificationDigit(code);
    line = code.substring(0,4) + dv + code.substring(4,code.length);

    billet.bankIdVD = this.bankVerificationDigit(billet.bankId);
    billet.ourNumberVD = this.modulus10(fAgency + fAccount + billet.wallet + fOurNumber);
    billet.bank = this.bank;
    billet.digitCode = this.digitCode(line);
    billet.barCodeNumber = line;
    billet.barCode = this.barCode(line);
}

Billet.generateOurNumber = function () {
    var date = new Date();
    return (parseInt(date.getTime()/1000)%100000000).toString();
}

Billet.bankVerificationDigit = function (number) {
    var part1, part2;
    part1 = number.substring(0, 3);
    part2 = this.modulus11(part1);
    return part2;
}

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
        i = Math.round(parseInt(text.substring(0,2)));
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

Billet.dueFactor = function (string) {
    var dateEnd, dateStart, days;

    dateEnd = new Date(string);
    dateStart = new Date(1997, 9, 7);

    days = Math.floor((dateEnd.getTime() - dateStart.getTime())/86400000);

    return days;
}

Billet.modulus10 = function (number) {
    var total = 0 , factor = 2,
        temp, temp0, mod10, digit;

    number = number.toString();

    // separação dos números
    for (var i = number.length - 1; i >= 0; i--) {
        // efetua multiplicação do número pelo fator
        temp = (parseInt(number[i]) * factor).toString();
        temp0 = 0;
        // soma todos os dígitos do número * fator
        for (var j in temp) {
            temp0 += parseInt(temp[j]);
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

Billet.modulus11 = function (number, base, r) {
    var sum = 0, factor = 2,
        digit;
    if (!r) r = 0;
    if (!base) base = 9;

    number = number.toString();

    // separação dos números
    for (var i = number.length - 1; i >= 0; i--) {
        // soma dos dígitos da multiplicação do número isolado pelo fator
        sum += parseInt(number[i]) * factor;
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
exports.Itau = Billet;
