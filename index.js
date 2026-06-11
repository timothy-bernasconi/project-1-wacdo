// Déclaration de mes constantes //

const hero = document.getElementById("section-hero");
const catContainer = document.getElementById("cat-container");
const catCards = document.getElementById("cat-cards");
const btn1 = document.getElementById("btn-click-1");
const btn2 = document.getElementById("btn-click-2");
const btnGauche = document.getElementById("btn-prev");
const btnDroite = document.getElementById("btn-next");
const menuContainer = document.getElementById("menu-container");
const menuCarte = document.getElementById("menu-detail");
const monPanier = document.getElementById("my-order");
const abandon = document.querySelector(".cancel");
const payer = document.querySelector(".pay");
const numCommande = document.getElementById("number-order")
const choix = document.getElementById("choice");

// les variables globales //

let categories = []; // liste des categories de produits //
let categorieActive = ""; // categorie sur lequelle l'utilisateur a clické
let index = 0; // compteur de défilement des catégories 
let panier = []; // le panier vide 
let friteSelectionnee = ""; 
let commandOrder = 0;
let commandOrderSecond = 0; 


// Pour charger les catégories //
async function chargerCategories() {
    try {
        // on récupère le json
        const response = await fetch("categories.json");
        // si pas de json, afficher erreur //
        if(!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        // on traduit le json en un tableau js
        categories = await response.json();
        // on cache première page et on réaffiche les catégories et le panier //
        hero.style.display = "none";  
        catContainer.style.display = "flex";
        monPanier.style.display ="flex";
        // les categories se chargent depuis le début de l'index (soit 0)
        display(index);   
        // si erreur de chargement
    } catch (error) {
        console.error(error.message);
    }
}

// Pour afficher les cartes du panier //
function display(i) {
    // on vide d'abord le contenu //
    catCards.innerHTML = "";
    // on fait une boucle pour afficher le carrousel à l'infini ///
 
    for(let j = 0; j < categories.length; j++) {
        // pour revenir au début du tableau //
        const cat = categories[(i + j) % categories.length]; 
        // on crée la div dans laquelle on va afficher les cartes
        const div = document.createElement("div");
        // ajout class + le contenu //
        div.classList.add("cat-card");
        div.innerHTML = `
            <img src="${cat.image}" alt="${cat.title}">
            <h2>${cat.title}</h2>`;
        // création de la carte html //
        catCards.appendChild(div);
    }
}

// générer numéro commande sur place //

function commandNumber() {
    commandOrder++;
    numCommande.textContent = `Commande n°${commandOrder}`;
    choix.textContent = `Sur place`;
    return commandOrder;
}

// générer numéro commande à emporter, pour différencier si meme numéro on rajoutera un A sur la commande à emporter soit A001, A002  //

function commandNumberSecond() {
    commandOrderSecond++;
    numCommande.textContent = `Commande n°A${commandOrderSecond}`;
    choix.textContent = `A emporter`;
    return commandOrderSecond;

}

// chiffre aléatoire pour numéro chevallet //

function tableNumber() {
    return Math.floor(Math.random() * 9) + 1;
}
function tableNumber2() {
    return Math.floor(Math.random() * 9) + 1;
}
function tableNumber3() {
    return Math.floor(Math.random() * 9) + 1;
}


// la logique du carousel, au clic on avance ou on recule selon le bt1 ou btn2 //
// création d'un numéro de commande via le meme bouton //

btn1.addEventListener("click", chargerCategories);
btn1.addEventListener("click", commandNumber);
btn2.addEventListener("click", chargerCategories);
btn2.addEventListener("click", commandNumberSecond);

// avancer

btnDroite.addEventListener("click", () => {
    index++;
    if(index >= categories.length) index = 0; 
    display(index);
});

//reculer //

btnGauche.addEventListener("click", () => {
    index--;
    if(index < 0) index = categories.length - 1; 
    display(index);
});

// event pour encadrer la catégorie que l'user a choisie //
catCards.addEventListener("click", (e) => {
    // on cible l'element le plus proche, donc .cat-card
    const card = e.target.closest(".cat-card");
    if(!card) return;

    // on enelève la class a toutes les cartes et on l'ajoute a celle choisie //
    document.querySelectorAll(".cat-card").forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
});


// pour afficher les produits //

catCards.addEventListener("click", async (e) => {
    // on cible l'element le plus proche, donc .cat-card

    const card = e.target.closest(".cat-card");
    if (!card) return;
    
    // on stoppe l'évènement
    e.stopPropagation();

    const titreMenu = card.querySelector("h2").textContent;
    categorieActive = titreMenu;

    try {
        // On va chercher tous les produits //
        const responseProduits = await fetch("produits.json"); 
        // si bug du json //
        if (!responseProduits.ok) throw new Error("Erreur lors du chargement du JSON");
        
        const data = await responseProduits.json();

        // on récupère la sous liste, qu'on a mis avant pour afficher correctement les produits //
        const produits = data[titreMenu];

        // on réaffiche la div des produits //
        menuContainer.style.display = "flex";
        
        // on la vide //
        menuContainer.innerHTML = "";

        // si il n'y a pas de produits correspondants au titre //
        if (!produits) {
            menuContainer.innerHTML = "<p>Aucun produit trouvé dans cette catégorie.</p>";
            return;
        }

        // on affiche le titre, que l'on crée avant
        const titre = document.createElement("h2");
        titre.classList.add("categorie-titre");
        titre.innerHTML = `Nos ${titreMenu}`; 
          // on ajoute dans le HTML //
        menuContainer.appendChild(titre);

        // création de la carte pour chaque produit
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
            // on ajoute dans le HTML //
            menuContainer.appendChild(div);
        });

        // en cas d'erreurs //
    } catch (error) {
        console.error("Erreur :", error);
        menuContainer.innerHTML = "<p>Une erreur est survenue lors du chargement des menus.</p>";
    }
});

// pour afficher les différentes pages selon la catégorie //

menuContainer.addEventListener("click", (e) => {
    // idem cibler element le plus proche //
    const card = e.target.closest(".produit-card");
    if(!card) return;

    // la page qui va contenir les infos //
    const nomProduit = card.querySelector("h2").textContent;
    const detail = document.createElement("div");
    detail.classList.add("menu-detail");
   
// logique if / else comme les images et le contenu vont varier selon les catégories //

// pour les menus // 

    if(categorieActive === "menus") {
        // contenu page, pas de second if car il n'y a que 2 images pour différencier les menus  // 
        detail.innerHTML = `
        <div class="menu-detail-content">
            <img src="/assets/images/supprimer.png" class="close-btn">
            <h2>Une grosse faim ?</h2>
            <p>Le menu maxi Best Of comprend un sandwich, une grande frite et une boisson 50 Cl</p>
            <div class="menu-detail-image">
             <div class="menu-card">
                <img src="/assets/images/illustration-best-of.png">
                <p> Menu Best Of </p>
             </div>
              <div class="menu-card">   
                <img src="/assets/images/illustration-maxi-best-of.png">
                <p> Menu Maxi Best Of </p>
                </div>
            </div>
            <button class ="order-menu">Étape suivante</button>
        </div>`;
// pour les boisson, second if pour afficher les bonnes images au bons produits // 

    } else if (categorieActive === "boissons") {
        let imageBoisson = "";
        if (nomProduit === "Coca Cola") {
            imageBoisson = "/assets/boissons/coca-cola.png"; 
        } else if (nomProduit === "Coca Sans Sucres") {
            imageBoisson = "/assets/boissons/coca-sans-sucres.png";
        } else if (nomProduit === "Eau") {
            imageBoisson = "/assets/boissons/eau.png"
        } else if (nomProduit === "Fanta Orange") {
            imageBoisson = "/assets/boissons/fanta.png"
        } else if (nomProduit === "Ice Tea Pêche") {
            imageBoisson = "/assets/boissons/ice-tea-peche.png"
        } else if (nomProduit === "Ice Tea Citron") {
            imageBoisson = "/assets/the-vert-citron-sans-sucres.png"
        } else if (nomProduit === "Jus d'Orange") {
            imageBoisson = "/assets/boissons/jus-orange.png"
        } else {
            imageBoisson = "/assets/boissons/jus-pomme-bio.png"
        }
    // idem pour la page, + ajout d'un compteur pour augmenter nombre produit dans la commande, la logique sera partout sauf au menus //
        detail.innerHTML = `
        <div class="menu-detail-content">
            <img src="/assets/images/supprimer.png" class="close-btn">
            <h2>Une petite soif ?</h2>
            <p>Choisissez la taille de votre boisson pour votre ${nomProduit}, +0.50€ pour le format 50 Cl</p>
            <div class="menu-detail-image">
                <div class="menu-card">
                    <img src="${imageBoisson}">
                    <h2>30Cl</h2>
                </div>
                <div class="menu-card">
                    <img src="${imageBoisson}">
                    <h2>50Cl</h2>
                </div>
            </div>
            <div class="compteur">
                <button id="moins">-</button>
                <span id="quantite">1</span>
                <button id="plus">+</button>
            </div>
             <button class="panier">Ajouter au panier</button>
        </div>`;
// pour la page burger //
    } else if (categorieActive === "burgers") {
        let imageBurger = "";
        if (nomProduit === "Le 280") {
            imageBurger = "/assets/burgers/280.png";
        } else if (nomProduit === "Big Tasty") {
            imageBurger = "/assets/burgers/BIG_TASTY_1_VIANDE.png";
        } else if (nomProduit === "Big Tasty Bacon") {
            imageBurger = "/assets/burgers/BIG_TASTY_BACON_1_VIANDE.png"
        } else if (nomProduit === "Big Mac") {
            imageBurger = "/assets/burgers/BIGMAC.png"
        } else if (nomProduit === "CBO") {
            imageBurger = "/assets/burgers/CBO.png"
        } else if (nomProduit === "MC Chicken") {
            imageBurger = "/assets/burgers/MCCHICKEN.png"
        } else if (nomProduit === "MC Crispy") {
            imageBurger = "/assets/burgers/MCCRISPY.png"
        } else if (nomProduit === "MC Fish") {
            imageBurger = "/assets/burgers/MCFISH.png"
        } else if (nomProduit === "Royal Bacon") {
            imageBurger = "/assets/burgers/ROYALBACON.png"
        } else if (nomProduit === "Royal Cheese") {
            imageBurger = "/assets/burgers/ROYALCHEESE.png"
        } else if (nomProduit === "Royal Deluxe") {
            imageBurger = "/assets/burgers/ROYALDELUXE.png"
        } else if (nomProduit === "Signature BBQ Beef 2 viandes") {
            imageBurger = "/assets/burgers/SIGNATURE_BBQ_BEEF_(2_VIANDES).png"
        } else {
            imageBurger = "/assets/burgers/SIGNATURE_BEEF_BBQ_BURGER_(1_VIANDE).png"
        }

        detail.innerHTML = `
        <div class="menu-detail-content">
            <img src="/assets/images/supprimer.png" class="close-btn">
            <h2>Faites votre choix parmi nos ${categorieActive}</h2>
            <div class="menu-detail-image">
             <div class="menu-card">
                <img src="${imageBurger}" alt="${nomProduit}" class="small">
                <h3>${nomProduit}</h3>
                </div>
            </div>
            <div class="compteur">
                <button id="moins">-</button>
                <span id="quantite">1</span>
                <button id="plus">+</button>
            </div>
             <button class="panier">Ajouter au panier</button>
        </div>`;
 // pour la page frites //       
    } else if (categorieActive === "frites") {
        let imageFrite = "";
        if (nomProduit === "Petite Frite") {
            imageFrite = "/assets/frites/PETITE_FRITE.png"
        } else if (nomProduit === "Moyenne Frite") {
            imageFrite = "/assets/frites/MOYENNE_FRITE.png"
        } else if (nomProduit === "Grande Frite") {
            imageFrite = "/assets/frites/GRANDE_FRITE.png"
        } else if (nomProduit === "Potatoes") {
            imageFrite = "/assets/frites/POTATOES.png"
        } else {
            imageFrite = "/assets/frites/GRANDE_POTATOES.png"
        }

        detail.innerHTML = `
        <div class="menu-detail-content">
            <img src="/assets/images/supprimer.png" class="close-btn">
            <h2>Faites votre choix parmi nos ${categorieActive}</h2>
              <div class="menu-detail-image">
                <div class="menu-card">
                <img src="${imageFrite}" alt="${nomProduit}" class ="small">
                <h3>${nomProduit}</h3>
                </div>
            </div>
            <div class="compteur">
                <button id="moins">-</button>
                <span id="quantite">1</span>
                <button id="plus">+</button>
            </div>
             <button class="panier">Ajouter au panier</button>
        </div>`;
// pour la page encas //
    } else if (categorieActive === "encas") {
       let imageEncas = "";
        if(nomProduit === "Cheeseburger"){
            imageEncas = "/assets/encas/cheeseburger.png"
        } else if (nomProduit === "Croc MCdo") {
            imageEncas = "/assets/encas/croc-mc-do.png"
        } else if (nomProduit === "Nuggets x4") {
            imageEncas = "/assets/encas/nuggets_4.png"
        } else {
            imageEncas = "/assets/encas/nuggets_20.png"
        }

        detail.innerHTML = `
        <div class="menu-detail-content">
            <img src="/assets/images/supprimer.png" class="close-btn">
            <h2>Faites votre choix parmi nos ${categorieActive}</h2>
              <div class="menu-detail-image">
                <div class="menu-card">
                <img src="${imageEncas}" alt="${nomProduit}" class ="small">
                <h3>${nomProduit}</h3>
                </div>
            </div>
            <div class="compteur">
                <button id="moins">-</button>
                <span id="quantite">1</span>
                <button id="plus">+</button>
            </div>
             <button class="panier">Ajouter au panier</button>
        </div>`;
// pour la page wraps //

    } else if (categorieActive === "wraps") {
        let imageWrap = "";
      if (nomProduit === "MC Wrap chevre") {
        imageWrap = "/assets/wraps/mcwrap-chevre.png"
      } else if (nomProduit === "MC Wrap Poulet Bacon") {
        imageWrap = "/assets/wraps/MCWRAP-POULET-BACON.png"
      } else if (nomProduit === "Ptit Wrap Chevre"){
        imageWrap = "/assets/wraps/PTIT_WRAP_CHEVRE.png"
      } else {
        imageWrap = "/assets/wraps/PTIT_WRAP_RANCH.png"
      }

      detail.innerHTML = `
        <div class="menu-detail-content">
            <img src="/assets/images/supprimer.png" class="close-btn">
            <h2>Faites votre choix parmi nos ${categorieActive}</h2>
              <div class="menu-detail-image">
                <div class="menu-card">
                <img src="${imageWrap}" alt="${nomProduit}" class="small">
                <h3>${nomProduit}</h3>
                </div>
            </div>
            <div class="compteur">
                <button id="moins">-</button>
                <span id="quantite">1</span>
                <button id="plus">+</button>
            </div>
             <button class="panier">Ajouter au panier</button>
        </div>`;
// pour la page salades //

    } else if (categorieActive === "salades") {
        let imageSalade ="";
        if (nomProduit === "Petite Salade") {
            imageSalade = "/assets/salades/PETITE-SALADE.png"
        } else if (nomProduit === "Cesar Classic") {
            imageSalade = "/assets/salades/SALADE_CLASSIC_CAESAR.png"
        } else {
            imageSalade = "/assets/salades/SALADE_ITALIAN_MOZZA.png"
        }

        detail.innerHTML = `
        <div class="menu-detail-content">
            <img src="/assets/images/supprimer.png" class="close-btn">
            <h2>Faites votre choix parmi nos ${categorieActive}</h2>
              <div class="menu-detail-image">
                <div class="menu-card">
                <img src="${imageSalade}" alt="${nomProduit}" class="small">
                <h3>${nomProduit}</h3>
                </div>
            </div>
            <div class="compteur">
                <button id="moins">-</button>
                <span id="quantite">1</span>
                <button id="plus">+</button>
            </div>
             <button class="panier">Ajouter au panier</button>
        </div>`;
    // pour la page desserts //

    } else if (categorieActive === "desserts") {
        let imageDessert = "";
        if(nomProduit === "Brownie") {
            imageDessert = "/assets/desserts/brownies.png"
        } else if (nomProduit === "Cheesecake chocolat M&M'S") {
            imageDessert ="/assets/desserts/cheesecake_choconuts_M&M_s.png"
        } else if (nomProduit === "Cheesecake Fraise") {
            imageDessert = "/assets/desserts/cheesecake_fraise.png"
        } else if (nomProduit === "Cookie") {
            imageDessert = "/assets/desserts/cookie.png"
        } else if (nomProduit === "Donut") {
            imageDessert = "/assets/desserts/doghnut.png"
        } else if (nomProduit === "Macarons") {
            imageDessert = "/assets/desserts/macarons.png"
        } else if (nomProduit === "Mc Fleury") {
            imageDessert = "/assets/desserts/MCFleury.png"
        } else if (nomProduit === "Muffin") {
            imageDessert = "/assets/desserts/muffin.png"
        } else {
            imageDessert = "/assets/desserts/sunday.png"
        }

        detail.innerHTML = `
        <div class="menu-detail-content">
            <img src="/assets/images/supprimer.png" class="close-btn">
            <h2>Faites votre choix parmi nos ${categorieActive}</h2>
              <div class="menu-detail-image">
                <div class="menu-card">
                <img src="${imageDessert}" alt="${nomProduit}" class="small">
                <h3>${nomProduit}</h3>
                </div>
            </div>
            <div class="compteur">
                <button id="moins">-</button>
                <span id="quantite">1</span>
                <button id="plus">+</button>
            </div>
            <button class="panier">Ajouter au panier</button>
        </div>`;

        // on termine avec les sauces //
    } else {
        let imageSauce = "";
        if (nomProduit === "Classic Barbecue") {
            imageSauce = "/assets/sauces/classic-barbecue.png"
        } else if (nomProduit === "Classic Moutarde") {
            imageSauce = "/assets/sauces/classic-moutarde.png"   
        } else if (nomProduit === "Creamy Deluxe") {
            imageSauce = "/assets/sauces/cremy-deluxe.png"
        } else if (nomProduit === "Ketchup") {
            imageSauce = "/assets/sauces/ketchup.png"
        } else if (nomProduit === "Chinoise") {
            imageSauce = "/assets/sauces/sauce-chinoise.png"
        } else if (nomProduit === "Curry") {
            imageSauce = "/assets/sauces/sauce-curry.png"
        } else {
            imageSauce = "/assets/sauces/sauce-pommes-frite.png"
        }

        detail.innerHTML = `
        <div class="menu-detail-content">
            <img src="/assets/images/supprimer.png" class="close-btn">
            <h2>Faites votre choix parmi nos ${categorieActive}</h2>
              <div class="menu-detail-image">
                <div class="menu-card">
                <img src="${imageSauce}" alt="${nomProduit}" class="small">
                <h3>${nomProduit}</h3>
                </div>
            </div>
            <div class="compteur">
                <button id="moins">-</button>
                <span id="quantite">1</span>
                <button id="plus">+</button>
            </div>
             <button class="panier">Ajouter au panier</button>
        </div>`;
    }

// la croix permet de fermer la page, logique identique pour toutes les pages des produits de catégories //

    detail.addEventListener("click", (e) => {
        if (e.target.closest(".close-btn")) {
            detail.remove();
        }
// comme le menu contient plusieurs pages, on cible le bouton étape suivante et on modifies le contenu //
        if (e.target.closest(".order-menu")) {
            detail.innerHTML = `
                <div class="menu-detail-content">
                    <img src="/assets/images/supprimer.png" class="close-btn">
                    <span class ="return-btn"> Retour </span>
                    <h2>Choisissez votre accompagnement</h2>
                    <p>Frites, potatoes, la pomme de terre dans tous ses états</p>
                    <div class="menu-detail-image">
                        <div class="menu-card">
                            <img src="/assets/frites/MOYENNE_FRITE.png" class="small">
                            <h3>Moyenne Frite</h3>
                        </div>
                        <div class="menu-card">   
                            <img src="/assets/frites/POTATOES.png" class="small">
                            <h3>Potatoes</h3>
                        </div>
                    </div>
                    <button class="order-menu-drink">Étape suivante</button>
                </div>`;
        }

        // logique de retour en arrière, assez peu optimisée

        if(e.target.closest(".return-btn")) {
            detail.innerHTML = `<div class="menu-detail-content">
            <img src="/assets/images/supprimer.png" class="close-btn">
            <h2>Une grosse faim ?</h2>
            <p>Le menu maxi Best Of comprend un sandwich, une grande frite et une boisson 50 Cl</p>
            <div class="menu-detail-image">
             <div class="menu-card">
                <img src="/assets/images/illustration-best-of.png">
             </div>
              <div class="menu-card">   
                <img src="/assets/images/illustration-maxi-best-of.png">
                </div>
            </div>
            <button class ="order-menu">Étape suivante</button>
        </div>`;
        }

    // pareil pour la page suivante //
        if(e.target.closest(".order-menu-drink")) {
            friteSelectionnee = detail.querySelector(".menu-card.selected h3")?.textContent || "Non définie";

// affichage d'un carousel pour les boissons, on le récupère du json //

            fetch("produits.json")
                .then(res => res.json())
                .then(data => {
                    const boissons = data["boissons"];
                    const cardsHTML = boissons.map(b => `
                        <div class="menu-card">
                            <img src="${b.image}" class="small" alt="${b.nom}">
                            <h3>${b.nom}</h3>
                        </div>
                    `).join('');

                    detail.innerHTML = `
                        <div class="menu-detail-content">
                            <img src="/assets/images/supprimer.png" class="close-btn">
                            <span class="return-btn">Retour</span>
                            <h2>Choisissez votre boisson</h2>
                            <p>Un soda, un jus de fruit ou un verre d'eau</p>
                            <div class="menu-detail-image carousel">
                                ${cardsHTML}
                            </div>
                            <button class="panier">Ajouter le menu à ma commande </button>
                        </div>`;
                });
        }
    });

    // ajout sur HTML //       
    document.body.appendChild(detail); 

    // pour permettre de sélectionner les produits dans les menus, logique identique au catégories //
    detail.addEventListener("click", (e) => {
        const card = e.target.closest(".menu-card");
        if(!card) return;

        document.querySelectorAll(".menu-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
    });

    // simulation d'un clic pour automatique sélectionner un produit //
    detail.querySelector(".menu-card")?.click();

    // pour fermer la page //
    detail.querySelector(".close-btn").addEventListener("click", () => {
        detail.remove();
    });

    // logique du panier //

   // quantité initialie //

    let quantite = 1;
    // on récupère le produit //
    const prixTexte = card.querySelector("p")?.textContent.replace(" €", "");
    const prixProduit = prixTexte ? parseFloat(prixTexte) : 0;

    // logique pour diminuer la quantité de produits //
    const btnMoins = document.getElementById("moins");
    if (btnMoins) {
        btnMoins.addEventListener("click", () => {
            // pour ne pas descendre en dessous de 1 //
            const quantity = document.getElementById("quantite");
            if(parseInt(quantity.textContent) > 1) quantity.textContent = parseInt(quantity.textContent) - 1;
            // actualisation de la quantité //
            quantite = parseInt(quantity.textContent);
        });
    }
     
    // logique pour augmenter la quantité //
    const btnPlus = document.getElementById("plus");
    if (btnPlus) {
        btnPlus.addEventListener("click", () => {
            const quantity = document.getElementById("quantite");
            quantity.textContent = parseInt(quantity.textContent) + 1;
            // actualisation de la quantité //
            quantite = parseInt(quantity.textContent);
        });
    }

    detail.addEventListener("click", (e) => {

        // vérifcation si clic //

        if (e.target.closest(".panier")) {

            // calcul prix total //
            const prixTotal = quantite * prixProduit;
            
            // création de l'objet représentant le produit commandé

            const produitCommande = {
                nom: nomProduit,
                categorie: categorieActive,
                quantite: quantite,
                prixUnitaire: prixProduit,
                prixTotal: prixTotal
            };

            // si c'est dans la catégories menu, on récupère frites et boissons //
            if (categorieActive === "menus") {

                // récupèrer boisson //
                const boissonSelectionnee = detail.querySelector(".menu-detail-image.carousel .menu-card.selected h3")?.textContent;                
                produitCommande.details = {
                    frite: friteSelectionnee,
                    boisson: boissonSelectionnee || "Non définie"
                };
            }

            // ajout dans le panier //

            panier.push(produitCommande);

            // la div qui va afficher tous les produits //

            const divListe = document.getElementById("panier-liste");

            // la ligne qui va afficher le produit//
            const ligneProduit = document.createElement("div");
            // ajout de la classe //
            ligneProduit.className = "line-order"; 

            // contenu de la ligne //

            ligneProduit.innerHTML = `
                <span>${produitCommande.quantite} ${produitCommande.nom}
                    ${produitCommande.details?.frite ? `<br><small>${produitCommande.details.frite}</small>` : ""}
                    ${produitCommande.details?.boisson ? `<br><small>${produitCommande.details.boisson}</small>` : ""}
                </span>
                <img src="/assets/images/trash.png" class="delete-item-btn">
            `;

            // suppression d'un produit au clic sur l'image //
            ligneProduit.querySelector("img").addEventListener("click", () => {
                panier = panier.filter(p => p !== produitCommande); 
                // suppression ligne //
                ligneProduit.remove();
                // recalcul et affichage total //
                recalculerEtAfficherTotal();
            });

            // ajout dans HTML //
            divListe.appendChild(ligneProduit);
            // on ferme la page //
            detail.remove();

            recalculerEtAfficherTotal();
        }
    });
});

// pour abandonner le panier //

abandon.addEventListener("click", () => {
    // panier vide de base //
    panier = []; 
    // on vide affichage produit //
    document.getElementById("panier-liste").innerHTML = ""; 
    // total à zéro//
    recalculerEtAfficherTotal(); 
});

// pour payer //
payer.addEventListener("click", () => {

    // pour générer 3 chiffres alétoires, solution assez robuste //

   const numeroTable = tableNumber();
   const numeroTable2 = tableNumber2();
   const numeroTable3 = tableNumber3();

   // création page et on retire l'affichage du reste

    const confirmation = document.createElement("div");
    catContainer.style.display = "none";
    monPanier.style.display ="none";
    menuContainer.style.display="none";

// contenu de la page //

    confirmation.innerHTML = `
        <div class="end-page">
        <div class ="end-page-card">
        <h2>Pour être servis à table,</h2>
        <h3> Récupérez un chevalet et indiquez ici le numéro inscrit dessus <h3>
        <div class="span-number">
        <span class="number-card">${numeroTable}</span>
        <span class="number-card">${numeroTable2}</span>
        <span class="number-card">${numeroTable3}</span>
        </div>
        <button class="closing-page"> Enregister le numéro </button>
        </div>
       
        </div>
    `;

    // au clic sur closing-page

    confirmation.addEventListener("click", (e) => {
    const buttonOut = e.target.closest(".closing-page");

    if(buttonOut) {
        confirmation.innerHTML = `
        <div class="end-page">
        <div class ="end-page-card">
        <h2>Toute l’équipe vous remercie,</h2>
        <h3> Et vous souhaite un bon appétit dans nos restaurants, <h3>
        <h4> A bientôt ! </h4>
        <button class="new-command"> Nouvelle commande </button>
        </div>
       
        </div>
    `;
   }

   // la dernière page //

   confirmation.addEventListener("click", () => {
    const newOrder = e.target.closest(".new-command");

    if(newOrder) {
        confirmation.remove();
        catContainer.style.display = "flex";
        monPanier.style.display ="flex";
    }

   })
        

});
document.body.appendChild(confirmation);
});

// pour recalculer le total //
function recalculerEtAfficherTotal() {
    // le conteneur //
    const divTotal = document.getElementById("order-total");
    // le calcul //
    const totalGlobal = panier.reduce((acc, produit) => acc + produit.prixTotal, 0);

    // maj du contenu //
    divTotal.innerHTML = `
        <div class="total">
            <hr>
            <span>Total : ${totalGlobal.toFixed(2)} €</span>
        </div>
    `;
}

