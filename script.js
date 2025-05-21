let pageActuelle = 1;
const PRODUITS_PAR_PAGE = 5;

function ajouterProduit() {
  const designation = document.getElementById("designation").value.trim();
  const prixVente = document.getElementById("prixVente").value.trim();
  const prixAchat = document.getElementById("prixAchat").value.trim();
  const quantite = document.getElementById("quantite").value.trim();
  const fournisseur = document.getElementById("fournisseur").value.trim();
  const date = document.getElementById("date").value;
  const photoInput = document.getElementById("photo");

  if (!designation || !prixVente || !prixAchat || !quantite) {
    alert("Remplissez tous les champs obligatoires.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const photo = e.target.result;
    const produit = { designation, prixVente, prixAchat, quantite, fournisseur, date, photo };

    const produits = JSON.parse(localStorage.getItem("produits")) || [];
    produits.push(produit);
    localStorage.setItem("produits", JSON.stringify(produits));
    pageActuelle = Math.ceil(produits.length / PRODUITS_PAR_PAGE);
    afficherProduits();
    reinitialiserFormulaire();
  };

  if (photoInput.files.length > 0) {
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    reader.onload({ target: { result: "" } }); // image vide
  }
}

function reinitialiserFormulaire() {
  document.getElementById("designation").value = "";
  document.getElementById("prixVente").value = "";
  document.getElementById("prixAchat").value = "";
  document.getElementById("quantite").value = "";
  document.getElementById("fournisseur").value = "";
  document.getElementById("date").value = "";
  document.getElementById("photo").value = "";
}

function afficherProduits() {
  let produits = JSON.parse(localStorage.getItem("produits")) || [];

  const filtre = document.getElementById("searchInput").value.toLowerCase();
  produits = produits.filter(p => p.designation.toLowerCase().includes(filtre));

  const totalPages = Math.ceil(produits.length / PRODUITS_PAR_PAGE);
  if (pageActuelle > totalPages) pageActuelle = totalPages || 1;

  const debut = (pageActuelle - 1) * PRODUITS_PAR_PAGE;
  const produitsPage = produits.slice(debut, debut + PRODUITS_PAR_PAGE);

  const table = document.getElementById("produitsTable");
  table.innerHTML = `
    <thead>
      <tr>
        <th>#</th>
        <th>Désignation</th>
        <th>Image</th>
        <th>Prix Vente</th>
        <th>Prix Achat</th>
        <th>Quantité</th>
        <th>Fournisseur</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${produitsPage.map((p, i) => `
        <tr>
          <td>${debut + i + 1}</td>
          <td>${p.designation}</td>
          <td><img src="${p.photo}" width="50" style="cursor:pointer" onclick="afficherImage('${p.photo}')"></td>
          <td>${p.prixVente}</td>
          <td>${p.prixAchat}</td>
          <td>${p.quantite}</td>
          <td>${p.fournisseur}</td>
          <td>${p.date}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="modifierProduit(${debut + i})">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="supprimerProduit(${debut + i})">🗑️</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;

  genererPagination(totalPages);
}

function modifierProduit(index) {
  const produits = JSON.parse(localStorage.getItem("produits")) || [];
  const p = produits[index];

  document.getElementById("designation").value = p.designation;
  document.getElementById("prixVente").value = p.prixVente;
  document.getElementById("prixAchat").value = p.prixAchat;
  document.getElementById("quantite").value = p.quantite;
  document.getElementById("fournisseur").value = p.fournisseur;
  document.getElementById("date").value = p.date;

  produits.splice(index, 1);
  localStorage.setItem("produits", JSON.stringify(produits));
  afficherProduits();
}

function supprimerProduit(index) {
  if (!confirm("Voulez-vous supprimer ce produit ?")) return;

  const produits = JSON.parse(localStorage.getItem("produits")) || [];
  produits.splice(index, 1);
  localStorage.setItem("produits", JSON.stringify(produits));
  afficherProduits();
}

function afficherImage(src) {
  const modal = new bootstrap.Modal(document.getElementById('imageModal'));
  document.getElementById("modalImage").src = src;
  modal.show();
}

function genererPagination(totalPages) {
  const zone = document.getElementById("paginationZone");
  zone.innerHTML = "";

  if (totalPages <= 1) return;

  const bouton = (label, page, active = false, disabled = false) => `
    <li class="page-item ${active ? "active" : ""} ${disabled ? "disabled" : ""}">
      <a class="page-link" href="#" onclick="changerPage(${page}); return false;">${label}</a>
    </li>`;

  let html = `<ul class="pagination">`;
  html += bouton("«", pageActuelle - 1, false, pageActuelle === 1);

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      html += bouton(i, i, i === pageActuelle);
    }
  } else {
    if (pageActuelle > 2) {
      html += bouton(1, 1);
      if (pageActuelle > 3) html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
    }

    for (let i = Math.max(1, pageActuelle - 1); i <= Math.min(totalPages, pageActuelle + 1); i++) {
      html += bouton(i, i, i === pageActuelle);
    }

    if (pageActuelle < totalPages - 1) {
      if (pageActuelle < totalPages - 2) html += `<li class="page-item disabled"><span class="page-link">…</span></li>`;
      html += bouton(totalPages, totalPages);
    }
  }

  html += bouton("»", pageActuelle + 1, false, pageActuelle === totalPages);
  html += `</ul>`;

  zone.innerHTML = html;
}

function changerPage(page) {
  const produits = JSON.parse(localStorage.getItem("produits")) || [];
  const totalPages = Math.ceil(produits.length / PRODUITS_PAR_PAGE);
  if (page < 1 || page > totalPages) return;
  pageActuelle = page;
  afficherProduits();
}

window.onload = afficherProduits;
