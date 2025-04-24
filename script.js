document.addEventListener("DOMContentLoaded", () => {
    afficherProduits();
    document.querySelector("#formProduit").addEventListener("submit", enregistrerProduit);
    document.querySelector("#date").value = new Date().toISOString().split('T')[0];  // set default date to today
  });
  
  function logout() {
    localStorage.removeItem("utilisateurConnecte");
    window.location.href = "login.html";
  }
  
  function afficherProduits() {
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let table = document.querySelector("#produitsTable");
    table.innerHTML = "";
  
    produits.forEach((produit, i) => {
      table.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${produit.designation}</td>
          <td><img src="${produit.photo}" width="50" style="cursor:pointer" onclick="afficherImage('${produit.photo}')"></td>
          <td>${produit.prixVente} €</td>
          <td>${produit.prixAchat} €</td>
          <td>${produit.quantite}</td>
          <td>${produit.date}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="modifierProduit(${i})">✏️</button>
            <button class="btn btn-danger btn-sm" onclick="supprimerProduit(${i})">🗑️</button>
          </td>
        </tr>
      `;
    });
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
        date: document.querySelector("#date").value, // ajout de la date
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
    document.querySelector("#date").value = produit.date; // mettre à jour la date
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
    let filtre = document.querySelector("#searchInput").value.toLowerCase();
    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let table = document.querySelector("#produitsTable");
    table.innerHTML = "";
  
    produits.forEach((produit, i) => {
      if (produit.designation.toLowerCase().includes(filtre)) {
        table.innerHTML += `
          <tr>
            <td>${i + 1}</td>
            <td>${produit.designation}</td>
            <td><img src="${produit.photo}" width="50" style="cursor:pointer" onclick="afficherImage('${produit.photo}')"></td>
            <td>${produit.prixVente} €</td>
            <td>${produit.prixAchat} €</td>
            <td>${produit.quantite}</td>
            <td>${produit.date}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="modifierProduit(${i})">✏️</button>
              <button class="btn btn-danger btn-sm" onclick="supprimerProduit(${i})">🗑️</button>
            </td>
          </tr>
        `;
      }
    });
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
  