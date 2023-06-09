export function sourceDocStorage() {
    return {
        load() {
            const stringData = localStorage.getItem('sourceDoc');
            return stringData ? JSON.parse(stringData) : [];
        },
        save(arr) {
            localStorage.setItem('sourceDoc', JSON.stringify(arr));
        }
    };
}

export function clientStorage() {
    return {
        load() {
            const stringData = localStorage.getItem('client');
            return stringData ? JSON.parse(stringData) : {};
        },
        save(obj) {
            localStorage.setItem('client', JSON.stringify(obj));
        }
    };
}

export function productionUnitStorage() {
    return {
        load() {
            const stringData = localStorage.getItem('productionUnit');
            return stringData ? JSON.parse(stringData) : [];
        },
        save(arr) {
            localStorage.setItem('productionUnit', JSON.stringify(arr));
        }
    };
}

export function processingUnitStorage() {
    return {
        load() {
            const stringData = localStorage.getItem('processingUnit');
            return stringData ? JSON.parse(stringData) : [];
        },
        save(arr) {
            localStorage.setItem('processingUnit', JSON.stringify(arr));
        }
    };
}