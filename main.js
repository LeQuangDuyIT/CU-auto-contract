import { sourceDocStorage, clientStorage, serviceStorage } from './component/local-storage.js';
import { numberToWordsVi, numberToWordsEn } from './component/number-to-words.js';

function getClientElements() {
    return {
        name: Array.from(document.getElementsByClassName('client__name')),
        nameEn: Array.from(document.getElementsByClassName('client__en-name')),
        city: Array.from(document.getElementsByClassName('client__city')),
        district: Array.from(document.getElementsByClassName('client__district')),
        ward: Array.from(document.getElementsByClassName('client__ward')),
        address: Array.from(document.getElementsByClassName('client__address'))
    };
}

export function renderClient() {
    const clientInfo = clientStorage().load();
    if (Object.keys(clientInfo).length > 0) {
        const clientElement = getClientElements();

        const keys = Object.keys(clientElement);
        keys.forEach(key => clientElement[key].forEach(element => (element.innerHTML = clientInfo[key])));
    }
}

export function renderDocument() {
    const parentElement = document.getElementById('contract');

    const getCurrentPage = () => {
        const pages = Array.from(document.querySelectorAll('.page .page__core'));
        return pages[pages.length - 1];
    };

    const breackPage = element => element === '<a action="breack-page"></a>';

    const docData = sourceDocStorage().load();

    const isOverflowed = page => page.scrollHeight > page.offsetHeight;

    let currentPage = getCurrentPage();

    docData.forEach(element => {
        currentPage.innerHTML += element;

        if (isOverflowed(currentPage) || breackPage(element)) {
            currentPage.removeChild(currentPage.lastChild);

            const newPage = `
                <div class="page">
                    <div class="page__core" contenteditable="true">
                        <p>
                            <img class="logo" src="/assets/logoControlUnion.jpg" alt="logoControlUnion" />
                        </p>
                    </div>
                </div>
            `;
            parentElement.innerHTML += newPage;

            currentPage = getCurrentPage();
            currentPage.innerHTML += element;
        }
    });
}

function formatAfterRender() {
    const serviceTableBot = document.getElementById('service-table__bot');

    const thisPage = serviceTableBot.closest('.page');

    const findServiceTableTop = thisPage.querySelector('#service-table__top');

    if (!findServiceTableTop) {
        const tds = Array.from(document.querySelectorAll('#service-table__bot tr:first-child td'));
        tds.forEach(td => (td.style.borderTop = '1px solid black'));
    }
}

function getTotalFee() {
    const serviceList = serviceStorage().load();
    const totalFee = serviceList.reduce((total, service) => total + service.fee, 0);
    const amout = totalFee * 1.1;
    return {
        totalFee: totalFee,
        vAT: totalFee * 0.1,
        amount: amout,
        amountWordVi: numberToWordsVi(amout),
        amountWordEn: numberToWordsEn(amout)
    };
}
function renderTotalFee() {
    const fee = getTotalFee();

    function renderForEach(key, className) {
        const elements = Array.from(document.querySelectorAll(`.${className}`));
        elements.forEach(element => (element.textContent = fee[key].toLocaleString('en-US')));
    }

    renderForEach('totalFee', 'total-fee');
    renderForEach('vAT', 'vat');
    renderForEach('amount', 'amount');
    renderForEach('amountWordVi', 'amount-word-vi');
    renderForEach('amountWordEn', 'amount-word-en');
}

renderDocument();
renderClient();

window.addEventListener('load', () => {
    formatAfterRender();
    renderTotalFee();
});
