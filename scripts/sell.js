const sellForm = document.getElementById("sellForm");
const formMessage = document.getElementById("formMessage");

sellForm?.addEventListener("submit", event => {
    event.preventDefault();

    const product = {
        id: Date.now(),
        name: document.getElementById("productName").value.trim(),
        category: document.getElementById("productCategory").value,
        condition: document.getElementById("productCondition").value,
        price: Number(document.getElementById("productPrice").value),
        description: document.getElementById("productDescription").value.trim(),
        image: document.getElementById("productImage").value.trim()
    };

    if (
        !product.name ||
        !product.category ||
        !product.condition ||
        !product.description ||
        !product.price ||
        product.price <= 0
    ) {
        formMessage.textContent = "Please enter valid product details.";
        return;
    }

    try {
        const storedProducts = JSON.parse(localStorage.getItem("pcMarketProducts") || "[]");
        const products = Array.isArray(storedProducts) ? storedProducts : [];
        products.push(product);

        localStorage.setItem("pcMarketProducts", JSON.stringify(products));
        sellForm.reset();
        formMessage.textContent = "Product added successfully! You can now view it in the marketplace.";
    } catch (error) {
        formMessage.textContent = "Could not save the product. Please try again.";
        console.error("Product saving failed:", error);
    }
});
