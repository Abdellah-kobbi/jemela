document.addEventListener("DOMContentLoaded", () => {
    afficherProduits();
    document.querySelector("#formProduit").addEventListener("submit", enregistrerProduit);
});

// Vérification de connexion
function logout() {
    localStorage.removeItem("utilisateurConnecte");
    window.location.href = "login.html";
}

// Fonction pour afficher les produits
function afficherProduits() {
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let tableBody = document.querySelector("#produitsTable");
    tableBody.innerHTML = "";

    produits.forEach((produit, index) => {
        let row = `<tr>
            <td>${index + 1}</td>
            <td>${produit.designation}</td>
            <td><img src="${produit.photo}" alt="Image" width="50"></td>
            <td>${produit.prixVente} €</td>
            <td>${produit.prixAchat} €</td>
            <td>${produit.quantite}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="modifierProduit(${index})">✏️ Modifier</button>
                <button class="btn btn-danger btn-sm" onclick="supprimerProduit(${index})">🗑️ Supprimer</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// Ouvrir formulaire
function ouvrirFormulaire() {
    document.querySelector("#formContainer").classList.remove("d-none");
}

// Fermer formulaire
function fermerFormulaire() {
    document.querySelector("#formContainer").classList.add("d-none");
    document.querySelector("#formProduit").reset();
    document.querySelector("#produitIndex").value = "";
}

// Ajouter ou modifier un produit
function enregistrerProduit(event) {
    event.preventDefault();

    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let index = document.querySelector("#produitIndex").value;

    let produit = {
        designation: document.querySelector("#designation").value,
        prixVente: parseFloat(document.querySelector("#prixVente").value),
        prixAchat: parseFloat(document.querySelector("#prixAchat").value),
        quantite: parseInt(document.querySelector("#quantite").value),
        photo: document.querySelector("#photo").files[0] ? URL.createObjectURL(document.querySelector("#photo").files[0]) : "placeholder.jpg"
    };

    if (index === "") {
        produits.push(produit);
    } else {
        produits[index] = produit;
    }

    localStorage.setItem("produits", JSON.stringify(produits));
    fermerFormulaire();
    afficherProduits();
}

// Modifier un produit
function modifierProduit(index) {
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let produit = produits[index];

    document.querySelector("#designation").value = produit.designation;
    document.querySelector("#prixVente").value = produit.prixVente;
    document.querySelector("#prixAchat").value = produit.prixAchat;
    document.querySelector("#quantite").value = produit.quantite;
    document.querySelector("#produitIndex").value = index;

    ouvrirFormulaire();
}

// Supprimer un produit
function supprimerProduit(index) {
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
        let produits = JSON.parse(localStorage.getItem("produits")) || [];
        produits.splice(index, 1);
        localStorage.setItem("produits", JSON.stringify(produits));
        afficherProduits();
    }
}

// Recherche de produit
function rechercherProduit() {
    let filtre = document.querySelector("#searchInput").value.toLowerCase();
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let tableBody = document.querySelector("#produitsTable");
    tableBody.innerHTML = "";

    produits.forEach((produit, index) => {
        if (produit.designation.toLowerCase().includes(filtre)) {
            let row = `<tr>
                <td>${index + 1}</td>
                <td>${produit.designation}</td>
                <td><img src="${produit.photo}" alt="Image" width="50"></td>
                <td>${produit.prixVente} €</td>
                <td>${produit.prixAchat} €</td>
                <td>${produit.quantite}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="modifierProduit(${index})">✏️ Modifier</button>
                    <button class="btn btn-danger btn-sm" onclick="supprimerProduit(${index})">🗑️ Supprimer</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        }
    });
}
