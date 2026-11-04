const productHolder = document.getElementById("productos");

let products = [];
let cart = [];
let userData = [];

function showProducts(category) {
    productHolder.innerHTML = "";

    products.forEach(product => {

        if (product.stock > 0 && (category === "Todo" || product.category === category)) {

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
            priceElement.innerText = product.price + " €";

            const stockElement = document.createElement("p");
            stockElement.innerText = "Unidades disponibles: " + product.stock;

            const addButton = document.createElement("button");
            addButton.innerText = "Añadir a la cesta";

            addButton.addEventListener("click", function() {

                let found = false;

                cart.forEach(item => {
                    if (item.product.id === product.id) {
                        item.quantity++;
                        found = true;
                    }
                });

                if (found === false) {
                    cart.push({
                        product: product,
                        quantity: 1
                    });
                }

                document.getElementById("verCesta").innerText = "Ver cesta (" + cart.length + ")";
            });

            productDiv.appendChild(imageElement);
            productDiv.appendChild(nameElement);
            productDiv.appendChild(descriptionElement);
            productDiv.appendChild(priceElement);
            productDiv.appendChild(stockElement);
            productDiv.appendChild(addButton);

            productHolder.appendChild(productDiv);
        }
    });
}

function showCart() {
    const cartHolder = document.getElementById("cesta");

    cartHolder.innerHTML = "";

    const titleElement = document.createElement("h2");
    titleElement.innerText = "Mi cesta";

    cartHolder.appendChild(titleElement);

    let total = 0;

    cart.forEach(item => {

        const productElement = document.createElement("p");

        productElement.innerText = item.product.name + " - " + item.product.price + " €";

        cartHolder.appendChild(productElement);

        const quantityElement = document.createElement("p");
        quantityElement.innerText = "Cantidad: " + item.quantity;

        cartHolder.appendChild(quantityElement);

        const addButton = document.createElement("button");
        addButton.innerText = "+";

        addButton.addEventListener("click", function() {
            item.quantity++;
            showCart();
        });

        cartHolder.appendChild(addButton);

        const subtractButton = document.createElement("button");
        subtractButton.innerText = "-";

        subtractButton.addEventListener("click", function() {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart.splice(cart.indexOf(item), 1);
            }

            showCart();
        });

        cartHolder.appendChild(subtractButton);

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Eliminar";

        deleteButton.addEventListener("click", function() {
            cart.splice(cart.indexOf(item), 1);
            showCart();
        });

        cartHolder.appendChild(deleteButton);

        total = total + (item.product.price * item.quantity);
    });

    const totalElement = document.createElement("h3");
    totalElement.innerText = "Total: " + total.toFixed(2) + " €";

    cartHolder.appendChild(totalElement);
}

fetch("products.json")
.then(response => response.json())
.then(data => {
    products = data;
    showProducts("Todo");
});

fetch("user.json")
.then(response => response.json())
.then(data => {
    userData = data;
});

document.getElementById("todo").addEventListener("click", function() {
    showProducts("Todo");
});

document.getElementById("videojuegos").addEventListener("click", function() {
    showProducts("Videojuegos");
});

document.getElementById("accesorios").addEventListener("click", function() {
    showProducts("Accesorios");
});

document.getElementById("consolas").addEventListener("click", function() {
    showProducts("Consolas y componentes");
});

document.getElementById("verCesta").addEventListener("click", function() {
    showCart();
});

document.getElementById("finalizarcompra").addEventListener("click", function() {
    if (cart.length === 0) {
        alert("La cesta está vacía.");
        return;
    }
});
