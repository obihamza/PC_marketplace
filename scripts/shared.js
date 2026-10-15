const cartStorageKey = "pcMarketCart";

function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Could not load cart:", error);
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    renderCart();
}

function addToCart(product) {
    if (!product || product.id === undefined) {
        return;
    }

    const cart = getCart();
    const existingItem = cart.find(item => String(item.id) === String(product.id));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            condition: product.condition,
            price: Number(product.price),
            image: product.image || "",
            quantity: 1
        });
    }

    saveCart(cart);
    showCart();
}

function removeFromCart(productId) {
    saveCart(getCart().filter(item => String(item.id) !== String(productId)));
}

function changeCartQuantity(productId, change) {
    const cart = getCart();
    const item = cart.find(product => String(product.id) === String(productId));

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        saveCart(cart.filter(product => String(product.id) !== String(productId)));
        return;
    }

    saveCart(cart);
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");

    if (!cartItems || !cartTotal) {
        return;
    }

    const cart = getCart();
    cartItems.replaceChildren();

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty";
        emptyMessage.textContent = "Your cart is empty.";
        cartItems.appendChild(emptyMessage);
    }

    let total = 0;
    let itemCount = 0;

    cart.forEach(item => {
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const price = Math.max(0, Number(item.price) || 0);
        total += price * quantity;
        itemCount += quantity;

        const row = document.createElement("article");
        row.className = "cart-item";

        const details = document.createElement("div");
        details.className = "cart-item-details";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const priceText = document.createElement("p");
        priceText.textContent = `${price.toFixed(2)} JOD each`;

        const quantityControls = document.createElement("div");
        quantityControls.className = "cart-quantity";

        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.dataset.cartAction = "decrease";
        decreaseButton.dataset.productId = item.id;
        decreaseButton.setAttribute("aria-label", `Decrease ${item.name} quantity`);
        decreaseButton.textContent = "−";

        const quantityText = document.createElement("span");
        quantityText.textContent = quantity;

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.dataset.cartAction = "increase";
        increaseButton.dataset.productId = item.id;
        increaseButton.setAttribute("aria-label", `Increase ${item.name} quantity`);
        increaseButton.textContent = "+";

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "cart-remove";
        removeButton.dataset.cartAction = "remove";
        removeButton.dataset.productId = item.id;
        removeButton.textContent = "Remove";

        quantityControls.append(decreaseButton, quantityText, increaseButton);
        details.append(name, priceText, quantityControls, removeButton);
        row.appendChild(details);
        cartItems.appendChild(row);
    });

    cartTotal.textContent = `${total.toFixed(2)} JOD`;

    if (cartCount) {
        cartCount.textContent = itemCount;
        cartCount.setAttribute("aria-label", `${itemCount} item${itemCount === 1 ? "" : "s"} in cart`);
    }
}

function showCart() {
    const shoppingCart = document.getElementById("shoppingCart");
    const cartOverlay = document.getElementById("cartOverlay");

    if (!shoppingCart || !cartOverlay) {
        return;
    }

    renderCart();
    shoppingCart.classList.add("active");
    cartOverlay.classList.add("active");
    shoppingCart.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
}

function closeCart() {
    document.getElementById("shoppingCart")?.classList.remove("active");
    document.getElementById("cartOverlay")?.classList.remove("active");
    document.getElementById("shoppingCart")?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
}

document.addEventListener("click", event => {
    if (!(event.target instanceof Element)) {
        return;
    }

    if (event.target.closest("#cartButton")) {
        showCart();
        return;
    }

    if (event.target.closest("#closeCart") || event.target.closest("#cartOverlay")) {
        closeCart();
        return;
    }

    const actionButton = event.target.closest("[data-cart-action]");

    if (!actionButton) {
        return;
    }

    const productId = actionButton.dataset.productId;
    const action = actionButton.dataset.cartAction;

    if (action === "increase") {
        changeCartQuantity(productId, 1);
    } else if (action === "decrease") {
        changeCartQuantity(productId, -1);
    } else if (action === "remove") {
        removeFromCart(productId);
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
    }
});

document.addEventListener("componentsLoaded", () => {
    renderCart();

    const profileButton = document.getElementById("profileButton");
    const authOverlay = document.getElementById("authOverlay");
    const authClose = document.getElementById("authClose");
    const authForm = document.getElementById("authForm");
    const authTitle = document.getElementById("authTitle");
    const authDescription = document.getElementById("authDescription");
    const authSubmit = document.getElementById("authSubmit");
    const authSwitch = document.getElementById("authSwitch");
    const authSwitchButton = document.getElementById("authSwitchButton");
    const nameField = document.getElementById("nameField");
    const guestButton = document.getElementById("guestButton");
    const authName = document.getElementById("authName");
    const password = document.getElementById("authPassword");
    const chatButton = document.querySelector(".dot");
    const chatPanel = document.getElementById("chatPanel");
    const chatClose = document.getElementById("chatClose");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");
    const chatForm = document.getElementById("chatForm");
    const checkoutButton = document.getElementById("checkoutButton");

    function displayPopUpLogin() {
        authOverlay?.style.setProperty("display", "flex");
    }

    function hidePopUpLogin() {
        authOverlay?.style.setProperty("display", "none");
    }

    function displayRegisterPopUp() {
        if (!authDescription || !authTitle || !authSubmit || !authSwitch || !authSwitchButton || !nameField || !authName || !authForm) {
            return;
        }

        authDescription.textContent = "Sign up to continue to marketplace.";
        authTitle.textContent = "Create an account";
        authSubmit.textContent = "Register";
        authSwitch.firstChild.textContent = "Already have an account? ";
        authSwitchButton.textContent = "Login";
        nameField.hidden = false;
        authName.required = true;

        if (document.getElementById("confirmPasswordField")) {
            return;
        }

        const confirmPasswordField = document.createElement("div");
        confirmPasswordField.className = "auth-field";
        confirmPasswordField.id = "confirmPasswordField";

        const label = document.createElement("label");
        label.htmlFor = "confirmPassword";
        label.textContent = "Confirm Password";

        const input = document.createElement("input");
        input.type = "password";
        input.id = "confirmPassword";
        input.placeholder = "Confirm your password";
        input.required = true;

        confirmPasswordField.append(label, input);
        authForm.insertBefore(confirmPasswordField, authSubmit);
    }

    function displayLoginPopUp() {
        if (!authDescription || !authTitle || !authSubmit || !authSwitch || !authSwitchButton || !nameField || !authName) {
            return;
        }

        authDescription.textContent = "Sign in to access your marketplace account.";
        authTitle.textContent = "Welcome to PC Market Jordan";
        nameField.hidden = true;
        authName.required = false;
        document.getElementById("confirmPasswordField")?.remove();
        authSubmit.textContent = "Login";
        authSwitch.firstChild.textContent = "Don't have an account? ";
        authSwitchButton.textContent = "Register";
    }

    function confirmPasswordValidation() {
        const confirmPassword = document.getElementById("confirmPassword");

        if (!confirmPassword || !password) {
            return;
        }

        confirmPassword.setCustomValidity(
            password.value !== confirmPassword.value ? "Passwords do not match." : ""
        );
    }

    function openChat() {
        chatPanel?.classList.add("open");
        document.body.classList.add("chat-open");
        chatPanel?.setAttribute("aria-hidden", "false");
    }

    function closeChat() {
        chatPanel?.classList.remove("open");
        document.body.classList.remove("chat-open");
        chatPanel?.setAttribute("aria-hidden", "true");
    }

    profileButton?.addEventListener("click", displayPopUpLogin);
    authClose?.addEventListener("click", hidePopUpLogin);
    guestButton?.addEventListener("click", hidePopUpLogin);

    authOverlay?.addEventListener("click", event => {
        if (event.target === authOverlay) {
            hidePopUpLogin();
        }
    });

    authSwitchButton?.addEventListener("click", () => {
        if (document.getElementById("confirmPasswordField")) {
            displayLoginPopUp();
        } else {
            displayRegisterPopUp();
        }
    });

    authForm?.addEventListener("submit", event => {
        event.preventDefault();

        if (document.getElementById("confirmPassword")) {
            confirmPasswordValidation();
        }

        if (!authForm.checkValidity()) {
            authForm.reportValidity();
        }
    });

    authForm?.addEventListener("input", event => {
        if (event.target.id === "authPassword" || event.target.id === "confirmPassword") {
            confirmPasswordValidation();
        }
    });
    chatButton?.addEventListener("click", openChat);
    chatClose?.addEventListener("click", closeChat);

    chatForm?.addEventListener("submit", event => {
        event.preventDefault();

        const message = chatInput?.value.trim();

        if (!message || !chatMessages || !chatInput) {
            return;
        }

        const userMessage = document.createElement("div");
        userMessage.className = "user-message";
        userMessage.textContent = message;
        chatMessages.appendChild(userMessage);
        chatInput.value = "";

        const waitingMessage = document.createElement("div");
        waitingMessage.className = "bot-message typing-indicator";
        waitingMessage.innerHTML = "<span></span><span></span><span></span>";
        chatMessages.appendChild(waitingMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            waitingMessage.remove();

            const botMessage = document.createElement("div");
            botMessage.className = "bot-message";
            botMessage.textContent = "I'm preparing to help you with PC hardware. AI responses will be connected soon.";
            chatMessages.appendChild(botMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    });

    checkoutButton?.addEventListener("click", () => {
        if (getCart().length === 0) {
            return;
        }
    });
});
