const apiUrl = "http://localhost:3000/api/products/"

export default {
    /**
     * fonction qui retourne tous les canapes
     * @returns array
     */
    getCanapes() {
        return fetch(apiUrl).then((res) => res.json())
    },

    /**
     * fonction qui retourne un canape
     * @param {string} id identifiant d'un canape
     * @returns object
     */
    getCanape(id) {
        return fetch(apiUrl + id).then((res) => res.json())
    },
}