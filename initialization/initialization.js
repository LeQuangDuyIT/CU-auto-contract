import { sourceDocStorage } from "../component/local-storage.js";

function getDoc() {
    let parentElement = document.getElementById('contract-content');
    // const childrenElements = Array.from(parentElement.children).map(node => (node = node.outerHTML));

    let childrenElements = Array.from(parentElement.children);
    let newChildrenElements = [];

    childrenElements.forEach(element => {
        if (element.classList.contains('wrap-element')) {
            const childrenOfChildrenElements = Array.from(element.children);
            newChildrenElements.push(...childrenOfChildrenElements);
        } else {
            newChildrenElements.push(element);
        }
    });

    childrenElements = newChildrenElements.map(node => node.outerHTML);

    sourceDocStorage().save(childrenElements);
}

getDoc();
