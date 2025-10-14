const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
  // get the closest article lement to our button, which is the product item's container tag
  const productElement = btn.closest("article");

  fetch("/admin/product/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      if (data.success === true) {
        // Removes the product element from the page
        // get the parent element of product item, tells to remove a child of it's, by passing our current productElement
        productElement.parentNode.removeChild(productElement);
      } else {
        console.error(data.error);
      }
    })
    .catch((err) => console.error(err));
};
