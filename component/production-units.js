import { sourceDocStorage, productionUnitStorage, processingUnitStorage } from './local-storage.js';
import { addProcessingUnit, renderProcessingUnits } from './processing-units.js';

function unitInput() {
    const nameInput = document.getElementById('input-production__name');
    const addressViInput = document.getElementById('input-production__address--vi');
    const addressEnInput = document.getElementById('input-production__address--en');

    return {
        getValue() {
            return {
                name: nameInput.value,
                addressVi: addressViInput.value,
                addressEn: addressEnInput.value
            };
        },
        refreshValue() {
            nameInput.value = '';
            addressViInput.value = '';
            addressEnInput.value = '';
        }
    };
}

function makeRemoveUnitBtn() {
    const btns = Array.from(document.getElementsByClassName('remove-production-unit'));
    // const parent = document.querySelector('#input__production-units .units-added');
    btns.forEach(btn =>
        btn.addEventListener('click', event => {
            const thisUnit = event.target.closest('.unit__wrap');
            const index = thisUnit.getAttribute('index');

            let productionUnitList = productionUnitStorage().load();
            productionUnitList.splice(index, 1);
            productionUnitStorage().save(productionUnitList);

            // parent.removeChild(thisUnit);
            // renderProductionUnits();
            addProductionUnit();
            addProcessingUnit();

            // const processingUnits = processingUnitStorage().load();
            // if (processingUnits.length > 0) {
            //     renderProcessingUnits();
            // }
            // location.reload();
        })
    );
}

function addProductionUnit() {
    let units = productionUnitStorage().load();
    units = units.map(
        (unit, index) => `
        <div class="unit__wrap" index="${index}">
            <div class="unit">
                <h3 class="caps">${index + 1}. ${unit.name}</h3>
                <p>Địa chỉ: ${unit.addressVi}</p>
                <p class="italic">Address: ${unit.addressEn}</p>
            </div>
            <div class="unit__wrap--btn">
                <button class="remove-production-unit"><i class="fa-sharp fa-solid fa-xmark"></i></button>
            </div>
        </div>`
    );
    units = units.reduce((string, item) => string + item, '');

    const parent = document.querySelector('#input__production-units .units-added');
    parent.innerHTML = units;

    makeRemoveUnitBtn();
}
addProductionUnit();

export function renderProductionUnits() {
    let newProductionUnitList = productionUnitStorage().load();
    if (newProductionUnitList.length > 0) {
        newProductionUnitList = newProductionUnitList.map(
            (unit, index) =>
                `<div class="m-bot" production-unit="true">
                    <h3>${index + 1}. ${unit.name}</h3>
                    <p>Địa chỉ: ${unit.addressVi}</p>
                    <p class="italic">
                        Address: ${unit.addressEn}
                    </p>
                </div>`
        );

        let docData = sourceDocStorage().load();
        const index = docData.findIndex(string => string.includes('production-unit="true"'));
        docData = docData.filter(string => !string.includes('production-unit="true"'));
        docData.splice(index, 0, ...newProductionUnitList);
        sourceDocStorage().save(docData);
    }
}

(function () {
    const addBtn = document.getElementById('add-production-unit');
    addBtn.addEventListener('click', () => {
        const newUnit = unitInput().getValue();
        if (!Object.values(newUnit).includes('')) {
            let productionUnitList = productionUnitStorage().load();
            productionUnitList.push(newUnit);
            productionUnitStorage().save(productionUnitList);

            // renderProductionUnits();

            // const processingUnits = processingUnitStorage().load();
            // if (processingUnits.length > 0) {
            //     renderProcessingUnits();
            // }

            addProductionUnit();
            addProcessingUnit();
            unitInput().refreshValue();

            // renderDocument();
            // location.reload();
        }
    });
})();
