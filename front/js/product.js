import api from './api.js';
import tools from './tools.js';

async function displayCanape() {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    const canape = await api.getCanape(id);
    const canapeTitle = document.querySelector("title");
    const canapeName = document.querySelector("#title")
    const canapePrice = document.querySelector("#price");
    const canapeImg = document.querySelector(".item__img img");
    const canapeDescription = document.querySelector("#description");
    const canapeQuantity = document.querySelector("#quantity");
    const canapeColor = document.querySelector("#colors");

    for (let color of canape.colors) {

        const option = document.createElement("option");
        const newContent = document.createTextNode(color);
        option.value = color;
        option.appendChild(newContent);
        canapeColor.appendChild(option);
    }

    canapeTitle.innerHTML = canape.name;
    canapeName.innerHTML = canape.name;
    canapePrice.innerHTML = canape.price;
    canapeImg.src = canape.imageUrl;
    canapeImg.alt = canape.altTxt;
    canapeDescription.innerHTML = canape.description;

    const button = document.querySelector("#addToCart");

    button.addEventListener("click", (e) => {

        const panier = tools.getItem() // la création du panier || ( localStorage.getItem('panier') permet de récuperer la valeur lié à la clé

        const infoCanape = {
            id: id,
            color: canapeColor.value,
            quantity: canapeQuantity.value,
        };
        let newCanape = true; // si c'est un nouveau canapé, ajout du canapé dans le panier avec la condition ligne 63
        if (infoCanape.color == "") { //condition de de la couleur si elle n'es pas choisit = on quitte la fonction panier
            alert('Veuillez selectionner une couleur')
            return;
        }
        if (infoCanape.quantity < 1) { // condition de de la quantité si inférieur à 1 = on quitte la fonction panier
            alert('Quantité incorrecte')
            return;
        }

        for (let canape of panier) {
            //
            if (canape.color == infoCanape.color && canape.id == infoCanape.id) { // si les couleurs et l'id sont les mêmes
                //
                newCanape = false;
                let addition = Number(infoCanape.quantity) + Number(canape.quantity); //addition d'une nouvelle quantité
                canape.quantity = addition; //
            }
        }
        if (newCanape) { // si c'est un nouveau canapé, alors ajout dans le panier
            panier.push(infoCanape);
        }
        localStorage.setItem("panier", JSON.stringify(panier)); //création de la clé dans le locale storage dans laquelle la valeur "panier" est attribubé pour la valeur

    });
}

displayCanape()