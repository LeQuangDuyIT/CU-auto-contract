import { contractOverviewStorage } from './local-storage.js';

function getContractInput() {
    let dateValue = document.getElementById('input-standard__date').value;
    const parts = dateValue.split('-');
    dateValue = parts.reverse().join('/');

    const newContract = {
        standard: document.getElementById('input-standard__name').value,
        date: dateValue,
        vat: +document.getElementById('input-standard__vat').value * 100,
        contractId: document.getElementById('input-standard__contractid').value,
        numAPR: document.getElementById('input-standard__apr').value
    };
    contractOverviewStorage().save(newContract);
}

(function () {
    const btn = document.getElementById('add-contract-overview');
    btn.addEventListener('click', () => {
        getContractInput();
        // const addedContract = contractOverviewStorage().load();
        // // addClient(addedClinet);

        // const parent = document.querySelector('#input__client .client-added');
        // parent.style.display = 'flex';
    });
})();
