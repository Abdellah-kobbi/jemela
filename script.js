document.addEventListener("DOMContentLoaded", afficherProduits);
document.querySelector("#formProduit").addEventListener("submit", enregistrerProduit);
document.querySelector("#searchInput").addEventListener("input", rechercherProduit);

// Fonction pour afficher les produits
function afficherProduits() {
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let tableBody = document.querySelector("#produitsTable");
    tableBody.innerHTML = "";

    produits.forEach((produit, index) => {
        let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${produit.designation}</td>
                <td><img src="${produit.photo || 'https://via.placeholder.com/50'}" width="50"></td>
                <td>${parseFloat(produit.prixVente).toLocaleString("fr-FR")} dh</td>
                <td>${parseFloat(produit.prixAchat).toLocaleString("fr-FR")} dh</td>
                <td>${parseFloat(produit.quantite).toLocaleString("fr-FR")}</td>
                <td>
                    <button class="btn btn-warning" onclick="modifierProduit(${index})">✏️ Modifier</button>
                    <button class="btn btn-danger" onclick="supprimerProduit(${index})">🗑️ Supprimer</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Fonction pour enregistrer (ajouter/modifier) un produit
function enregistrerProduit(e) {
    e.preventDefault();

    let designation = document.querySelector("#designation").value;
    let prixVente = document.querySelector("#prixVente").value.replace(",", ".");
    let prixAchat = document.querySelector("#prixAchat").value.replace(",", ".");
    let quantite = document.querySelector("#quantite").value.replace(",", ".");
    let file = document.querySelector("#photo").files[0];
    let index = document.querySelector("#produitIndex").value.trim();

    if (isNaN(parseFloat(prixVente)) || isNaN(parseFloat(prixAchat)) || isNaN(parseFloat(quantite))) {
        alert("Veuillez entrer des nombres valides pour les prix et la quantité.");
        return;
    }

    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let photo = "";

    if (file) {
        let reader = new FileReader();
        reader.onload = function (event) {
            photo = event.target.result;
            sauvegarderProduit(produits, index, designation, photo, prixVente, prixAchat, quantite);
        };
        reader.readAsDataURL(file);
    } else {
        let photoExistante = (index !== "" && !isNaN(index) && produits[index]) ? produits[index].photo : "";
        sauvegarderProduit(produits, index, designation, photoExistante, prixVente, prixAchat, quantite);
    }
}

// Sauvegarde en localStorage (Ajout ou Modification)
function sauvegarderProduit(produits, index, designation, photo, prixVente, prixAchat, quantite) {
    if (index !== "" && !isNaN(index) && produits[index]) {
        produits[index] = { designation, photo, prixVente, prixAchat, quantite };
    } else {
        produits.push({ designation, photo, prixVente, prixAchat, quantite });
    }

    localStorage.setItem("produits", JSON.stringify(produits));
    afficherProduits();
    fermerFormulaire();
}

// Modifier un produit
function modifierProduit(index) {
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let produit = produits[index];

    document.querySelector("#designation").value = produit.designation;
    document.querySelector("#prixVente").value = produit.prixVente.replace(".", ",");
    document.querySelector("#prixAchat").value = produit.prixAchat.replace(".", ",");
    document.querySelector("#quantite").value = produit.quantite.replace(".", ",");
    document.querySelector("#produitIndex").value = index;
    
    document.querySelector("#formTitle").textContent = "Modifier le Produit";
    document.querySelector("#formContainer").classList.remove("d-none");
}

// Supprimer un produit
function supprimerProduit(index) {
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    produits.splice(index, 1);
    localStorage.setItem("produits", JSON.stringify(produits));
    afficherProduits();
}

// Rechercher un produit
function rechercherProduit() {
    let searchText = document.querySelector("#searchInput").value.toLowerCase();
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let tableBody = document.querySelector("#produitsTable");
    tableBody.innerHTML = "";

    produits.filter(produit => produit.designation.toLowerCase().includes(searchText))
            .forEach((produit, index) => afficherProduits());
}

// Ouvrir / Fermer le formulaire
function ouvrirFormulaire() {
    document.querySelector("#formContainer").classList.remove("d-none");
    document.querySelector("#formTitle").textContent = "Ajouter un Produit";
}
function fermerFormulaire() {
    document.querySelector("#formContainer").classList.add("d-none");
    document.querySelector("#formProduit").reset();
}
