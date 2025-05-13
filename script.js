document.addEventListener("DOMContentLoaded", () => {
  afficherProduits(); // affiche tous les produits au chargement

  document.querySelector("#formProduit").addEventListener("submit", enregistrerProduit);

  // Set date d'aujourd'hui par défaut
  document.querySelector("#date").value = new Date().toISOString().split('T')[0];

  // Ajout de debounce sur la recherche
  let timer;
  document.querySelector("#searchInput").addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(rechercherProduit, 300); // délai pour ne pas surcharger la fonction
  });
});

function logout() {
  localStorage.removeItem("utilisateurConnecte");
  window.location.href = "login.html";
}

function afficherProduits() {
  const produits = JSON.parse(localStorage.getItem("produits")) || [];
  afficherProduitsFiltres(produits.map((p, i) => ({ ...p, index: i })));
}

function afficherProduitsFiltres(produits) {
  const table = document.querySelector("#produitsTable");
  let html = "";
  produits.forEach((p, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${p.designation}</td>
        <td><img src="${p.photo}" width="50" style="cursor:pointer" onclick="afficherImage('${p.photo}')"></td>
        <td>${p.prixVente} €</td>
        <td>${p.prixAchat} €</td>
        <td>${p.quantite}</td>
        <td>${p.date}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="modifierProduit(${p.index})">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="supprimerProduit(${p.index})">🗑️</button>
        </td>
      </tr>
    `;
  });
  table.innerHTML = html;
}

function ouvrirFormulaire() {
  document.querySelector("#formProduit").reset();
  document.querySelector("#produitIndex").value = "";
  new bootstrap.Modal(document.getElementById("formModal")).show();
}

function enregistrerProduit(e) {
  e.preventDefault();

  let produits = JSON.parse(localStorage.getItem("produits")) || [];
  let index = document.querySelector("#produitIndex").value;
  let designation = document.querySelector("#designation").value.trim();

  let existe = produits.some((p, i) => p.designation.toLowerCase() === designation.toLowerCase() && i != index);
  if (existe) return afficherAlerte("⚠️ Ce produit existe déjà !");

  let fichier = document.querySelector("#photo").files[0];

  const enregistrer = (base64img) => {
    let produit = {
      designation: designation,
      prixVente: parseFloat(document.querySelector("#prixVente").value),
      prixAchat: parseFloat(document.querySelector("#prixAchat").value),
      quantite: parseInt(document.querySelector("#quantite").value),
      date: document.querySelector("#date").value,
      photo: base64img || (index !== "" ? produits[index].photo : "placeholder.jpg")
    };

    index === "" ? produits.push(produit) : produits[index] = produit;
    localStorage.setItem("produits", JSON.stringify(produits));
    bootstrap.Modal.getInstance(document.getElementById("formModal")).hide();
    afficherProduits();
    afficherAlerte("✅ Enregistré avec succès", "success");
  };

  if (fichier) {
    let reader = new FileReader();
    reader.onload = e => enregistrer(e.target.result);
    reader.readAsDataURL(fichier);
  } else {
    enregistrer();
  }
}

function modifierProduit(index) {
  let produits = JSON.parse(localStorage.getItem("produits")) || [];
  let produit = produits[index];

  document.querySelector("#designation").value = produit.designation;
  document.querySelector("#prixVente").value = produit.prixVente;
  document.querySelector("#prixAchat").value = produit.prixAchat;
  document.querySelector("#quantite").value = produit.quantite;
  document.querySelector("#date").value = produit.date;
  document.querySelector("#produitIndex").value = index;

  new bootstrap.Modal(document.getElementById("formModal")).show();
}

function supprimerProduit(index) {
  if (!confirm("Supprimer ce produit ?")) return;
  let produits = JSON.parse(localStorage.getItem("produits")) || [];
  produits.splice(index, 1);
  localStorage.setItem("produits", JSON.stringify(produits));
  afficherProduits();
  afficherAlerte("🗑️ Supprimé avec succès", "danger");
}

function rechercherProduit() {
  const filtre = document.querySelector("#searchInput").value.toLowerCase();
  const produits = JSON.parse(localStorage.getItem("produits")) || [];

  const resultats = produits
    .map((produit, i) => ({ ...produit, index: i }))
    .filter(p => p.designation.toLowerCase().includes(filtre));

  afficherProduitsFiltres(resultats);
}

function afficherImage(src) {
  document.getElementById("imageAffichee").src = src;
  new bootstrap.Modal(document.getElementById("imageModal")).show();
}

function afficherAlerte(message, type = "warning") {
  document.getElementById("alerteZone").innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show mt-3" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}
