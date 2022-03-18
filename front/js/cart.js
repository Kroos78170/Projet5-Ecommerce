import api from './api.js';
import tools from './tools.js';

let cart = tools.getItem();

if (Object.keys(cart).length == 0) {
    document.querySelector("#cartAndFormContainer").innerHTML =
        "<h1>Votre panier est vide.</h1>";
} else {
    let cartObj = cart;
    console.log(cartObj);

    const cartTemplate = document.querySelector("#cartTemplate");
    const items = document.querySelector("#cart__items");

    for (const canapeId in cartObj) {
        for (const color in cartObj[canapeId]) {
            const canapeQuantity = cartObj[canapeId][color][0];


            //on récupère les informations concernant le canape

            api.getCanapes(canapeId).then((canape) => {
                // ajout du canape avec ses données
                const clone = document.importNode(cartTemplate.content, true);

                clone.querySelector(".cart__item").setAttribute("data-id", canape._id);
                clone.querySelector(".cart__item").setAttribute("data-color", color);
                clone.querySelector(".cart__item__img img").alt = canape.altTxt;
                clone.querySelector(".cart__item__img img").src = canape.imageUrl;
                clone.querySelector(".cart__item__content__titlePrice h2").textContent =
                    canape.name + " " + color;
                clone.querySelector(".cart__item__content__titlePrice p").textContent =
                    tools.formatPrice(canape.price * canapeQuantity);
                clone.querySelector(
                    ".cart__item__content__settings__quantity input"
                ).value = canapeQuantity;
                //ajout d'un listener qui va ecouter le changement du nombre de produit et calculer le nouveau prix en consequence
                clone
                    .querySelector(`input.itemQuantity`)
                    .addEventListener("change", (e) => {
                        const newCanapeQuantity = e.currentTarget.value;

                        e.currentTarget.parentElement.parentElement.parentElement.querySelector(
                            ".cart__item__content__titlePrice p"
                        ).textContent = tools.formatPrice(canape.price * newCanapeQuantity);
                        // /modification de la quantité dans le panier

                        const canapeElement = e.currentTarget.parentElement.parentElement.parentElement
                            .parentElement

                        cart = tools.modifyQuantity(cartObj, canapeElement.dataset.id, canapeElement.dataset.color, newCanapeQuantity);
                        tools.afficherPrixTotalEtNbCanape(cart);
                    });
                //ajout d'un listener sur le bouton de suppression du canape du panier
                clone.querySelector(".deleteItem").addEventListener("click", (e) => {
                    const articleToDelete =
                        e.currentTarget.parentElement.parentElement.parentElement
                        .parentElement;
                    const idToDelete = articleToDelete.dataset.id;
                    const colorToDelete = articleToDelete.dataset.color;

                    //suppression du produit du panier//
                    cart = tools.deleteCanape(cartObj, idToDelete, colorToDelete);

                    //suppression physique du produit dans le dom//
                    items.removeChild(articleToDelete);
                    tools.afficherPrixTotalEtNbCanape(cart);
                });

                items.appendChild(clone);
            });
        }
    }

    tools.afficherPrixTotalEtNbCanape(cart);

    //suppression des éléments dans le localstorage

    //----------------------------------------------------------------------------------
    //formulaire

    //sélection du bouton commander

    const btnCommand = document.querySelector("#order");
    //addEventlistener

    btnCommand.addEventListener("click", (e) => {
        e.preventDefault();

        //recupération des valeurs du formulaire

        const contact = {
            firstName: document.querySelector("#firstName").value,
            lastName: document.querySelector("#lastName").value,
            address: document.querySelector("#address").value,
            city: document.querySelector("#city").value,
            email: document.querySelector("#email").value,
        };
        //--------------gestion validation du formulaire---------------
        //regex commun a firstname lastname et city
        const communRegEx = (value) => {
            return /^[A-Za-z ,-]{2,50}$/.test(value);
        };

        //regex addresse

        const regExAddress = (value) => {
            return /^([a-zA-Z0-9 ,-]+)$/.test(value);
        };

        //regex email

        const regExEmail = (value) => {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        };

        //controle de la validité du formulaire
        function firstNameControl() {
            const validFirstname = contact.firstName;
            if (communRegEx(validFirstname)) {
                document.querySelector("#firstNameErrorMsg").innerHTML = "";
                return true;
            } else {
                document.querySelector("#firstNameErrorMsg").innerHTML =
                    "Votre prénom n'est pas au bon format";
                return false;
            }
        }

        function lastNameControl() {
            const validLastname = contact.lastName;
            if (communRegEx(validLastname)) {
                document.querySelector("#lastNameErrorMsg").innerHTML = "";
                return true;
            } else {
                document.querySelector("#lastNameErrorMsg").innerHTML =
                    "Votre nom n'est pas au bon format";
                return false;
            }
        }

        function addressControl() {
            const validAddress = contact.address;
            if (regExAddress(validAddress)) {
                document.querySelector("#addressErrorMsg").innerHTML = "";
                return true;
            } else {
                document.querySelector("#addressErrorMsg").innerHTML =
                    "Votre adresse n'est pas au bon format";
                return false;
            }
        }

        function cityControl() {
            const validCity = contact.city;
            if (communRegEx(validCity)) {
                document.querySelector("#cityErrorMsg").innerHTML = "";
                return true;
            } else {
                document.querySelector("#cityErrorMsg").innerHTML =
                    "Votre ville n'est pas au bon format";
                return false;
            }
        }

        function eMailControl() {
            const validEmail = contact.email;
            if (regExEmail(validEmail)) {
                document.querySelector("#emailErrorMsg").innerHTML = "";
                return true;
            } else {
                document.querySelector("#emailErrorMsg").innerHTML =
                    "Votre email n'est pas au bon format";
                return false;
            }
        }
        //--------------------fin  de la gestion de validation du formulaire
        //controle validité formulaire avant de confirmer la commande
        if (
            firstNameControl() &&
            lastNameControl() &&
            addressControl() &&
            cityControl() &&
            eMailControl()
        ) {
            const products = tools.getIdsCanapeInCart();
            const body = {
                contact,
                products,
            };

            //mettre l'objet "contact" dans le localstorage
            fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(body),
                })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then((data) => {

                    // on efface le panier à la clé "cart"
                    tools.clearStorage();
                    //on redirige vers la apge de confirmation
                    document.location.href = `./confirmation.html?orderId=${data.orderId}`;
                });
        } //il y a erreur dans le formulaire
        else {
            return false;
        }
    });
}