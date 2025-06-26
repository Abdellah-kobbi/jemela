document.getElementById("searchInput").addEventListener("input", afficherProduits);
document.getElementById("filtreFournisseur").addEventListener("change", afficherProduits);
document.getElementById("formProduit").addEventListener("submit", function (e) {
  e.preventDefault();
  ajouterProduit();
  bootstrap.Modal.getInstance(document.getElementById("formModal")).hide();
});

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
    afficherProduits();
    reinitialiserFormulaire();
  };

  if (photoInput.files.length > 0) {
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    reader.onload({ target: { result: "" } });
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

  const filtreTexte = document.getElementById("searchInput").value.toLowerCase();
  const filtreFournisseur = document.getElementById("filtreFournisseur").value;

  produits = produits.filter(p =>
    (p.designation || "").toLowerCase().includes(filtreTexte) &&
    (filtreFournisseur === "" || p.fournisseur === filtreFournisseur)
  );

  const table = document.getElementById("produitsTable");
  table.innerHTML = produits.map((p, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${p.designation}</td>
      <td><img src="${p.photo}" width="50" style="cursor:pointer" onclick="afficherImage('${p.photo}')"></td>
      <td>${p.prixVente}</td>
      <td>${p.prixAchat}</td>
      <td>${p.quantite}</td>
      <td>${p.fournisseur}</td>
      <td>${p.date}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="modifierProduit(${i})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="supprimerProduit(${i})">🗑️</button>
      </td>
    </tr>
  `).join("");

  remplirFournisseurs();
}

function remplirFournisseurs() {
  const produits = JSON.parse(localStorage.getItem("produits")) || [];
  const select = document.getElementById("filtreFournisseur");
  const liste = [...new Set(produits.map(p => p.fournisseur).filter(f => f))];
  select.innerHTML = `<option value="">🧾 Tous les fournisseurs</option>` + 
    liste.map(f => `<option value="${f}">${f}</option>`).join('');
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

  new bootstrap.Modal(document.getElementById("formModal")).show();
}

function supprimerProduit(index) {
  if (!confirm("Voulez-vous supprimer ce produit ?")) return;
  const produits = JSON.parse(localStorage.getItem("produits")) || [];
  produits.splice(index, 1);
  localStorage.setItem("produits", JSON.stringify(produits));
  afficherProduits();
}

function afficherImage(src) {
  const modal = new bootstrap.Modal(document.getElementById("imageModal"));
  document.getElementById("imageAffichee").src = src;
  modal.show();
}

function ouvrirFormulaire() {
  reinitialiserFormulaire();
  new bootstrap.Modal(document.getElementById("formModal")).show();
}

function logout() {
  localStorage.setItem("utilisateurConnecte", "false");
  window.location.href = "login.html";
}

window.onload = afficherProduits;
