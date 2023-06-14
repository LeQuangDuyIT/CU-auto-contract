import { checkInput } from '../index/index.js';
import { sourceDocStorage, contractOverviewStorage, serviceStorage, totalServiceFeeStorage } from './local-storage.js';
import { numberToWordsEn } from './number-to-words-en.js';
import { numAndWordData, toWordVi } from './number-to-words-vi.js';

// Cài đặt ô input phí
(function () {
    const feeInput = document.getElementById('input-service__fee');
    feeInput.addEventListener('input', () => {
        // Loại bỏ các dấu phân tách hiện có
        let feeValue = +feeInput.value.replace(/[,.]/g, '');

        if (feeValue !== 0) {
            // Định dạng lại giá trị với dấu phân tách hàng nghìn
            feeValue = new Intl.NumberFormat().format(feeValue);

            // Cập nhật giá trị trong ô input
            feeInput.value = feeValue;
        }
    });
})();

function serviceInput() {
    const serviceViInput = document.getElementById('input-service__name--vi');
    const serviceEnInput = document.getElementById('input-service__name--en');
    const feeInput = document.getElementById('input-service__fee');

    return {
        getValue() {
            return {
                serviceVi: serviceViInput.value,
                serviceEn: serviceEnInput.value,
                fee: +feeInput.value.replace(/[,.]/g, '')
            };
        },
        refreshValue() {
            serviceViInput.value = '';
            serviceEnInput.value = '';
            feeInput.value = '';
        }
    };
}

function makeRemoveServiceBtn() {
    const btns = Array.from(document.getElementsByClassName('remove-service'));
    btns.forEach(btn =>
        btn.addEventListener('click', event => {
            const thisService = event.target.closest('.service__wrap');
            const index = thisService.getAttribute('index');

            let serviceList = serviceStorage().load();
            serviceList.splice(index, 1);
            serviceStorage().save(serviceList);

            addService();

            getTotalFee();
            renderTotalFee();
        })
    );
}

function addService() {
    let services = serviceStorage().load();

    services = services.map(
        (service, index) => `
        <div class="service__wrap" index="${index}">
            <div class="unit">
                <h3>${index + 1}. ${service.serviceVi}</h3>
                <h3>${service.serviceEn}</h3>

                <h3>${service.fee.toLocaleString('en-US')}</h3>
            </div>
            <div class="service__wrap--btn">
                <button class="remove-service"><i class="fa-sharp fa-solid fa-xmark"></i></button>
            </div>
        </div>`
    );
    services = services.reduce((string, item) => string + item, '');

    const parent = document.querySelector('#input__service .services-added');
    parent.innerHTML = services;

    makeRemoveServiceBtn();
}
addService();

function getNewServiceTable(newServiceList) {
    const elements = `<table id="service-table__top" class="services-and-fee" services-and-fee="true">
            <thead>
                <tr>
                    <th>TT</th>
                    <th>Hạng mục</th>
                    <th>Thành tiền (VNĐ)</th>
                </tr>
                <tr>
                    <th>No.</th>
                    <th>Article</th>
                    <th>Amount (VND)</th>
                </tr>
            </thead>
            <tbody>
                ${newServiceList}
            </tbody>
        </table>`;
    return elements;
}

export function renderServices() {
    let newServiceList = serviceStorage().load();
    if (newServiceList.length > 0) {
        newServiceList = newServiceList.map(
            (service, index) =>
                `<tr>
                    <td class="center">${index + 1}</td>
                    <td>
                        <p>${service.serviceVi}</p>
                        <p class="italic">${service.serviceEn}</p>
                    </td>
                    <td>${service.fee.toLocaleString('en-US')}</td>
                </tr>`
        );
        newServiceList = newServiceList.reduce((string, item) => string + item, '');

        const newServiceTable = getNewServiceTable(newServiceList);

        let docData = sourceDocStorage().load();
        const index = docData.findIndex(string => string.includes('services-and-fee="true"'));

        docData.splice(index, 1, newServiceTable);
        sourceDocStorage().save(docData);
    }
}

export function getTotalFee() {
    const serviceList = serviceStorage().load();
    const totalFee = serviceList.reduce((total, service) => total + service.fee, 0);
    const vAT = () => {
        const contractOverview = contractOverviewStorage().load();
        if (contractOverview.vat !== undefined) {
            return +contractOverview.vat / 100;
        } else return 0.1;
    };
    console.log(vAT());
    const amount = totalFee + totalFee * vAT();

    const totalServiceFeeObj = {
        totalFee: totalFee,
        vAT: totalFee * vAT(),
        amount: amount,
        amountWordVi: toWordVi(amount),
        amountWordEn: numberToWordsEn(amount)
    };

    totalServiceFeeStorage().save(totalServiceFeeObj);
}

export function renderTotalFee() {
    const totalServiceFee = totalServiceFeeStorage().load();
    if (Object.keys(totalServiceFee).length > 0) {
        // const { totalFee, amount } = totalServiceFee;
        const totalFeeNumber = document.getElementById('input-total-fee--number');
        const totalFeeNumberVAT = document.getElementById('input-total-fee--number-vat');
        const totalFeeWordVn = document.getElementById('input-total-fee--words-vi');
        const totalFeeWordEn = document.getElementById('input-total-fee--words-en');

        totalFeeNumber.value = totalServiceFee.totalFee.toLocaleString('en-US');
        totalFeeNumberVAT.value = totalServiceFee.amount.toLocaleString('en-US');
        totalFeeWordVn.value = totalServiceFee.amountWordVi;
        totalFeeWordEn.value = totalServiceFee.amountWordEn;
    }
}
renderTotalFee();

export function editAndSaveTotalServiceFee() {
    if (checkInput('input__total-fee')) {
        let totalServiceFee = totalServiceFeeStorage().load();

        const totalFeeWordVn = document.getElementById('input-total-fee--words-vi').value;
        const totalFeeWordEn = document.getElementById('input-total-fee--words-en').value;

        totalServiceFee = { ...totalServiceFee, amountWordVi: totalFeeWordVn, amountWordEn: totalFeeWordEn };

        totalServiceFeeStorage().save(totalServiceFee);

        const parent = document.querySelector('#input__total-fee .total-fee-confirmed');
        parent.style.display = 'block';

        confirmTotalFee(totalServiceFeeStorage().load());

        return true;
    } else return false;
}

export function confirmService() {
    function checkFee() {
        const feeInput = document.getElementById('input-service__fee');
        if (+feeInput.value.replace(/[,.]/g, '') % 10 !== 0) {
            feeInput.classList.add('required');
            return false;
        } else return true;
    }
    if (checkInput('input__service') && checkFee()) {
        const newService = serviceInput().getValue();
        let serviceList = serviceStorage().load();
        serviceList.push(newService);
        serviceStorage().save(serviceList);

        addService();
        serviceInput().refreshValue();

        getTotalFee();
        renderTotalFee();

        const parent = document.querySelector('#input__service .services-added');
        parent.style.display = 'block';
        return true;
    } else return false;
}

(function () {
    const addBtn = document.getElementById('add-service');
    addBtn.addEventListener('click', () => {
        confirmService();
    });
})();

(function () {
    const btn = document.getElementById('add-total-fee');
    btn.addEventListener('click', () => {
        editAndSaveTotalServiceFee();
    });
})();

(function () {
    const addedServices = serviceStorage().load();
    if (Object.keys(addedServices).length > 0) {
        addService(addedServices);
    } else {
        const parent = document.querySelector('#input__service .services-added');
        parent.style.display = 'none';
    }

    const confirmedTotalFee = totalServiceFeeStorage().load();
    if (Object.keys(confirmedTotalFee).length > 0) {
        confirmTotalFee(confirmedTotalFee);
    } else {
        const parent = document.querySelector('#input__total-fee .total-fee-confirmed');
        parent.style.display = 'none';
    }
})();

function confirmTotalFee(confirmedTotalFee) {
    const elements = `<div class="form">
            <table>
                <tbody>
                    <tr>
                        <td>Tổng phí</td>
                        <td>:</td>
                        <td>${confirmedTotalFee.totalFee.toLocaleString('en-US')}</td>
                    </tr>
                    <tr>
                        <td>Tổng phí (VAT)</td>
                        <td>:</td>
                        <td>${confirmedTotalFee.amount.toLocaleString('en-US')}</td>
                    </tr>
                    <tr>
                        <td>Bằng chữ</td>
                        <td>:</td>
                        <td>${confirmedTotalFee.amountWordVi}</td>
                    </tr>
                    <tr>
                        <td>By word</td>
                        <td>:</td>
                        <td>${confirmedTotalFee.amountWordEn}</td>
                    </tr>
                </tbody>
            </table>
        </div>`;
    const parent = document.querySelector('#input__total-fee .total-fee-confirmed');
    parent.innerHTML = elements;
}

(function () {
    const reloadBtn = document.getElementById('reload-total-fee');
    reloadBtn.addEventListener('click', () => {
        const totalFee = totalServiceFeeStorage().load();
        if (Object.values(totalFee).length > 0) {
            getTotalFee();
            renderTotalFee();
        }
    });
})();
