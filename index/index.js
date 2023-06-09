import { clientStorage, productionUnitStorage, processingUnitStorage } from '../component/local-storage.js';
import { renderDocument, renderClient } from '../main.js';
import { renderProductionUnits } from '../component/production-units.js';
import { renderProcessingUnits } from '../component/processing-units.js';

(function () {
    const initializationBtn = document.getElementById('initialization-btn');
    initializationBtn.addEventListener('click', () => {
        window.open('/initialization/source-doc.html', '_blank');
        clientStorage().save({});
        productionUnitStorage().save([]);
        processingUnitStorage().save([]);
        location.reload();
    });
})();

(function () {
    const makeDocBtn = document.getElementById('make-doc');
    makeDocBtn.addEventListener('click', () => {
        renderProductionUnits();

        const processingUnits = processingUnitStorage().load();
        if (processingUnits.length > 0) {
            renderProcessingUnits();
        }

        location.reload();
    });
})();
