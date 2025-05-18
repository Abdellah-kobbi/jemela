const PRODUITS_PAR_PAGE = 5;
let pageActuelle = 1;

document.addEventListener("DOMContentLoaded", () => {
  afficherProduits();
  document.querySelector("#formProduit").addEventListener("submit", enregistrerProduit);
  document.querySelector("#date").value = new Date().toISOString().split("T")[0];
  remplirFournisseurs();

  // Recherche avec debounce
  let timerRecherche;
  document.querySelector("#searchInput").addEventListener("input", () => {
    clearTimeout(timerRecherche);
    timerRecherche = setTimeout(() => {
      pageActuelle = 1;
      afficherProduits();
    }, 300);
  });

  document.querySelector("#filtreFournisseur").addEventListener("change", () => {
    pageActuelle = 1;
    afficherProduits();
  });
});

function logout() {
  localStorage.removeItem("utilisateurConnecte");
  window.location.href = "login.html";
}

function afficherProduits() {
  let produits = JSON.parse(localStorage.getItem("produits")) || [];

  // Filtres
  const filtreDesignation = document.querySelector("#searchInput").value.toLowerCase();
  const filtreFournisseur = document.querySelector("#filtreFournisseur").value.toLowerCase();
  produits = produits.filter(p =>
    p.designation.toLowerCase().includes(filtreDesignation) &&
    (filtreFournisseur === "" || (p.fournisseur || "").toLowerCase() === filtreFournisseur)
  );

  // Pagination
  const totalPages = Math.ceil(produits.length / PRODUITS_PAR_PAGE);
  if (pageActuelle > totalPages) pageActuelle = totalPages || 1;
  const debut = (pageActuelle - 1) * PRODUITS_PAR_PAGE;
  const produitsPage = produits.slice(debut, debut + PRODUITS_PAR_PAGE);

  let table = document.querySelector("#produitsTable");
  table.innerHTML = produitsPage.map((produit, i) => `
    <tr>
      <td>${debut + i + 1}</td>
      <td>${produit.designation}</td>
      <td><img src="${produit.photo}" width="50" style="cursor:pointer" onclick="afficherImage('${produit.photo}')"></td>
      <td>${produit.prixVente} €</td>
      <td>${produit.prixAchat} €</td>
      <td>${produit.quantite}</td>
      <td>${produit.fournisseur || ''}</td>
      <td>${produit.date}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="modifierProduit(${debut + i})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="supprimerProduit(${debut + i})">🗑️</button>
      </td>
    </tr>
  `).join('');

  afficherPagination(totalPages);
}

function afficherPagination(totalPages) {
  const container = document.getElementById("paginationZone");
  container.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    container.innerHTML += `
      <button class="btn btn-sm ${i === pageActuelle ? 'btn-primary' : 'btn-outline-primary'} mx-1" onclick="changerPage(${i})">${i}</button>
    `;
  }
}

function changerPage(page) {
  pageActuelle = page;
  afficherProduits();
}

function ouvrirFormulaire() {
  document.querySelector("#formProduit").reset();
  document.querySelector("#produitIndex").value = "";
  document.querySelector("#date").value = new Date().toISOString().split("T")[0];
  new bootstrap.Modal(document.getElementById("formModal")).show();
}

function enregistrerProduit(e) {
  e.preventDefault();

  let produits = JSON.parse(localStorage.getItem("produits")) || [];
  let index = document.querySelector("#produitIndex").value;
  let designation = document.querySelector("#designation").value.trim();
  let fournisseur = document.querySelector("#fournisseur").value.trim();

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
      fournisseur: fournisseur,
      photo: base64img || (index !== "" ? produits[index].photo : "placeholder.jpg")
    };

    index === "" ? produits.push(produit) : produits[index] = produit;
    localStorage.setItem("produits", JSON.stringify(produits));
    bootstrap.Modal.getInstance(document.getElementById("formModal")).hide();
    afficherProduits();
    afficherAlerte("✅ Enregistré avec succès", "success");
    remplirFournisseurs();
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
  document.querySelector("#fournisseur").value = produit.fournisseur || "";
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
  remplirFournisseurs();
}

function remplirFournisseurs() {
  let produits = JSON.parse(localStorage.getItem("produits")) || [];
  let fournisseurs = [...new Set(produits.map(p => p.fournisseur).filter(f => f))];

  // Remplir select filtre
  let select = document.querySelector("#filtreFournisseur");
  if (select) {
    select.innerHTML = `<option value="">🧾 Tous les fournisseurs</option>`;
    fournisseurs.forEach(f => {
      select.innerHTML += `<option value="${f}">${f}</option>`;
    });
  }

  // Remplir datalist fournisseur du formulaire
  let datalist = document.querySelector("#fournisseursList");
  if (datalist) {
    datalist.innerHTML = "";
    fournisseurs.forEach(f => {
      datalist.innerHTML += `<option value="${f}">`;
    });
  }
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
