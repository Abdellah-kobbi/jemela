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
  const index = document.getElementById("produitIndex").value;

  if (!designation || !prixVente || !prixAchat || !quantite) {
    alert("عافاك عَمّر جميع الخانات المطلوبة.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const produits = JSON.parse(localStorage.getItem("produits")) || [];
    const produit = {
      designation,
      prixVente,
      prixAchat,
      quantite,
      fournisseur,
      date,
      photo: e.target.result
    };

    if (index) {
      // إذا المستخدم مبدلش الصورة، نخليو القديمة
      produit.photo = e.target.result || produits[index].photo;
      produits[index] = produit;
    } else {
      produits.push(produit);
    }

    localStorage.setItem("produits", JSON.stringify(produits));
    afficherProduits();
    reinitialiserFormulaire();
  };

  if (photoInput.files.length > 0) {
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    // إذا ماحطش صورة جديدة، نخلي القديمة ولا نخلي الصورة فارغة للإضافة
    if (index) {
      const produits = JSON.parse(localStorage.getItem("produits")) || [];
      reader.onload({ target: { result: produits[index].photo } });
    } else {
      reader.onload({ target: { result: "" } });
    }
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
  document.getElementById("produitIndex").value = "";
}

function afficherProduits() {
  const tousProduits = JSON.parse(localStorage.getItem("produits")) || [];

  const filtreTexte = document.getElementById("searchInput").value.toLowerCase();
  const filtreFournisseur = document.getElementById("filtreFournisseur").value;

  const produitsFiltres = tousProduits
    .map((p, i) => ({ ...p, indexOriginal: i })) 
    .filter(p => {
      const idProduit = (p.indexOriginal + 1).toString();
      return (
        idProduit.includes(filtreTexte) || 
        (p.designation || "").toLowerCase().includes(filtreTexte)
      ) && (filtreFournisseur === "" || p.fournisseur === filtreFournisseur);
    });

  const table = document.getElementById("produitsTable");
  table.innerHTML = produitsFiltres.map(p => `
    <tr>
      <td>${p.indexOriginal + 1}</td>
      <td>${p.designation}</td>
      <td><img src="${p.photo}" width="50" style="cursor:pointer" onclick="afficherImage('${p.photo}')"></td>
      <td>${p.prixVente}</td>
      <td>${p.prixAchat}</td>
      <td>${p.quantite}</td>
      <td>${p.fournisseur}</td>
      <td>${p.date}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="modifierProduit(${p.indexOriginal})">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="supprimerProduit(${p.indexOriginal})">🗑️</button>
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
  document.getElementById("produitIndex").value = index;

  new bootstrap.Modal(document.getElementById("formModal")).show();
}

function supprimerProduit(index) {
  if (!confirm("واش متأكد بغيتي تحيد هاد المنتج؟")) return;
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
