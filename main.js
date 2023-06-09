import { sourceDocStorage, clientStorage } from './component/local-storage.js';

function getClientElements() {
    return {
        name: Array.from(document.getElementsByClassName('client__name')),
        nameEn: Array.from(document.getElementsByClassName('client__en-name')),
        city: Array.from(document.getElementsByClassName('client__city')),
        district: Array.from(document.getElementsByClassName('client__district')),
        ward: Array.from(document.getElementsByClassName('client__ward')),
        address: Array.from(document.getElementsByClassName('client__address'))
    };
}

export function renderClient() {
    const clientInfo = clientStorage().load();
    if (Object.keys(clientInfo).length > 0) {
        const clientElement = getClientElements();

        const keys = Object.keys(clientElement);
        keys.forEach(key => clientElement[key].forEach(element => (element.innerHTML = clientInfo[key])));
    }
}

export function renderDocument() {
    const parentElement = document.getElementById('contract');

    const getCurrentPage = () => {
        const pages = Array.from(document.querySelectorAll('.page .page__core'));
        return pages[pages.length - 1];
    };

    const breackPage = element => element === '<a action="breack-page"></a>';

    const docData = sourceDocStorage().load();

    const isOverflowed = page => page.scrollHeight > page.offsetHeight;

    let currentPage = getCurrentPage();

    docData.forEach(element => {
        currentPage.innerHTML += element;

        if (isOverflowed(currentPage) || breackPage(element)) {
            currentPage.removeChild(currentPage.lastChild);

            const newPage = `
                <div class="page">
                    <div class="page__core" contenteditable="true">
                        <p>
                            <img class="logo" src="/assets/logoControlUnion.jpg" alt="logoControlUnion" />
                        </p>
                    </div>
                </div>
            `;
            parentElement.innerHTML += newPage;

            currentPage = getCurrentPage();
            currentPage.innerHTML += element;
        }
    });
    // const client = clientStorage().load();
    // if (!Object.values(client).includes('') && client) {
    //     renderClient();
    // }
}
renderDocument();
renderClient();
