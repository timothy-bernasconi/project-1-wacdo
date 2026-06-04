const hero = document.getElementById("section-hero");
const catContainer = document.getElementById("cat-container");
const catCards = document.getElementById("cat-cards");
const btn1 = document.getElementById("btn-click-1");
const btn2 = document.getElementById("btn-click-2");
const btnGauche = document.getElementById("btn-prev");
const btnDroite = document.getElementById("btn-next");
const menuContainer = document.getElementById("menu-container");


let categories = [];
let index = 0;

async function chargerCategories() {
    try {
        const response = await fetch("categories.json");
        if(!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        categories = await response.json();
        hero.style.display = "none";  
        catContainer.style.display = "flex";
        display(index);   
         } catch (error) {
        console.error(error.message);
    }
}

function display(i) {
    catCards.innerHTML = "";
    for(let j = 0; j < categories.length; j++) {
        const cat = categories[(i + j) % categories.length]; 
        const div = document.createElement("div");
        div.classList.add("cat-card");
        div.innerHTML = `
            <img src="${cat.image}" alt="${cat.title}">
            <h2>${cat.title}</h2>`;
        catCards.appendChild(div);
    }
}

btn1.addEventListener("click", chargerCategories);
btn2.addEventListener("click", chargerCategories);

btnDroite.addEventListener("click", () => {
    index++;
    if(index >= categories.length) index = 0; 
    display(index);
});


btnGauche.addEventListener("click", () => {
    index--;
    if(index < 0) index = categories.length - 1; 
    display(index);
});

catCards.addEventListener("click", (e) => {
    const card = e.target.closest(".cat-card");
    if(!card) return;

    document.querySelectorAll(".cat-card").forEach(c => c.classList.remove("selected"));

    card.classList.add("selected");
});

catCards.addEventListener("click", async (e) => {
    const card = e.target.closest(".cat-card");
    if (!card) return;
    
    e.stopPropagation();

    const titreMenu = card.querySelector("h2").textContent;

    try {
        const responseProduits = await fetch("produits.json"); 
        if (!responseProduits.ok) throw new Error("Erreur lors du chargement du JSON");
        
        const data = await responseProduits.json();
        const produits = data[titreMenu];

        menuContainer.style.display = "flex";
        menuContainer.innerHTML = "";

        if (!produits) {
            menuContainer.innerHTML = "<p>Aucun produit trouvé dans cette catégorie.</p>";
            return;
        }

        const titre = document.createElement("h2");
        titre.classList.add("categorie-titre");
        titre.innerHTML = `Nos ${titreMenu}`; 
        menuContainer.appendChild(titre);

        produits.forEach(produit => {
            const div = document.createElement("div");
            div.classList.add("produit-card");
            div.innerHTML = `
                 <img src="${produit.image}" alt="${produit.nom}">
                <div class = "produits-infos">
                <h2>${produit.nom}</h2>
                <p>${produit.prix} €</p>
                </div>
            `;
            menuContainer.appendChild(div);
        });

    } catch (error) {
        console.error("Erreur :", error);
        menuContainer.innerHTML = "<p>Une erreur est survenue lors du chargement des menus.</p>";
    }
});