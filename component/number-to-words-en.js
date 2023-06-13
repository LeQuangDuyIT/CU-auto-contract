export function numberToWordsEn(number) {
    const units = [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen'
    ];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion'];

    if (number === 0) {
        return 'zero';
    }

    const numberString = number.toString();

    const digits = numberString
        .padStart(Math.ceil(numberString.length / 3) * 3, '0')
        .match(/\d{3}/g)
        .reverse();

    let words = [];
    digits.forEach((digit, index) => {
        const scale = scales[index];
        let groupWords = [];

        const hundredDigit = parseInt(digit[0], 10);
        const tenDigit = parseInt(digit[1], 10);
        const unitDigit = parseInt(digit[2], 10);

        if (hundredDigit !== 0) {
            groupWords.push(units[hundredDigit] + ' hundred');
        }

        if (tenDigit === 1) {
            groupWords.push(units[parseInt(digit.slice(1), 10)]);
        } else if (tenDigit !== 0) {
            groupWords.push(tens[tenDigit]);
        }

        if (unitDigit !== 0 && tenDigit !== 1) {
            groupWords.push(units[unitDigit]);
        }

        if (groupWords.length > 0) {
            if (scale !== '') {
                groupWords.push(scale);
            }
            words.unshift(...groupWords);
        }
    });

    return words.join(' ');
}