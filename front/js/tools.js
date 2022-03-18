const cartName = "panier"

export default {
    getItem() {
        return JSON.parse(localStorage.getItem(cartName)) || []
    },

    setItem(obj) {
        if (Object.keys(obj).length == 0) {
            this.clearStorage();
        } else {
            localStorage.setItem(cartName, JSON.stringify(obj));
        }
    },

    clearStorage() {
        localStorage.removeItem(cartName);
    },

    formatPrice(price, currency = true) {
        const currencyValue = currency ? " €" : "";
        return Number.parseFloat(price).toFixed(2) + currencyValue;
    },

    afficherPrixTotalEtNbCanape(cart) {
        if (cart) {
            let cartObj = cart;
            //recalcule le prix total

            let prixtotalCalcul = [];
            let NbCanapeTotal = [];
            //aller chercher les prix dans le panier

            for (const id in cartObj) {
                for (const color in cartObj[id]) {
                    const prixCanapeDansLePanier = cartObj[id][color][1];
                    const nbCanape = cartObj[id][color][0];
                    const totalPriceCanape = prixCanapeDansLePanier * nbCanape;
                    //mettre les prix du panier dans la variable "prixTotalCalcul"
                    prixtotalCalcul.push(totalPriceCanape);
                    NbCanapeTotal.push(nbCanape);
                }

            }

            /**
             * additionne les prix du tableau de la variable "prixTotalcalcul" avec la méthode .reduce
             * @param {number} accumulator
             * @param {number} currentValue
             * @returns number
             */
            const reducer = (accumulator, currentValue) => accumulator + currentValue;
            const prixTotal = this.formatPrice(
                prixtotalCalcul.reduce(reducer, 0),
                false
            );

            //additionne les nombres de canapes total

            const nbTotalCanape = NbCanapeTotal.reduce(reducer, 0);

            // on affiche les valaurs obtenues
            document.querySelector("#totalPrice").innerHTML = prixTotal;
            document.querySelector("#totalQuantity").innerHTML = nbTotalCanape;
        }
    },

    /**
     * fonction qui supprime les canapés du panier
     * @param {Object} cartObj
     * @param {number} idToDelete
     * @returns string
     */
    deleteCanape(cartObj, idToDelete, colorToDelete) {
        delete cartObj[idToDelete][colorToDelete];

        //set item
        this.setItem(cartObj);

        return JSON.stringify(cartObj);
    },

    /**
     * fonction qui retourne la clé Id de chaque canapé présent dans le panier
     * @returns Object
     */
    getIdsCanapeInCart() {
        const cart = JSON.parse(this.getItem());

        return Object.keys(cart);
    },

    modifyQuantity(cartObj, idCanape, color, newQuantity) {

        cartObj[idCanape][color][0] = parseInt(newQuantity);

        //set item
        this.setItem(cartObj);

        return JSON.stringify(cartObj);
    },
}