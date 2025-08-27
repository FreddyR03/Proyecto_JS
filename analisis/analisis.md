# Análisis de Diseño - Fake Store

## Descripción del Proyecto
Este proyecto es una tienda online desarrollada con **HTML, CSS y JavaScript**.  
Consume los productos desde la **Fake Store API** y permite al usuario buscar, filtrar, ordenar y añadir artículos a un carrito de compras.  
Además, integra un sistema de **login/registro** con gestión de usuarios mediante `sessionStorage`.

---

## Decisiones de Diseño de Interfaz y Experiencia de Usuario

### Interfaz y Layout
- **Header Sticky** con logo, barra de búsqueda y acceso rápido al carrito.
- **Grid de productos** en tarjetas con imagen, título, precio y botón de compra.
- **Colores intuitivos**:
  - Verde → acciones positivas (agregar)
  - Rojo → eliminar
  - Azul/Naranja → botones principales
- **Carrito en modal** para revisar o vaciar sin perder el contexto.

### Experiencia de Usuario (UX)
- **SweetAlert2** para notificaciones modernas y claras.
- **Feedback inmediato** al agregar/eliminar productos o iniciar sesión.
- **Responsive design** con media queries que adaptan la vista en portátiles, tablets y móviles.
- **Flujo de login sencillo**: si el usuario no existe se registra, si existe se valida la contraseña.

---

## Estructura de Datos

### Representación del Carrito
```javascript
carrito = [
  {
    id: 1,
    title: "Producto X",
    price: 29.99,
    image: "url/img.jpg",
    category: "electronics",
    cantidad: 2
  }
];
```

**Ventajas:**
- Contiene toda la información necesaria del producto.
- Facilita el cálculo del total (`price × cantidad`).
- Se serializa fácilmente con JSON para `localStorage`.

### Almacenamiento de Productos
```javascript
let listaProductos = [];  // Se llena con los datos del API al inicio
```
- Una sola llamada `fetch` al cargar la página.
- Filtros y ordenamientos se hacen en memoria → más rápidos.

### Autenticación
```javascript
let users = JSON.parse(sessionStorage.getItem("users")) || {};
users[email] = password;
```
- Manejado con `sessionStorage` (persistencia solo durante la sesión).
- Flujo simple de registro/inicio de sesión.
- Feedback visual con SweetAlert2.

---

## Filtros y Ordenamientos

### Búsqueda en Tiempo Real
```javascript
buscar.addEventListener("input", () => {
  const termino = buscar.value.toLowerCase();
  const filtrados = listaProductos.filter(p =>
    p.title.toLowerCase().includes(termino) ||
    p.category.toLowerCase().includes(termino)
  );
  mostrarProductos(filtrados);
});
```
- Se actualiza mientras el usuario escribe.
- Busca tanto en **título** como en **categoría**.
- No distingue mayúsculas/minúsculas → tolerante a errores.

### Filtros por Categoría
```javascript
productosCategoria = listaProductos.filter(p => p.category === criterioCategoria);
```
- Permite explorar por secciones (ej: ropa, electrónica).
- La opción **"all"** muestra nuevamente todo el catálogo.

### Ordenamientos
```javascript
// Por precio
productosOrdenados.sort((a, b) => a.price - b.price);

// Por nombre
productosOrdenados.sort((a, b) => a.title.localeCompare(b.title));
```
- **Precio ascendente**: útil para presupuestos limitados.  
- **Precio descendente**: enfocado en productos premium.  
- **Nombre (A-Z / Z-A)**: búsqueda rápida cuando se conoce el producto.

**Justificación de Usabilidad**:
- Se adaptan a distintos tipos de usuarios y necesidades.
- Siguen patrones estándar de tiendas online.
- Permiten exploración rápida y eficiente.

---





