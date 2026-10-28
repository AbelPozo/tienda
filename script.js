const productHolder = document.getElementById("productos");

fetch("products.json")
.then(response => response.json())
.then(products => {
    products.forEach(product => {
        if(product.stock > 0) {
            const productDiv = document.createElement("div");

            const imageElement = document.createElement("img");
            imageElement.src = product.image;
            imageElement.alt = product.name;
            imageElement.width = 150;

            const nameElement = document.createElement("h3");
            nameElement.innerText = product.name;

            const descriptionElement = document.createElement("p");
            descriptionElement.innerText = product.description;

            const priceElement = document.createElement("p");
            priceElement.innerText = product.price;

            const stockElement = document.createElement("p");
            stockElement.innerText = "Unidades disponibles: " + product.stock;

            productDiv
        }
    });
})