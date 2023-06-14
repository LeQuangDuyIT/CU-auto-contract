import {
    sourceDocStorage,
    clientStorage,
    serviceStorage,
    productionUnitStorage,
    contractOverviewStorage,
    totalServiceFeeStorage,
    processingUnitStorage
} from './component/local-storage.js';
import { numberToWordsVi, numberToWordsEn } from './component/number-to-words2.js';

function getClientElements() {
    return {
        name: Array.from(document.getElementsByClassName('client__name')),
        nameEn: Array.from(document.getElementsByClassName('client__en-name')),
        addressFirst: Array.from(document.getElementsByClassName('client__address--first')),
        addressLast: Array.from(document.getElementsByClassName('client__address--last')),
        addressEnFirst: Array.from(document.getElementsByClassName('client__address-en--first')),
        addressEnLast: Array.from(document.getElementsByClassName('client__address-en--last')),
        taxCode: Array.from(document.getElementsByClassName('client__taxcode')),
        phoneNumber: Array.from(document.getElementsByClassName('client__phonenumber')),
        represent: Array.from(document.getElementsByClassName('client__represent')),
        representEn: Array.from(document.getElementsByClassName('client__represent-en')),
        representGender: Array.from(document.getElementsByClassName('client__represent--gender')),
        representGenderEn: Array.from(document.getElementsByClassName('client__represent--gender-en')),
        representPosition: Array.from(document.getElementsByClassName('client__represent--position')),
        representPositionEn: Array.from(document.getElementsByClassName('client__represent--position-en'))
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

function getContractOverviewElements() {
    return {
        standard: Array.from(document.getElementsByClassName('contract-standard')),
        date: Array.from(document.getElementsByClassName('contract-date')),
        vat: Array.from(document.getElementsByClassName('contract-vat')),
        contractId: Array.from(document.getElementsByClassName('contract-contractid')),
        numAPR: Array.from(document.getElementsByClassName('contract-apr'))
    };
}

export function renderContractOverview() {
    const contractOverview = contractOverviewStorage().load();
    if (Object.keys(contractOverview).length > 0) {
        const contractOverviewElement = getContractOverviewElements();

        const keys = Object.keys(contractOverviewElement);
        keys.forEach(key => contractOverviewElement[key].forEach(element => (element.innerHTML = contractOverview[key])));
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

    const productionUnitTitle = document.getElementById('production-unit__title');
    const productionUnitList = productionUnitStorage().load();
    if (productionUnitList.length === 0) {
        productionUnitTitle.style.display = 'none';
    }

    const processingUnitTitle = document.getElementById('processing-unit__title');
    const processingUnitList = processingUnitStorage().load();
    if (processingUnitList.length === 0) {
        processingUnitTitle.style.display = 'none';
    }
}

function renderTotalFee() {
    const fee = totalServiceFeeStorage().load();

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
renderContractOverview();
renderClient();

window.addEventListener('load', () => {
    formatAfterRender();

    const serviceList = serviceStorage().load();
    if (serviceList.length > 0) {
        renderTotalFee();
    }
});
