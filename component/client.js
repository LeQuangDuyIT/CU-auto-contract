import { clientStorage } from "./local-storage.js";

function getClientInput() {
    const newClinet = {
        name: document.getElementById('input-client__name').value,
        nameEn: document.getElementById('input-client__en-name').value,
        city: document.getElementById('input-client__city').value,
        district: document.getElementById('input-client__district').value,
        ward: document.getElementById('input-client__ward').value,
        address: document.getElementById('input-client__address').value
    };
    clientStorage().save(newClinet);
}

(function () {
    const btn = document.getElementById('submit');
    btn.addEventListener('click', () => {
        getClientInput();
    });
})();