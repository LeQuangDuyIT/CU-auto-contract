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
import { confirmService, renderServices } from '../component/service-and-fee.js';
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
        confirmContractOverview();
        confirmClient();
        confirmProductionUnit();
        confirmProcessingUnit();
        confirmService();

        renderProductionUnits();

        const processingUnits = processingUnitStorage().load();
        if (processingUnits.length > 0) {
            renderProcessingUnits();
        }

        renderServices();

        location.reload();
    });
})();
