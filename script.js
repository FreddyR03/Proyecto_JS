const API_URL = "https://fakestoreapi.com/products";
const productos = document.getElementById("productos");
const ordenar = document.getElementById("ordenar");
const categoria = document.getElementById("categoria");
const buscar = document.getElementById("buscar");
const carritoModal = document.getElementById("carrito-modal");
const carritoContenedor = document.getElementById("carrito-contenedor");
const carritoCantidad = document.getElementById("carrito-cantidad");
const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
const cerrarModal = document.querySelector(".cerrar");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let listaProductos = [];

//Esta función lo que hice es  consultar la API con fetch y convertir la respuesta en JSON  y guardar los productos en listaProductos. Luego llama a mostrarProductos para renderizarlos.
async function obtenerProductos() {
    try {
        const res = await fetch(API_URL);
        listaProductos = await res.json();
        //Aquí lo que esta haciendo es que va a mostrar los productos en listaProductos
        mostrarProductos(listaProductos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
}

//Esta función lo que hace es mostrar los productos del API y agregarlas al DOM con appendChild.
function mostrarProductos(lista) {
    //Los productos lo convierte en vacio si hay algo
    productos.innerHTML = "";
    lista.forEach(p => {
        const card = document.createElement("div");
        card.classList.add("card");
        //Aquí esta llamando a los productos del API aunque solamente está llamando la imagen, titulo, precio y la id se usa para identificar qué producto se agrega al carrito.
        card.innerHTML = `
            <img src="${p.image}" alt="${p.title}">
            <h3>${p.title}</h3>
            <p><b>Categoria: </b>${p.category}</p>
            <p><b>Precio: </b>$${p.price}</p>
            <button data-id="${p.id}">Agregar al carrito</button>
        `;
        //Aqui esta agarrando el boton y va a hacer un evento en donde cuando le de click en el boton va a hacer la función de agregarAlCarrito, además de agregarlo al carrito, muestra un mensaje de confirmación con SweetAlert2.
       card.querySelector("button").addEventListener("click", () => {
            agregarAlCarrito(p);
            Swal.fire({
            title: "Agregado al carrito",
            text: `El producto ${p.title} se agregó al carrito exitosamente`,
            icon: "success",
            confirmButtonText: "OK"
            });
        });
        //Aquí lo que está haciendo es agregar la tarjeta completa (card) al contenedor principal (productos), con todos los elementos que ya se habían generado dentro del innerHTML.
        productos.appendChild(card);
    });
}

//Esta función lo que hace es agregar los productos que elegiste al carrito
function agregarAlCarrito(producto) {
    //Aquí lo que hace es buscar dentro del carrito si el producto ya está agregado.
    const existente = carrito.find(p => p.id === producto.id);
    //Aquí lo que hace es que si el producto ya está en el carrito se va agregar la cantidad y no va repetir lo mismo
    //y si no entonces va a crear un nuevo profucto con cantidad 1
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    //Después de que haga todo el proceso va a actualizar los cambios
    actualizarCarrito();
}

//Esta funcion lo que hace es mostrar el carrito,  también calcula el total y lo actualiza en el DOM.
function mostrarCarrito() {
    carritoContenedor.innerHTML = "";
    let totalPrecio = 0;
    // Aquí lo que hace es que si el carrito no hay ningun producto, va a colocar el carrito está vacío
    if (carrito.length === 0) {
        carritoContenedor.innerHTML = "<p>El carrito está vacío.</p>"
        document.getElementById("total").textContent = "Total: $0.00";
        return;
    }
    carrito.forEach(p => {
        const div = document.createElement("div");
        div.innerHTML = `
            <img src="${p.image}" class="imagen-carrito">
            <p>${p.title} x${p.cantidad} - $${(p.price * p.cantidad).toFixed(2)}</p>
            <button class="eliminar" data-id="${p.id}">Eliminar</button><br><br>
        `;

        totalPrecio += p.price * p.cantidad;  

        // Aquí lo que está haciendo es que cuando le de click en el botón de eliminar se elimine el producto específico usando su id.
        div.querySelector(".eliminar").addEventListener("click", () => eliminarDelCarrito(p.id));
        carritoContenedor.appendChild(div);
    });
    document.getElementById("total").textContent = `Total: $${totalPrecio.toFixed(2)}`;
}

// Esta función lo que hace es eliminar producto del carrito
function eliminarDelCarrito(id) {
    //Esto lo que hace es recorrer todo el carrito p donde solo se van agregar los productos que tengan diferente id  y  no se agrege el producto que le dió a eliminar
    carrito = carrito.filter(p => p.id !== id);
    actualizarCarrito();
}

//Aquí hace un evento el cual cuando le de click al boton de vaciar carrito, va a eliminar todos los productos  y va a dejar vacio el contenedor, además reinicia el contador de carrito a 0 y lo guarda vacío en localStorage.
vaciarCarritoBtn.addEventListener("click", () => {
    carrito = [];
    actualizarCarrito();
});

//Esta función lo que va a hacer es actualizar  el carrito
//guarda el carrito en localStorage, actualiza el contador de productos y vuelve a renderizarlo.
function actualizarCarrito() {
    //Aqui lo que hace es convertir los productos del archivo a JSON y lo guarda en el localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    //Aquí lo que hace es calcular cuantos productos hay en el carrito y le suma la cantidad de los productos que hay
    let total = 0;
    carrito.forEach(p => total += p.cantidad);

    carritoCantidad.textContent = total;
    mostrarCarrito();
}

//Aquí lo que hace es  que en buscar hace un evento en cual cuando uno escriba va a buscar el producto que coincida con lo que está escribiendo
buscar.addEventListener("input", () => {
    const termino = buscar.value.toLowerCase();
    const filtrados = listaProductos.filter(p =>
        p.title.toLowerCase().includes(termino) || p.category.toLowerCase().includes(termino)
    );
    mostrarProductos(filtrados);
});

//Aquí lo que hace es que va a ordenar los producto con el que va a elegir ejemplo: si elijes precio: Menor a Mayor lo va a ordenar tal cual como pidió
ordenar.addEventListener("change", () => {
    const criterio = ordenar.value;
    let productosOrdenados = [...listaProductos];
    if (criterio === "precio-asce") {
        productosOrdenados.sort((a, b) => a.price - b.price);
    } else if (criterio === "precio-desc") {
        productosOrdenados.sort((a, b) => b.price - a.price);
    } else if (criterio === "titulo-asc") {
        productosOrdenados.sort((a, b) => a.title.localeCompare(b.title));
    } else if (criterio === "titulo-desc") {
        productosOrdenados.sort((a, b) => b.title.localeCompare(a.title));
    }
    mostrarProductos(productosOrdenados);
});

//Aqui lo que estoy haciendo es buscar los productos por su categoria, aplica un filtro según la categoría seleccionada en el <select>
categoria.addEventListener("change", ()=>{
    const criterioCategoria= categoria.value;
    let productosCategoria = [...listaProductos];

    if(criterioCategoria === "men's clothing"){
        productosCategoria = listaProductos.filter(p => p.category === criterioCategoria);
    }else if(criterioCategoria === "women's clothing"){
        productosCategoria = listaProductos.filter(p => p.category === criterioCategoria);
    }else if(criterioCategoria === "jewelery"){
        productosCategoria = listaProductos.filter(p => p.category === criterioCategoria);
    }else if(criterioCategoria === "electronics"){
        productosCategoria = listaProductos.filter(p => p.category === criterioCategoria);
    }else{
        productosCategoria = listaProductos;
    }
    mostrarProductos(productosCategoria)
})

//Aqui lo que hace es que con un evento cuando le de click en el botón con id "ver-carrito", abrimos el modal del carrit cambiando su display a "flex" (para hacerlo visible) y luego renderizamos su contenido actual llamando a mostrarCarrito().
document.getElementById("ver-carrito").addEventListener("click", () => {
    carritoModal.style.display = "flex";
    mostrarCarrito();
});

//Aqui lo que hace es que cuando le de click en el icono de salir el contenedor de todos los productos que tiene el carrito se va a cerrar el modal.
cerrarModal.addEventListener("click", () => {
    carritoModal.style.display = "none";
});

//Aquí lo que hace es que cuando le de click por fuera del contenedor del carrito se va a cerrar el modal.
window.addEventListener("click", (e) => {
    if (e.target === carritoModal) {
        carritoModal.style.display = "none";
    }
});

// Aquí llamamos la función para que se muestre los productos del API apenas cargue la página

    obtenerProductos();
    actualizarCarrito();


    