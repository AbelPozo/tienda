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

                        if (item.quantity < product.stock) {
                        item.quantity++;
                        }

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

    const closeButton = document.createElement("button");
    closeButton.innerText = "Cerrar";

    closeButton.addEventListener("click", function() {
        cartHolder.close();
    });

    cartHolder.appendChild(closeButton);

    const titleElement = document.createElement("h2");
    titleElement.innerText = "Mi cesta";

    cartHolder.appendChild(titleElement);

    const nameElement = document.createElement("p");
    nameElement.innerText = "Cliente: " + userData.name;

    const addressElement = document.createElement("p");
    addressElement.innerText = "Dirección de envío: " + userData.address;

    cartHolder.appendChild(nameElement);
    cartHolder.appendChild(addressElement);

    if (cart.length === 0) {

        const emptyElement = document.createElement("p");
        emptyElement.innerText = "La cesta está vacía.";

        cartHolder.appendChild(emptyElement);

        return;
    }

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
            if (item.quantity < item.product.stock) {
                item.quantity++;
            }
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

    if (cart.length) {
        
        const buyButton = document.createElement("button");
        buyButton.innerText = "Finalizar compra";

        buyButton.addEventListener("click", function() {

            alert("Enviando pedido a " + userData.name + " en la dirección " + userData.address);

            alert("¡Compra realizada correctamente!");

            cart = [];

            document.getElementById("verCesta").innerText = "Ver cesta (0)";

            cartHolder.innerHTML = "";

            const messageElement = document.createElement("p");
            messageElement.innerText = "Tu compra ha sido realizada correctamente. La cesta está vacia.";
            
            cartHolder.appendChild(messageElement);
        });

        cartHolder.appendChild(buyButton);
    }
}

fetch("products.json")
.then(response => response.json())
.then(data => {
    products = data;
    showProducts("Todo");
});

fetch("userData.json")
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

    document.getElementById("cesta").showModal();
});

document.getElementById("cerrarCesta").addEventListener("click", function() {
    document.getElementById("cesta").close();
});