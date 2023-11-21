const realTimeProducts = document.querySelector("#realTimeProducts");

// @ts-ignore
const socket = io({
  // HANDSHAKE Need to configure inside of IO the server to wich to connect. Not necessary here as same device
  //auth:{user}
});

socket.on("api-product-post", (addedProduct) => {
  // @ts-ignore
  Swal.fire({
    text: `${addedProduct.title} was added`,
    toast: "true",
    position: "top-right",
  });
});

socket.on("products", (prod) => {
  //Do something when receive message
  if (realTimeProducts) {
    realTimeProducts.innerHTML = ``;
    prod.map((data) => {
      const container = document.createElement("div");
      container.innerHTML = `
      <div class="lg:w-1/4 md:w-1/2 p-4 w-full">
        <a class="block relative h-48 rounded overflow-hidden" href="product/${data.id}">
          <img alt="ecommerce" class="object-cover object-center w-full h-full block" src="${data.thumbnail[0]}">
        </a>
        <div class="mt-4">
          <h3 class="text-gray-500 text-xs tracking-widest title-font mb-1">${data.category}</h3>
          <h2 class="text-gray-900 title-font text-lg font-medium">${data.title}</h2>
          <p class="mt-1">${data.price}</p>
        </div>
      </div>
      `;
      realTimeProducts.append(container);
    })
  }
});