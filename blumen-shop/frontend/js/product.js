const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

async function loadProduct() {

  if (!slug) {
    document.body.innerHTML = "<h2>Ошибка: slug товара не найден</h2>";
    return;
  }

  try {

    const res = await fetch(`/api/products/slug/${slug}`);
    const product = await res.json();

    console.log("PRODUCT:", product);

    document.getElementById("productTitle").textContent =
      product.title || "Без названия";

    document.getElementById("productPrice").textContent =
      (product.price || 0) + " ₸";

    document.getElementById("productDescription").textContent =
      product.description || "Описание отсутствует";

    if (product.images && product.images.length > 0) {
      document.getElementById("productImage").src = product.images[0];
    }

  } catch (err) {

    console.error(err);
    document.body.innerHTML = "<h2>Ошибка загрузки товара</h2>";

  }

}

loadProduct();