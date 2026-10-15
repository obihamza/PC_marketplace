async function loadComponent(selector, file) {
    const container = document.querySelector(selector);

    if (!container) {
        return;
    }

    try {
        const response = await fetch(`../components/${file}`);

        if (!response.ok) {
            throw new Error(`Failed to load ${file}: ${response.status}`);
        }

        container.innerHTML = await response.text();
    } catch (error) {
        console.error(`Could not load ${file}:`, error);
    }
}

async function loadComponents() {
    await Promise.all([
        loadComponent("#header-placeholder", "header.html"),
        loadComponent("#chatbot-placeholder", "chatbot.html"),
        loadComponent("#auth-placeholder", "auth.html"),
        loadComponent("#footer-placeholder", "footer.html"),
        loadComponent("#cart-placeholder", "cart.html")
    ]);

    document.dispatchEvent(new Event("componentsLoaded"));
}

loadComponents();
