document.addEventListener("DOMContentLoaded", afficherProduits);

document
    .querySelector("#formAjoutProduit")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        let designation = document.querySelector("#designation").value;
        let prixVente = document.querySelector("#prixVente").value;
        let prixAchat = document.querySelector("#prixAchat").value;
        let quantite = document.querySelector("#quantite").value;
        let file = document.querySelector("#photo").files[0];
        let index = document.querySelector("#produitIndex").value; // Récupérer l'index

        if (file) {
            let reader = new FileReader();
            reader.onload = function (event) {
                let photoBase64 = event.target.result;
                enregistrerProduit(
                    designation,
                    photoBase64,
                    prixVente,
                    prixAchat,
                    quantite,
                    index
                );
            };
            reader.readAsDataURL(file);
        } else {
            let produits = JSON.parse(localStorage.getItem("produits")) || [];
            let photoExistante = index !== "" ? produits[index].photo : "";
            enregistrerProduit(
                designation,
                photoExistante,
                prixVente,
                prixAchat,
                quantite,
                index
            );
        }
    });

function enregistrerProduit(
    designation,
    photo,
    prixVente,
    prixAchat,
    quantite,
    index
) {
    let produits = JSON.parse(localStorage.getItem("produits")) || [];

    if (index !== "") {
        // Modification d'un produit existant
        produits[index] = {
            designation,
            photo,
            prixVente,
            prixAchat,
            quantite,
        };
    } else {
        // Ajout d'un nouveau produit
        produits.push({ designation, photo, prixVente, prixAchat, quantite });
    }

    localStorage.setItem("produits", JSON.stringify(produits));
    afficherProduits();
    document.querySelector("#formAjoutProduit").reset();
    document.querySelector("#produitIndex").value = ""; // Réinitialiser l'index
    bootstrap.Modal.getInstance(document.querySelector("#modalAjout")).hide();
}

function afficherProduits() {
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let tableBody = document.querySelector("#produitsTable");
    tableBody.innerHTML = "";

    produits.forEach((produit, index) => {
        let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${produit.designation}</td>
                <td><img src="${
                    produit.photo || "https://via.placeholder.com/50"
                }" width="50"></td>
                <td>${produit.prixVente} dh</td>
                <td>${produit.prixAchat} dh</td>
                <td>${produit.quantite}</td>
                <td>
                    <button class="btn btn-warning" onclick="editProduit(${index})">✏️ Modifier</button>
                    <button class="btn btn-danger" onclick="deleteProduit(${index})">🗑️ Supprimer</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function editProduit(index) {
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let produit = produits[index];

    document.querySelector("#designation").value = produit.designation;
    document.querySelector("#prixVente").value = produit.prixVente;
    document.querySelector("#prixAchat").value = produit.prixAchat;
    document.querySelector("#quantite").value = produit.quantite;
    document.querySelector("#produitIndex").value = index;

    let modal = new bootstrap.Modal(document.querySelector("#modalAjout"));
    modal.show();
}

function deleteProduit(index) {
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    produits.splice(index, 1);
    localStorage.setItem("produits", JSON.stringify(produits));
    afficherProduits();
}

document.querySelector("#searchInput").addEventListener("input", function () {
    let searchText = this.value.toLowerCase();
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    afficherProduits(searchText);
});

function rechercherProduit() {
    let searchText = document.querySelector("#searchInput").value.toLowerCase();
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let tableBody = document.querySelector("#produitsTable");
    tableBody.innerHTML = "";

    let produitsFiltres = produits.filter((produit) =>
        produit.designation.toLowerCase().includes(searchText)
    );

    produitsFiltres.forEach((produit, index) => {
        let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${produit.designation}</td>
                <td><img src="${
                    produit.photo || "https://via.placeholder.com/50"
                }" width="50"></td>
                <td>${produit.prixVente} dh</td>
                <td>${produit.prixAchat} dh</td>
                <td>${produit.quantite}</td>
                <td>
                    <button class="btn btn-warning" onclick="editProduit(${index})">✏️ Modifier</button>
                    <button class="btn btn-danger" onclick="deleteProduit(${index})">🗑️ Supprimer</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Écouteur d'événements pour la recherche
document
    .querySelector("#searchInput")
    .addEventListener("input", rechercherProduit);
