import api from './api.js'

/**
 * 
 */
async function displayCanapes() {
    const canapes = await api.getCanapes();
    const template = document.querySelector("#template");
    const items = document.querySelector("#items");
    canapes.forEach(canape => {
        let clone = document.importNode(template.content, true);
        clone.querySelector("img").src = canape.imageUrl;
        clone.querySelector("img").alt = canape.altTxt;
        clone.querySelector("a").href = "./product.html?id=" + canape._id;
        clone.querySelector(".productName").innerHTML = canape.name;
        clone.querySelector(".productDescription").innerHTML = canape.description;
        items.appendChild(clone);
    });
}

displayCanapes();