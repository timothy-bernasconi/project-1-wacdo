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

let categories = [];
let categorieActive = "";
let index = 0;
let panier = [];
let friteSelectionnee = ""; 
async function chargerCategories() {
    try {
        const response = await fetch("categories.json");
        if(!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        categories = await response.json();
        hero.style.display = "none";  
        catContainer.style.display = "flex";
        monPanier.style.display ="flex";
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
    categorieActive = titreMenu;
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

menuContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".produit-card");
    if(!card) return;

    const nomProduit = card.querySelector("h2").textContent;
    const detail = document.createElement("div");
    detail.classList.add("menu-detail");
   
    if(categorieActive === "menus") {
        detail.innerHTML = `
        <div class="menu-detail-content">
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

    detail.addEventListener("click", (e) => {
        if (e.target.closest(".close-btn")) {
            detail.remove();
        }

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

       
        if(e.target.closest(".order-menu-drink")) {
            friteSelectionnee = detail.querySelector(".menu-card.selected h3")?.textContent || "Non définie";

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
      
    document.body.appendChild(detail); 

    detail.addEventListener("click", (e) => {
        const card = e.target.closest(".menu-card");
        if(!card) return;

        document.querySelectorAll(".menu-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
    });

    detail.querySelector(".menu-card")?.click();

    detail.querySelector(".close-btn").addEventListener("click", () => {
        detail.remove();
    });

    let quantite = 1;
    const prixTexte = card.querySelector("p")?.textContent.replace(" €", "");
    const prixProduit = prixTexte ? parseFloat(prixTexte) : 0;

    const btnMoins = document.getElementById("moins");
    if (btnMoins) {
        btnMoins.addEventListener("click", () => {
            const quantity = document.getElementById("quantite");
            if(parseInt(quantity.textContent) > 1) quantity.textContent = parseInt(quantity.textContent) - 1;
            quantite = parseInt(quantity.textContent);
        });
    }

    const btnPlus = document.getElementById("plus");
    if (btnPlus) {
        btnPlus.addEventListener("click", () => {
            const quantity = document.getElementById("quantite");
            quantity.textContent = parseInt(quantity.textContent) + 1;
            quantite = parseInt(quantity.textContent);
        });
    }

    detail.addEventListener("click", (e) => {
        if (e.target.closest(".panier")) {
            const prixTotal = quantite * prixProduit;
            
            const produitCommande = {
                nom: nomProduit,
                categorie: categorieActive,
                quantite: quantite,
                prixUnitaire: prixProduit,
                prixTotal: prixTotal
            };

            if (categorieActive === "menus") {
                const boissonSelectionnee = detail.querySelector(".menu-detail-image.carousel .menu-card.selected h3")?.textContent;                
                produitCommande.details = {
                    frite: friteSelectionnee,
                    boisson: boissonSelectionnee || "Non définie"
                };
            }

            panier.push(produitCommande);

            const divListe = document.getElementById("panier-liste");
            const ligneProduit = document.createElement("div");
            ligneProduit.className = "line-order"; 

            ligneProduit.innerHTML = `
                <span>${produitCommande.nom}
                    ${produitCommande.details?.frite ? `<br><small>${produitCommande.details.frite}</small>` : ""}
                    ${produitCommande.details?.boisson ? `<br><small>${produitCommande.details.boisson}</small>` : ""}
                </span>
                <img src="/assets/images/trash.png" class="delete-item-btn">
            `;

            ligneProduit.querySelector("img").addEventListener("click", () => {
                panier = panier.filter(p => p !== produitCommande); 
                ligneProduit.remove();
                recalculerEtAfficherTotal();
            });

            divListe.appendChild(ligneProduit);
            detail.remove();

            recalculerEtAfficherTotal();
        }
    });
});


abandon.addEventListener("click", () => {
    panier = []; 
    document.getElementById("panier-liste").innerHTML = ""; 
    recalculerEtAfficherTotal(); 
});

function recalculerEtAfficherTotal() {
    const divTotal = document.getElementById("order-total");
    
    const totalGlobal = panier.reduce((acc, produit) => acc + produit.prixTotal, 0);

    divTotal.innerHTML = `
        <div class="total">
            <hr>
            <span>Total : ${totalGlobal.toFixed(2)} €</span>
        </div>
    `;
}