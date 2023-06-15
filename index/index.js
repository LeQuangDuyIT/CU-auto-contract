import {
    clientStorage,
    productionUnitStorage,
    processingUnitStorage,
    serviceStorage,
    contractOverviewStorage,
    totalServiceFeeStorage
} from '../component/local-storage.js';
import { renderDocument, renderClient } from '../main.js';
import { confirmProductionUnit, renderProductionUnits } from '../component/production-units.js';
import { confirmProcessingUnit, renderProcessingUnits } from '../component/processing-units.js';
import {
    confirmService,
    editAndSaveTotalServiceFee,
    getTotalFee,
    renderServices,
    renderTotalFee
} from '../component/service-and-fee.js';
import { confirmContractOverview } from '../component/contract-overview.js';
import { confirmClient } from '../component/client.js';

(function () {
    const initializationBtn = document.getElementById('initialization-btn');
    initializationBtn.addEventListener('click', () => {
        window.open('/initialization/source-doc.html', '_blank');
        contractOverviewStorage().save({});
        clientStorage().save({});
        productionUnitStorage().save([]);
        processingUnitStorage().save([]);
        serviceStorage().save([]);
        totalServiceFeeStorage().save({});
        location.reload();
    });
})();

(function () {
    const makeDocBtn = document.getElementById('make-doc');
    makeDocBtn.addEventListener('click', () => {
        function checkDatas(storageFunction, confirmFunction) {
            const datas = storageFunction.load();
            if (Object.keys(datas).length === 0 || datas.length === 0) {
                confirmFunction;
                return false;
            }
            return true;
        }

        const callFunctionList = [
            () => checkDatas(contractOverviewStorage(), confirmContractOverview()),
            () => checkDatas(clientStorage(), confirmClient()),
            () => checkDatas(productionUnitStorage(), confirmProductionUnit()),
            () => checkDatas(processingUnitStorage(), confirmProcessingUnit()),
            () => checkDatas(serviceStorage(), confirmService()),
            () => checkDatas(totalServiceFeeStorage(), editAndSaveTotalServiceFee())
        ];

        function checkCallFunctionList() {
            callFunctionList.forEach(func => {
                console.log(func());
                if (!func()) {
                    return false;
                }
            });
            return true;
        }
        console.log(checkCallFunctionList());

        if (checkCallFunctionList()) {
            renderProductionUnits();

            const processingUnits = processingUnitStorage().load();
            if (processingUnits.length > 0) {
                renderProcessingUnits();
            }

            renderServices();

            location.reload();
        }
    });
})();

(function () {
    const inputVAT = document.getElementById('input-standard__vat');
    inputVAT.addEventListener('change', () => {
        let overview = contractOverviewStorage().load();
        overview = { ...overview, vat: +document.getElementById('input-standard__vat').value * 100 };
        contractOverviewStorage().save(overview);

        getTotalFee();
        renderTotalFee();
    });
})();

export function checkInput(parentId) {
    const parent = document.getElementById(`${parentId}`);
    const requiredElements = [
        ...parent.querySelectorAll('input[required]'),
        ...parent.querySelectorAll('textarea[required]')
    ];
    let isValid = true;
    requiredElements.forEach(element => {
        element.addEventListener('input', () => {
            element.classList.remove('required');
        });
        if (!element.value) {
            element.classList.add('required');
            isValid = false;
        }
    });
    return isValid;
}
