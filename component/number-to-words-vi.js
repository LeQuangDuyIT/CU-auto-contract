export const numAndWordData = [
    {
        num: 0,
        word: 'không'
    },
    {
        num: 1,
        word: 'một'
    },
    {
        num: 2,
        word: 'hai'
    },
    {
        num: 3,
        word: 'ba'
    },
    {
        num: 4,
        word: 'bốn'
    },
    {
        num: 5,
        word: 'năm'
    },
    {
        num: 6,
        word: 'sáu'
    },
    {
        num: 7,
        word: 'bảy'
    },
    {
        num: 8,
        word: 'tám'
    },
    {
        num: 9,
        word: 'chín'
    }
];
const formatWordData = [
    {
        rough: 'không mươi',
        format: 'linh'
    },
    {
        rough: 'linh không',
        format: ''
    },
    {
        rough: 'mươi năm',
        format: 'mươi lăm'
    },
    {
        rough: 'mươi một',
        format: 'mươi mốt'
    },
    {
        rough: 'một mươi',
        format: 'mười'
    },
    {
        rough: 'mươi không',
        format: 'mươi'
    },
    {
        rough: 'mười không',
        format: 'mười'
    },
    {
        rough: 'mười mốt',
        format: 'mười một'
    },
    {
        rough: 'một mươi mốt',
        format: 'mười một'
    }
];

function formatWord(numString) {
    function haveError(string) {
        for (let item of formatWordData) {
            if (string.includes(item.rough)) {
                return true;
            }
        }
        return false;
    }
    while (haveError(numString)) {
        formatWordData.forEach(item => {
            if (numString.includes(item.rough)) {
                numString = numString.replace(item.rough, item.format);
            }
        });
    }
    return numString
}

// Đọc số có 3 chữ số
function toWordUnit(num) {
    let numString = '';
    let numArr = Array.from(num.toString());
    const donvi = numArr[numArr.length - 1];
    const chuc = numArr[numArr.length - 2];
    const tram = numArr[numArr.length - 3];

    console.log(donvi, chuc, tram);

    if (tram) {
        numString = `${numAndWordData[tram].word} trăm ${numAndWordData[chuc].word} mươi ${numAndWordData[donvi].word}`;
    } else {
        if (chuc) {
            numString = `${numAndWordData[chuc].word} mươi ${numAndWordData[donvi].word}`;
        } else {
            numString = `${numAndWordData[donvi].word}`;
        }
    }

    numString = formatWord(numString);

    return numString;
}

console.log(toWordUnit(11));

function subClassNumber(num) {
    const numArr = Array.from(num.toString());
    const classNumber = ['', 'nghìn', 'triệu', 'tỷ'];
    let classArr = [];
    let unit = [];
    let k = 0;

    for (let i = numArr.length - 1; i >= 0; i--) {
        if (unit.length < 3) {
            unit.unshift(numArr[i]);
        }
        if ((unit.length < 3 && i === 0) || unit.length === 3) {
            const unitObj = {
                class: classNumber[k],
                value: unit.join('')
            };
            classArr.unshift(unitObj);
            unit = [];
            k++;
        }
    }
    return classArr;
}

export function toWordVi(num) {
    let subClass = subClassNumber(num);
    subClass.filter(classNum => classNum !== '000');
    subClass.forEach(classNum => classNum.value = toWordUnit(classNum.value));

    let resultToWord = subClass.reduce((string, item) => string + `${item.value} ${item.class} `, '');
    resultToWord = formatWord(resultToWord);

    return resultToWord;
}




