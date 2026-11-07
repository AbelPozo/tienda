//Buscamos el elemento HTML donde aparecerán los productos.
const productHolder = document.getElementById("productos"); 

//Array donde se guardarán los productos que se obtengan del archivo products.json.
let products = []; 

//Array donde se guardarán los productos que el usuario añada a la cesta.
let cart = []; 

//Objeto donde se guardarán los datos del usuario que se obtengan del archivo userData.json.
let userData = {}; 

//Función para mostrar los productos en la página web según la categoría seleccionada.
function showProducts(category) {

    //Limpiamos el catálogo para evitar que los productos se dupliquen.
    productHolder.innerHTML = ""; 

    //Recorremos todos los productos del array.
    products.forEach(product => {

        //Comprobamos si el producto tiene stock y si pertenece a la categoría seleccionada.
        if (product.stock > 0 && (category === "Todo" || product.category === category)) {
            
            //Creamos un div que contendrá toda la información del producto.
            const productDiv = document.createElement("div"); 
            
            //Creamos los elementos HTML para mostrar la información del producto y los añadimos al div.
            const imageElement = document.createElement("img"); 
            imageElement.src = product.image;
            imageElement.alt = product.name;
            imageElement.width = 150;

            //Creamos un encabezado para mostrar el nombre del producto y un párrafo para mostrar la descripción, el precio y el stock disponible.
            const nameElement = document.createElement("h3");
            nameElement.innerText = product.name;

            const descriptionElement = document.createElement("p");
            descriptionElement.innerText = product.description;

            const priceElement = document.createElement("p");
            priceElement.innerText = product.price + " €";

            const stockElement = document.createElement("p");
            stockElement.innerText = "Unidades disponibles: " + product.stock;

            //Creamos un botón para añadir el producto a la cesta y le añadimos un evento click que se ejecutará cuando el usuario haga clic en él.
            const addButton = document.createElement("button");
            addButton.innerText = "Añadir a la cesta";

            addButton.addEventListener("click", function() {

                //Variable que indica si el producto ya está en la cesta.
                let found = false; 

                //Recorremos todos los productos de la cesta para comprobar si el producto ya está añadido.
                cart.forEach(item => {
                    if (item.product.id === product.id) {

                        //Si el producto ya está en la cesta, aumentamos la cantidad en 1 siempre que no se supere el stock disponible.
                        if (item.quantity < product.stock) {
                            item.quantity++;
                        }

                        found = true;
                    }
                });

                //Si el producto no está en la cesta, lo añadimos con una cantidad inicial de 1.
                if (found === false) {
                    cart.push({
                        product: product,
                        quantity: 1
                    });
                }

                //Actualizamos el texto del botón "Ver cesta" para mostrar la cantidad de productos añadidos.
                document.getElementById("verCesta").innerText = "Ver cesta (" + cart.length + ")";
            });

            //Añadimos la imagen al contenedor del producto, el nombre, la descripción, el precio, el stock y el botón al contenedor del producto.
            productDiv.appendChild(imageElement);
            productDiv.appendChild(nameElement);
            productDiv.appendChild(descriptionElement);
            productDiv.appendChild(priceElement);
            productDiv.appendChild(stockElement);
            productDiv.appendChild(addButton);

            //Introducimos la tarjeta completa dentro del catálogo.
            productHolder.appendChild(productDiv);
        }
    });
}

//Función para mostrar la cesta de la compra en un modal.
function showCart() {
    
    //Buscamos la ventana emergente de la cesta en el HTML.
    const cartHolder = document.getElementById("cesta");

    //Limpiamos el contenido de la cesta para evitar que los productos se dupliquen.
    cartHolder.innerHTML = "";

    //Creamos un botón para cerrar la ventana emergente de la cesta.
    const closeButton = document.createElement("button");
    closeButton.innerText = "Cerrar";

    //Añadimos un evento click que se ejecutará cuando el usuario haga clic en él, cerrando la ventana emergente.
    closeButton.addEventListener("click", function() {
        cartHolder.close();
    });

    //Añadimos el botón de cerrar a la ventana.
    cartHolder.appendChild(closeButton);

    //Creamos un título para la ventana emergente de la cesta.
    const titleElement = document.createElement("h2");
    titleElement.innerText = "Mi cesta";

    //Añadimos el título a la ventana.
    cartHolder.appendChild(titleElement);

    //Creamos el mensaje de envío con los datos del usuario obtenidos del archivo userData.json.
    const shippingElement = document.createElement("p");
    shippingElement.innerText = "Enviando pedido a: " + userData.name + ", " + userData.address;

    //Añadimos el mensaje de envío a la ventana.
    cartHolder.appendChild(shippingElement);

    //Comprobamos si la cesta está vacía.
    if (cart.length === 0) {

        //Creamos un mensaje indicando que la cesta está vacía.
        const emptyElement = document.createElement("p");
        emptyElement.innerText = "La cesta está vacía.";

        //Mostramos el mensaje.
        cartHolder.appendChild(emptyElement);

        //Terminamos la ejecución de la función para que no se muestre el resto de elementos de la cesta.
        return;
    }

    //Variable para calcular el total de la compra.
    let total = 0;

    //Recorremos todos los productos de la cesta para mostrarlos en la ventana emergente.
    cart.forEach(item => {

        //Creamos un párrafo para mostrar el nombre y el precio del producto.
        const productElement = document.createElement("p");
        productElement.innerText = item.product.name + " - " + item.product.price + " €";
        
        //Añadimos la información del producto.
        cartHolder.appendChild(productElement);

        //Creamos un párrafo para mostrar la cantidad del producto seleccionada.
        const quantityElement = document.createElement("p");
        quantityElement.innerText = "Cantidad: " + item.quantity;

        //Añadimos la cantidad.
        cartHolder.appendChild(quantityElement);

        //Creamos el botón para aumentar la cantidad.
        const addButton = document.createElement("button");
        addButton.innerText = "+";

        //Añadimos un evento click que se ejecutará cuando el usuario haga clic en él, aumentando la cantidad del producto en 1 siempre que no se supere el stock disponible.
        addButton.addEventListener("click", function() {
            if (item.quantity < item.product.stock) {
                item.quantity++;
            }
            
            //Volvemos a mostrar la cesta para actualizar los datos.
            showCart();
        });

        //Añadimos el botón de aumentar.
        cartHolder.appendChild(addButton);

        //Creamos el botón para disminuir la cantidad.
        const subtractButton = document.createElement("button");
        subtractButton.innerText = "-";

        //Añadimos un evento click que se ejecutará cuando el usuario haga clic en él, disminuyendo la cantidad del producto en 1 siempre que no sea menor que 1.
        subtractButton.addEventListener("click", function() {
            
            //Si hay más de una unidad, restamos 1
            if (item.quantity > 1) {
                item.quantity--;
            
            //Si solo queda una unidad, eliminamos el producto de la cesta.
            } else {
                cart.splice(cart.indexOf(item), 1);
            }

            //Actualizamos el texto del botón "Ver cesta" para mostrar la cantidad de productos añadidos.
            document.getElementById("verCesta").innerText = "Ver cesta (" + cart.length + ")";

            //Volvemos a mostrar la cesta con los cambios.
            showCart();
        });

        //Añadimos el botón de disminuir.
        cartHolder.appendChild(subtractButton);

        //Creamos el botón para eliminar el producto de la cesta.
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Eliminar";

        //Añadimos un evento click que se ejecutará cuando el usuario haga clic en él, eliminando el producto de la cesta.
        deleteButton.addEventListener("click", function() {
            
            //Buscamos la posición del producto y lo eliminamos del array.
            cart.splice(cart.indexOf(item), 1);

            //Actualizamos el texto del botón "Ver cesta" para mostrar la cantidad de productos añadidos.
            document.getElementById("verCesta").innerText = "Ver cesta (" + cart.length + ")";

            //Volvemos a mostrar la cesta actualizada.
            showCart();
        });

        //Añadimos el botón de eliminar.
        cartHolder.appendChild(deleteButton);

        //Calculamos el total de la compra sumando el precio del producto por la cantidad seleccionada.
        total = total + (item.product.price * item.quantity);
    });

    //Creamos un encabezado para mostrar el total de la compra.
    const totalElement = document.createElement("h3");
    
    //Mostramos el total con dos decimales y el símbolo del euro.
    totalElement.innerText = "Total: " + total.toFixed(2) + " €";

    //Añadimos el total a la cesta.
    cartHolder.appendChild(totalElement);

    //Comprobamos que la cesta tenga productos.
    if (cart.length) {

        //Creamos un botón para finalizar la compra.
        const buyButton = document.createElement("button");
        buyButton.innerText = "Finalizar Compra";

        //Añadimos un evento click que se ejecutará cuando el usuario haga clic en él, finalizando la compra y actualizando el stock de los productos.
        buyButton.addEventListener("click", function() {
            
            //Recorremos todos los productos de la cesta y actualizamos el stock restando la cantidad comprada.
            cart.forEach(item => {
                item.product.stock = item.product.stock - item.quantity;
            });

            //Mostramos un mensaje indicando que la compra se ha realizado correctamente.
            alert("¡Compra realizada correctamente!");

            //Vaciamos la cesta después de la compra.
            cart = [];

            //Actualizamos el texto del botón "Ver cesta" para mostrar que no hay productos añadidos.
            document.getElementById("verCesta").innerText = "Ver cesta (0)";

            //Cerramos la ventana emergente de la cesta.
            cartHolder.close();

            //Volvemos a mostrar los productos para actualizar el stock disponible.
            showProducts("Todo");
        });

        //Añadimos el botón de finalizar compra a la cesta.
        cartHolder.appendChild(buyButton);
    }
}

//Obtenemos los productos del archivo products.json y los guardamos en el array products.
fetch("products.json")

//Convertimos la respuesta recibida en datos JSON y los guardamos en el array products, luego mostramos todos los productos.
.then(response => response.json())
.then(data => {
    products = data;
    showProducts("Todo");
});

//Obtenemos los datos del usuario del archivo userData.json y los guardamos en el objeto userData.
fetch("userData.json")

//Convertimos la respuesta recibida en datos JSON y los guardamos los datos del usuario en la variable userData.
.then(response => response.json())
.then(data => {
    userData = data;
});

//Cuando se pulsa "Todo", mostramos todos los productos disponibles.
document.getElementById("todo").addEventListener("click", function() {
    showProducts("Todo");
});

//Cuando se pulsa "Videojuegos", mostramos los productos de esa categoría.
document.getElementById("videojuegos").addEventListener("click", function() {
    showProducts("Videojuegos");
});

//Cuando se pulsa "Accesorios", mostramos los productos de esa categoría.
document.getElementById("accesorios").addEventListener("click", function() {
    showProducts("Accesorios");
});

//Cuando se pulsa "Consolas y componentes", mostramos los productos de esa categoría.
document.getElementById("consolas").addEventListener("click", function() {
    showProducts("Consolas y componentes");
});

//Detectamos cuando el usuario hace clic en el botón "Ver cesta".
document.getElementById("verCesta").addEventListener("click", function() {
    
    //Mostramos el contenido actualizado de la cesta.
    showCart();

    //Abrimos la ventana emergente de forma modal.
    document.getElementById("cesta").showModal();
});