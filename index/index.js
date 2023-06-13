import {
    clientStorage,
    productionUnitStorage,
    processingUnitStorage,
    serviceStorage,
    contractOverviewStorage,
    totalServiceFeeStorage
} from '../component/local-storage.js';
import { renderDocument, renderClient } from '../main.js';
import { renderProductionUnits } from '../component/production-units.js';
import { renderProcessingUnits } from '../component/processing-units.js';
import { renderServices } from '../component/service-and-fee.js';

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
        renderProductionUnits();

        const processingUnits = processingUnitStorage().load();
        if (processingUnits.length > 0) {
            renderProcessingUnits();
        }

        renderServices();

        location.reload();
    });
})();
