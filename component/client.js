import { clientStorage } from './local-storage.js';
function getIndexOf3thComma(string) {
    let count = 0;
    let i = string.length - 1;
    while (count < 3 && i > 0) {
        if (string[i] === ',') {
            count++;
        }
        i--;
    }
    return i + 1;
}
function splitAddress(string) {
    const position = getIndexOf3thComma(string);
    const firstPart = string.slice(0, position + 1);
    var lastPart = string.slice(position + 2);
    return [firstPart, lastPart];
}

// Hàm xóa dấu tiếng Việt
function removeVietnameseAccent(str) {
    const accents = [
      /[\300-\306]/g, /[\340-\346]/g, // A, a
      /[\310-\313]/g, /[\350-\353]/g, // E, e
      /[\314-\317]/g, /[\354-\357]/g, // I, i
      /[\322-\330]/g, /[\362-\370]/g, // O, o
      /[\331-\334]/g, /[\371-\374]/g, // U, u
      /[\321]/g, /[\361]/g, // N, n
      /[\307]/g, /[\347]/g, // C, c
    ];

    const noAccents = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

    for (let i = 0; i < accents.length; i++) {
      str = str.replace(accents[i], noAccents[i]);
    }

    return str;
  }

// const convertPosition = [
//     {
//         vi: 'Giám đốc',
//         en: 'Director'
//     }
// ];

function getClientInput() {
    const addressSplit = splitAddress(document.getElementById('input-client__address').value);
    const addressEndSplit = splitAddress(document.getElementById('input-client__en-address').value);

    const representGenderEn = ongOrBa => {
        if (ongOrBa === 'Ông') {
            return 'Mr.';
        } else return 'Mrs.';
    };

    const newClinet = {
        name: document.getElementById('input-client__name').value,
        nameEn: document.getElementById('input-client__en-name').value,
        addressFirst: addressSplit[0],
        addressLast: addressSplit[1],
        addressEnFirst: addressEndSplit[0],
        addressEnLast: addressEndSplit[1],
        taxCode: document.getElementById('input-client__taxcode').value,
        phoneNumber: document.getElementById('input-client__phonenumber').value,
        represent: document.getElementById('input-client__represent').value,
        representEn: removeVietnameseAccent(document.getElementById('input-client__represent').value),
        representGender: document.getElementById('input-client__represent--gender').value,
        representGenderEn: representGenderEn(document.getElementById('input-client__represent--gender').value),
        representPosition: document.getElementById('input-client__represent--position').value,
        representPositionEn: document.getElementById('input-client__represent--en-position').value
    };
    clientStorage().save(newClinet);
}

function addClient(addedClinet) {
    const elements = `<div class="form">
            <h3>${addedClinet.name}</h3>
            <h3 class="italic m-bot">(${addedClinet.nameEn})</h3>
            <p class="m-bot">
                <i class="fa-sharp fa-solid fa-hashtag"></i> ${addedClinet.taxCode} (MST/<span class="italic">Tax code</span>)
            </p>
            <p class="un-bold">
                <i class="fa-sharp fa-solid fa-location-dot"></i>
                ${addedClinet.addressFirst}<br />
                ${addedClinet.addressLast}
            </p>
            <p class="italic un-bold m-bot">
            ${addedClinet.addressEnFirst}<br />
            ${addedClinet.addressEnLast}
            </p>
            <p class="m-bot"><i class="fa-sharp fa-solid fa-phone"></i> ${addedClinet.phoneNumber}</p>
            <p><i class="fa-sharp fa-solid fa-user"></i> ${addedClinet.representGender} ${addedClinet.represent} - ${addedClinet.representPosition}</p>
            <p class="italic">(${addedClinet.representGenderEn} ${addedClinet.representEn} - ${addedClinet.representPositionEn})</p>
        </div>
        <div>
            <button class="button">
                <i class="fa-sharp fa-regular fa-pen-to-square fa-2xl"></i>
            </button>
        </div>`;

    const parent = document.querySelector('#input__client .client-added');
    parent.innerHTML = elements;
}

export function confirmClient() {
    getClientInput();
    const addedClinet = clientStorage().load();
    addClient(addedClinet);

    const parent = document.querySelector('#input__client .client-added');
    parent.style.display = 'flex';
}

(function () {
    const btn = document.getElementById('add-client');
    btn.addEventListener('click', () => {
        confirmClient();
    });
})();

(function () {
    const addedClinet = clientStorage().load();
    if (Object.keys(addedClinet).length > 0) {
        addClient(addedClinet);
    } else {
        const parent = document.querySelector('#input__client .client-added');
        parent.style.display = 'none';
    }
})()
