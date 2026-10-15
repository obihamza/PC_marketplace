const categories = document.querySelectorAll(".category");
const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const conditionFilter = document.getElementById("conditionFilter");
const priceFilter = document.getElementById("priceFilter");
const resultsCount = document.getElementById("resultsCount");
const noResults = document.getElementById("noResults");
const storageKey = "pcMarketProducts";

const sampleProducts = [
    {
        id: 1,
        name: "Intel Core i5-12400F",
        category: "cpu",
        condition: "used",
        price: 120,
        description: "A used Intel Core i5 processor.",
        image: ""
    },
    {
        id: 2,
        name: "RTX 3060 12GB",
        category: "gpu",
        condition: "used",
        price: 250,
        description: "A used graphics card.",
        image: ""
    },
    {
        id: 3,
        name: "16GB DDR4 RAM",
        category: "ram",
        condition: "new",
        price: 45,
        description: "New 16GB DDR4 memory.",
        image: ""
    },
    {
        id: 4,
        name: "1TB NVMe SSD",
        category: "storage",
        condition: "new",
        price: 65,
        description: "A new 1TB NVMe SSD.",
        image: ""
    },
    {
        id: 5,
        name: "RTX 4070 SUPER",
        category: "gpu",
        condition: "new",
        price: 550,
        description: "A new graphics card.",
        image: ""
    },
    {
        id: 6,
        name: "650W Power Supply",
        category: "other",
        condition: "used",
        price: 30,
        description: "A used 650W power supply.",
        image: ""
    }
];

let selectedCategory = "all";
let allProducts = [];

function getProducts() {
    try {
        const savedProducts = localStorage.getItem(storageKey);

        if (savedProducts === null) {
            localStorage.setItem(storageKey, JSON.stringify(sampleProducts));
            return [...sampleProducts];
        }

        const products = JSON.parse(savedProducts);
        return Array.isArray(products) ? products : [];
    } catch (error) {
        console.error("Could not load products:", error);
        return [];
    }
}

function renderProducts(products) {

    productsGrid.replaceChildren();

    products.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const productImage = document.createElement("div");
        productImage.className = "product-image";

        if (product.image) {
            const image = document.createElement("img");
            image.src = product.image;
            image.alt = product.name;
            image.loading = "lazy";

            image.addEventListener("error", () => {
                image.remove();
                productImage.textContent = String(product.category || "PC").toUpperCase();
            }, { once: true });

            productImage.appendChild(image);
        } else {
            productImage.textContent = String(product.category || "PC").toUpperCase();
        }

        const info = document.createElement("div");
        info.className = "product-info";

        const name = document.createElement("h3");
        name.textContent = product.name;

        const condition = document.createElement("p");
        condition.textContent = `Condition: ${product.condition}`;

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = `${Number(product.price).toFixed(2)} JOD`;

        const description = document.createElement("p");
        description.textContent = product.description;

        const addItem = document.createElement("button");
        addItem.type = "button";
        addItem.className = "add-item";
        addItem.setAttribute("aria-label", `Add ${product.name} to cart`);
        addItem.innerHTML = '<span class="material-symbols-rounded">add_shopping_cart</span>';
        addItem.addEventListener("click", () => addToCart(product));

        info.append(name, condition, price, description, addItem);
        card.append(productImage, info);
        productsGrid.appendChild(card);
    });
}

function filterProducts() {
    if (!searchInput || !conditionFilter || !priceFilter || !resultsCount || !noResults) {
        return;
    }

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCondition = conditionFilter.value;
    const maxPrice = priceFilter.value;

    const filteredProducts = allProducts.filter(product => {
        const matchesCategory =
            selectedCategory === "all" || product.category === selectedCategory;
        const matchesSearch =
            product.name.toLowerCase().includes(searchText);
        const matchesCondition =
            selectedCondition === "all" || product.condition === selectedCondition;
        const matchesPrice =
            maxPrice === "" || product.price <= Number(maxPrice);

        return matchesCategory && matchesSearch && matchesCondition && matchesPrice;
    });

    renderProducts(filteredProducts);
    resultsCount.textContent = `${filteredProducts.length} product(s) found`;
    noResults.hidden = filteredProducts.length !== 0;
}

categories.forEach(button => {
    button.addEventListener("click", () => {
        categories.forEach(category => category.classList.remove("active"));
        button.classList.add("active");
        selectedCategory = button.dataset.category || "all";
        filterProducts();
    });
});

searchInput?.addEventListener("input", filterProducts);
conditionFilter?.addEventListener("change", filterProducts);
priceFilter?.addEventListener("input", filterProducts);

allProducts = getProducts();
filterProducts();

window.addEventListener("storage", event => {
    if (event.key === storageKey) {
        allProducts = getProducts();
        filterProducts();
    }
});
