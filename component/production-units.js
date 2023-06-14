import { checkInput } from '../index/index.js';
import { sourceDocStorage, productionUnitStorage, processingUnitStorage, clientStorage } from './local-storage.js';
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
        <div class="unit__wrap m-bot" index="${index}">
            <div class="unit">
                <h3 class="caps">${index + 1}. ${unit.name}</h3>
                <p>Địa chỉ: ${unit.addressVi}</p>
                <p class="italic">Address: ${unit.addressEn}</p>
            </div>
            <div class="unit__wrap--btn">
                <button class="edit-production-unit s-button"><i class="fa-sharp fa-solid fa-pen fa-xs"></i></button>
                <button class="remove-production-unit s-button"><i class="fa-sharp fa-solid fa-xmark"></i></button>
            </div>
        </div>`
    );
    units = units.reduce((string, item) => string + item, '');

    const parent = document.querySelector('#input__production-units .units-added');
    parent.innerHTML = units;

    makeRemoveUnitBtn();
    makeEditUnitBtn()
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

export function confirmProductionUnit() {
    if (checkInput('input__production-units')) {
        const newUnit = unitInput().getValue();
        let productionUnitList = productionUnitStorage().load();
        productionUnitList.push(newUnit);
        productionUnitStorage().save(productionUnitList);

        addProductionUnit();
        addProcessingUnit();
        unitInput().refreshValue();

        const parent = document.querySelector('#input__production-units .units-added');
        parent.style.display = 'block';

        return true;
    } else return false;
}

(function () {
    const addBtn = document.getElementById('add-production-unit');
    addBtn.addEventListener('click', () => {
        confirmProductionUnit();
    });
})();

(function () {
    const addedUnits = productionUnitStorage().load();
    if (Object.keys(addedUnits).length > 0) {
        addProductionUnit(addedUnits);
    } else {
        const parent = document.querySelector('#input__production-units .units-added');
        parent.style.display = 'none';
    }
})();

function makeEditUnitBtn() {
    const editBtns = Array.from(document.getElementsByClassName('edit-production-unit'));
    editBtns.forEach(editBtn => {
        editBtn.addEventListener('click', () => {
            const thisIndex = +editBtn.closest('.unit__wrap').getAttribute('index');
            const indexInputElement = document.getElementById('input-production__index-edit');
            indexInputElement.parentNode.classList.remove('hide');
            indexInputElement.value = thisIndex + 1;

            let productionUnitList = productionUnitStorage().load();
            const inputElements = {
                name: document.getElementById('input-production__name'),
                addressVi: document.getElementById('input-production__address--vi'),
                addressEn: document.getElementById('input-production__address--en')
            }
            inputElements.name.value = productionUnitList[thisIndex].name;
            inputElements.addressVi.value = productionUnitList[thisIndex].addressVi;
            inputElements.addressEn.value = productionUnitList[thisIndex].addressEn;

            const confirmBtn = document.getElementById('add-production-unit');
            confirmBtn.removeEventListener('click', confirmProductionUnit);
            confirmBtn.addEventListener('click', () => {
                console.log(inputElements);
                const newUnit = {
                    name: inputElements.name.value,
                    addressVi: inputElements.addressVi.value,
                    addressEn: inputElements.addressEn.value
                };
                console.log(newUnit);
                productionUnitList.splice(thisIndex, 1, newUnit)
                productionUnitStorage().save(productionUnitList);

                addProductionUnit();
                indexInputElement.parentNode.classList.add('hide');
            })
        })
    })
}
