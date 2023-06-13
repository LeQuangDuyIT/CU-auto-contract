import { renderDocument } from '/main.js';
import { sourceDocStorage, productionUnitStorage, processingUnitStorage } from './local-storage.js';

function unitInput() {
    const nameInput = document.getElementById('input-processing__name');
    const addressViInput = document.getElementById('input-processing__address--vi');
    const addressEnInput = document.getElementById('input-processing__address--en');

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

function getStartIndex() {
    const productionUnits = productionUnitStorage().load();
    return productionUnits.length + 1;
}

function makeRemoveUnitBtn() {
    const btns = Array.from(document.getElementsByClassName('remove-processing-unit'));
    // const parent = document.querySelector('#input__processing-units .units-added');
    btns.forEach(btn =>
        btn.addEventListener('click', event => {
            const thisUnit = event.target.closest('.unit__wrap');
            const index = thisUnit.getAttribute('index');

            let processingUnitList = processingUnitStorage().load();
            processingUnitList.splice(index, 1);
            processingUnitStorage().save(processingUnitList);

            addProcessingUnit();
            // renderProcessingUnits();
            // location.reload();
        })
    );
}

export function addProcessingUnit() {
    const startIndex = getStartIndex();

    let units = processingUnitStorage().load();
    units = units.map(
        (unit, index) => `
        <div class="unit__wrap m-bot" index="${index}">
            <div class="unit">
                <h3>${startIndex + index}. ${unit.name}</h3>
                <p>Địa chỉ: ${unit.addressVi}</p>
                <p class="italic">Address: ${unit.addressEn}</p>
            </div>
            <div class="unit__wrap--btn">
                <button class="remove-processing-unit"><i class="fa-sharp fa-solid fa-xmark"></i></button>
            </div>
        </div>`
    );
    units = units.reduce((string, item) => string + item, '');

    const parent = document.querySelector('#input__processing-units .units-added');
    parent.innerHTML = units;

    makeRemoveUnitBtn();
}
addProcessingUnit();

export function renderProcessingUnits() {
    let newProcessingUnitList = processingUnitStorage().load();
    if (newProcessingUnitList.length > 0) {
        const startIndex = getStartIndex();

        newProcessingUnitList = newProcessingUnitList.map(
            (unit, index) =>
                `<div class="m-bot" processing-unit="true">
                    <h3 class="caps">${startIndex + index}. ${unit.name}</h3>
                    <p>Địa chỉ: ${unit.addressVi}</p>
                    <p class="italic">
                        Address: ${unit.addressEn}
                    </p>
                </div>`
        );

        let docData = sourceDocStorage().load();
        const index = docData.findIndex(string => string.includes('processing-unit="true"'));
        docData = docData.filter(string => !string.includes('processing-unit="true"'));
        docData.splice(index, 0, ...newProcessingUnitList);
        sourceDocStorage().save(docData);
    }
}

(function () {
    const addBtn = document.getElementById('add-processing-unit');
    addBtn.addEventListener('click', () => {
        const newUnit = unitInput().getValue();
        if (!Object.values(newUnit).includes('')) {
            let processingUnitList = processingUnitStorage().load();
            processingUnitList.push(newUnit);
            processingUnitStorage().save(processingUnitList);

            // renderProcessingUnits();

            addProcessingUnit();
            unitInput().refreshValue();

            const parent = document.querySelector('#input__processing-units .units-added');
            parent.style.display = 'block';

            // renderDocument();
            // location.reload();
        }
    });
})();

(function () {
    const addedUnits = processingUnitStorage().load();
    if (Object.keys(addedUnits).length > 0) {
        addProcessingUnit(addedUnits);
    } else {
        const parent = document.querySelector('#input__processing-units .units-added');
        parent.style.display = 'none';
    }
})()
