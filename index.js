const hero = document.getElementById("section-hero");
const catContainer = document.getElementById("cat-container");
const catCards = document.getElementById("cat-cards");
const btn1 = document.getElementById("btn-click-1");
const btn2 = document.getElementById("btn-click-2");
const btnGauche = document.getElementById("btn-prev");
const btnDroite = document.getElementById("btn-next");

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