document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#loginForm").addEventListener("submit", login);
    document.querySelector("#registerForm").addEventListener("submit", register);
});

// Fonction d'inscription
function register(event) {
    event.preventDefault();
    
    let name = document.querySelector("#registerName").value;
    let email = document.querySelector("#registerEmail").value;
    let password = document.querySelector("#registerPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Vérifier si l'email est déjà utilisé
    if (users.some(user => user.email === email)) {
        alert("Cet email est déjà utilisé !");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
    toggleForm();
}

// Fonction de connexion
function login(event) {
    event.preventDefault();

    let email = document.querySelector("#loginEmail").value;
    let password = document.querySelector("#loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(user => user.email === email && user.password === password);

    if (user) {
        alert("Connexion réussie !");
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        localStorage.setItem("utilisateurConnecte", "true");  // ✅ Ajout de cet indicateur
        window.location.href = "index.html"; // ✅ Redirection après connexion
    } else {
        alert("Email ou mot de passe incorrect !");
    }
}

// Fonction pour basculer entre connexion et inscription
function toggleForm() {
    let loginForm = document.querySelector("#loginForm");
    let registerForm = document.querySelector("#registerForm");
    let formTitle = document.querySelector("#formTitle");
    let toggleButton = document.querySelector(".btn-link");

    if (loginForm.classList.contains("d-none")) {
        loginForm.classList.remove("d-none");
        registerForm.classList.add("d-none");
        formTitle.textContent = "Connexion";
        toggleButton.textContent = "Pas de compte ? Inscrivez-vous";
    } else {
        loginForm.classList.add("d-none");
        registerForm.classList.remove("d-none");
        formTitle.textContent = "Inscription";
        toggleButton.textContent = "Déjà un compte ? Connectez-vous";
    }
}
