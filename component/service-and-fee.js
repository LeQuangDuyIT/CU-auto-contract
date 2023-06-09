import { sourceDocStorage, serviceStorage } from './local-storage.js';

function serviceInput() {
    const serviceViInput = document.getElementById('input-service__name--vi');
    const serviceEnInput = document.getElementById('input-service__name--en');
    const feeInput = document.getElementById('input-service__fee');

    return {
        getValue() {
            return {
                serviceVi: serviceViInput.value,
                serviceEn: serviceEnInput.value,
                fee: feeInput.value
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

                <h3>${service.fee}</h3>
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
                    <th>Thành tiền</th>
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
                    <td>${service.fee}</td>
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

(function () {
    const addBtn = document.getElementById('add-service');
    addBtn.addEventListener('click', () => {
        const newService = serviceInput().getValue();
        if (!Object.values(newService).includes('')) {
            let serviceList = serviceStorage().load();
            serviceList.push(newService);
            serviceStorage().save(serviceList);

            addService();
            serviceInput().refreshValue();
        }
    });
})();
