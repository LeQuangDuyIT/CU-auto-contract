import { contractOverviewStorage } from './local-storage.js';

function getContractInput() {
    let dateValue = document.getElementById('input-standard__date').value;
    if (dateValue) {
        const parts = dateValue.split('-');
        dateValue = parts.reverse().join('/');
    } else {
        dateValue = '... / ... / ...';
    }

    const newContract = {
        standard: document.getElementById('input-standard__name').value,
        date: dateValue,
        vat: +document.getElementById('input-standard__vat').value * 100,
        contractId: document.getElementById('input-standard__contractid').value,
        numAPR: document.getElementById('input-standard__apr').value
    };
    contractOverviewStorage().save(newContract);
}

function addContract(addedContract) {
    const elements = `<div class="form">
        <h4>HỢP ĐỒNG DỊCH VỤ THEO TIÊU CHUẨN <span class="caps">${addedContract.standard}</span></h4>
        <h4 class="italic m-bot">CONTRACT FOR <span class="caps">${addedContract.standard}</span> STANDARD</h4>
        <p>Ngày tạo: <span>${addedContract.date}</span></p>
        <p class="m-bot">Thuế: <span>${addedContract.vat}</span>%</p>
        <p>APR: <span>${addedContract.numAPR}</span></p>
        <p>Mã hợp đồng: <span>${addedContract.contractId}</span></p>
    </div>`;

    const parent = document.querySelector('#input__contract-overview .contract-overview-added');
    parent.innerHTML = elements;
}

export function confirmContractOverview() {
    getContractInput();
    const addedContract = contractOverviewStorage().load();
    addContract(addedContract);

    const parent = document.querySelector('#input__contract-overview .contract-overview-added');
    parent.style.display = 'flex';
}

(function () {
    const btn = document.getElementById('add-contract-overview');
    btn.addEventListener('click', () => {
        confirmContractOverview();
    });
})();

(function () {
    const addedContract = contractOverviewStorage().load();
    if (Object.keys(addedContract).length > 0) {
        addContract(addedContract);
    } else {
        const parent = document.querySelector('#input__contract-overview .contract-overview-added');
        parent.style.display = 'none';
    }
})();
