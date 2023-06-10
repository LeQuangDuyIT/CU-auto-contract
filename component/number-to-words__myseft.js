const numAndWordData = [
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
const formatWord = [
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
        rough: 'mười mốt',
        format: 'mười một'
    }
];

// Đọc số có 3 chữ số
function for3(num) {
    let numString = '';
    let numArr = Array.from(num.toString());
    const donvi = numArr[numArr.length - 1];
    const chuc = numArr[numArr.length - 2];
    const tram = numArr[numArr.length - 3];

    if (tram) {
        numString = `${numAndWordData[tram].word} trăm ${numAndWordData[chuc].word} mươi ${numAndWordData[donvi].word}`;
    } else {
        if (chuc) {
            numString = `${numAndWordData[chuc].word} mươi ${numAndWordData[donvi].word}`;
        } else {
            numString = `${numAndWordData[donvi].word}`;
        }
    }

    function haveError(string) {
        for (let item of formatWord) {
            if (string.includes(item.rough)) {
                return true;
            }
        }
        return false;
    }
    console.log(haveError(numString));
    while (haveError(numString)) {
        formatWord.forEach(item => {
            if (numString.includes(item.rough)) {
                numString = numString.replace(item.rough, item.format);
            }
        });
    }

    return numString;
}
