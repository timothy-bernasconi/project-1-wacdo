const hero = document.getElementById("section-hero");
const catContainer = document.getElementById("cat-container");
const btn1 = document.getElementById("btn-click-1");
const btn2 = document.getElementById("btn-click-2");

// bouton sur place 

btn1.addEventListener("click", async () => {
    try {
        const response = await fetch("categories.json");
        if(!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const categories = await response.json();

        hero.style.display = "none";    
        catContainer.style.display = "flex"; 

        categories.forEach(cat => {
            const div = document.createElement("div");
            div.classList.add("cat-card");
            div.innerHTML =
             `
                <img src="${cat.image}" alt="${cat.title}">
                <h2>${cat.title}</h2>`;
            catContainer.appendChild(div);
        });

    } catch (error) {
        console.error(error.message);
    }
});

// bouton à emporter

btn2.addEventListener("click", async () => {
    try {
        const response = await fetch("categories.json");
        if(!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const categories = await response.json();

        hero.style.display = "none";    
        catContainer.style.display = "flex"; 

        categories.forEach(cat => {
            const div = document.createElement("div");
            div.classList.add("cat-card");
            div.innerHTML =
             `
                <img src="${cat.image}" alt="${cat.title}">
                <h2>${cat.title}</h2>`;
            catContainer.appendChild(div);
        });

    } catch (error) {
        console.error(error.message);
    }
});