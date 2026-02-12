// ===========================
// THEME SWITCHER LOGIC
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Check LocalStorage for saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    updateIcon(savedTheme);

    // 2. Attach Click Event to the Button
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const currentTheme = document.body.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";

            document.body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            updateIcon(newTheme);
        });
    }
});

function updateIcon(theme) {
    const btn = document.getElementById("themeToggle");
    if (btn) {
        // Uses innerHTML to render emojis correctly across all browsers
        btn.innerHTML = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
}

const API_BASE_URL = "http://localhost:8080/api";

// ===========================
// 0. UI HELPER: TOAST NOTIFICATIONS
// ===========================
function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    if (type === "error") {
        toast.style.borderLeft = "4px solid #ff4b2b";
    }

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ===========================
// 1. FILTER CATEGORY (The "Chips" Feature)
// ===========================
function filterCategory(category) {
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => chip.classList.remove('active'));

    // Ensure event target exists before adding class
    if (event && event.target) {
        event.target.classList.add('active');
    }

    const searchInput = document.getElementById("searchInput");

    if (category === 'all') {
        if (searchInput) searchInput.value = "";
        loadItems();
    } else {
        if (searchInput) {
            searchInput.value = category;
            searchItems();
        }
    }
}

// ===========================
// 2. RENDER ITEMS (With Animation Delays)
// ===========================
function renderItems(items) {
    const displayTarget = document.getElementById("itemDisplay");
    if (!displayTarget) return;

    const isAdmin = localStorage.getItem("isAdmin") === "true";
    displayTarget.innerHTML = "";

    if (items.length === 0) {
        displayTarget.innerHTML = "<p style='color:#ccc; text-align:center; grid-column: span 3; font-size:1.2rem;'>No items found matching that search.</p>";
        return;
    }

    items.forEach((item, index) => {
        let imageUrl = item.image ? item.image : 'images/default.jpg';
        let delay = index * 0.1;

        // Dynamic Card Template
        let card = `
            <div class="item-card" style="animation-delay: ${delay}s">
                <div style="overflow:hidden; height:200px;">
                    <img src="${imageUrl}" class="item-img" alt="${item.name}" style="width:100%; height:100%; object-fit:cover;">
                </div>

                <div class="card-content">
                    <span class="status-badge">AVAILABLE</span>

                    <h3 style="margin-top:15px; font-size:1.3rem;">${item.name}</h3>
                    <p style="font-size:0.9rem; margin-top:5px;">📍 ${item.location}</p>
                    <p style="font-size:0.9rem; margin-top:5px; line-height:1.4;">${item.description}</p>
                    <p style="font-size:11px; opacity:0.6; margin-top:10px;">Posted: ${item.date}</p>

                    <button class="submit-btn" style="margin-top:15px; padding:10px;" onclick="alert('Contact Owner: ${item.uploaderEmail}')">
                        Claim This Item
                    </button>
        `;

        if (isAdmin) {
            card += `
                <button onclick="deleteItem('${item.id}')" style="background: linear-gradient(45deg, #ff416c, #ff4b2b); margin-top:10px; padding:10px; width:100%; border:none; border-radius:10px; color:white; cursor:pointer;">
                    🗑️ Remove (Admin)
                </button>
            `;
        }

        card += `</div></div>`;
        displayTarget.innerHTML += card;
    });
}

// ===========================
// 3. CORE FUNCTIONS (Login, Upload, Search)
// ===========================
async function loadItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/items?t=${Date.now()}`);
        const items = await response.json();

        const countEl = document.getElementById("itemCount");
        if(countEl) countEl.innerText = `${items.length} items found`;

        renderItems(items);
    } catch (error) {
        console.error("Error loading items:", error);
    }
}

async function searchItems() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    const query = searchInput.value;
    if (!query) {
        loadItems();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/items/search?query=${query}`);
        const items = await response.json();
        renderItems(items);
    } catch (error) {
        console.error("Search Error:", error);
    }
}

async function registerUser() {
    const name = document.getElementById("newName")?.value;
    const email = document.getElementById("newEmail")?.value;
    const pass = document.getElementById("newPassword")?.value;
    const confirmPass = document.getElementById("confirmPassword")?.value;

    if (!name || !email || !pass) { showToast("Please fill in all fields", "error"); return; }
    if (pass !== confirmPass) { showToast("Passwords do not match!", "error"); return; }

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password: pass })
        });
        if (response.ok) {
            alert("Account created! Redirecting...");
            window.location.href = "login.html";
        } else { showToast("Registration Failed!", "error"); }
    } catch (e) { showToast("Backend Error", "error"); }
}

async function loginUser() {
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    if (!email || !password) { showToast("Fill all fields", "error"); return; }

    // Admin Bypass Credentials
    if (email === "rsnithyashree22bit071@gmail.com" && password === "Lf123") {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isAdmin", "true");
        window.location.href = "view.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const user = await response.json();
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("isAdmin", "false");
            window.location.href = "view.html";
        } else { showToast("Invalid Credentials", "error"); }
    } catch (e) { showToast("Login Error", "error"); }
}

function saveItem() {
    const itemEl = document.getElementById("item");
    const imgEl = document.getElementById("image");
    if (!itemEl || !imgEl.files[0]) { showToast("Missing info", "error"); return; }

    const reader = new FileReader();
    reader.onload = async function () {
        const payload = {
            name: itemEl.value,
            location: document.getElementById("location").value,
            description: document.getElementById("desc").value,
            uploaderEmail: document.getElementById("uploaderEmail").value,
            date: new Date().toLocaleString(),
            image: reader.result
        };
        try {
            await fetch(`${API_BASE_URL}/items/add`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            alert("Uploaded Successfully!");
            window.location.href = "view.html";
        } catch (e) { showToast("Upload Error", "error"); }
    };
    reader.readAsDataURL(imgEl.files[0]);
}

// ===========================
// 4. ADMIN ACTIONS
// ===========================
async function deleteItem(itemId) {
    if (!confirm("ADMIN: Delete this post?")) return;
    try {
        await fetch(`${API_BASE_URL}/items/delete/${itemId}`, { method: "DELETE" });
        showToast("Deleted!", "success");
        loadItems();
    } catch (e) { showToast("Delete Error", "error"); }
}

async function deleteAllItems() {
    const password = prompt("ADMIN CHECK: Enter password to WIPE DATA:");
    if (password !== "Lf123") { showToast("Wrong password!", "error"); return; }
    try {
        await fetch(`${API_BASE_URL}/items/deleteAll`, { method: "DELETE" });
        showToast("Database Wiped", "success");
        loadItems();
    } catch (e) { showToast("Error wiping DB", "error"); }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// ===========================
// 5. AUTO-RUN ON PAGE LOAD
// ===========================
window.onload = function() {
    // Admin features visibility
    if (localStorage.getItem("isAdmin") === "true") {
        const btn = document.getElementById("deleteAllBtn");
        if (btn) btn.style.display = "inline-block";
    }

    // Load items only if on the browse page
    if (window.location.pathname.endsWith("view.html")) {
        loadItems();
    }
};