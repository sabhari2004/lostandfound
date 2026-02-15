const API_BASE_URL = "http://localhost:8080/api";

// ===========================
// 0. THEME SWITCHER LOGIC (Preserved)
// ===========================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Check LocalStorage for saved theme
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
    updateIcon(savedTheme);

    // 2. Attach Click Event to the Button
    const themeBtn = document.querySelector(".theme-btn");
    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const currentTheme = document.body.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";

            document.body.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            updateIcon(newTheme);
        });
    }

    // 3. ADMIN CHECK (New)
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if(isAdmin) {
        document.body.classList.add("admin-mode");
    }

    // NEW: Check Login State to show Profile
    checkLoginState();

    // Auto-load items if on view page
    if (document.getElementById("itemDisplay")) {
        loadItems();
    }

    // NEW: Auto-fill Email and make read-only on Upload Page
    if (window.location.pathname.includes("upload.html")) {
        const storedEmail = localStorage.getItem("userEmail");
        const emailField = document.getElementById("uploaderEmail");
        if (storedEmail && emailField) {
            emailField.value = storedEmail;
            emailField.readOnly = true;
        }
    }
});

function updateIcon(theme) {
    const btn = document.querySelector(".theme-btn i");
    if (btn) {
        btn.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
}

// ===========================
// 1. ADMIN ACTIONS
// ===========================
async function deleteItem(itemId) {
    if (!confirm("⚠️ ADMIN ACTION:\nAre you sure you want to PERMANENTLY delete this post?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/items/delete/${itemId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            showToast("✅ Item Deleted Successfully!", "success");
            loadItems();
        } else {
            showToast("❌ Failed to delete item.", "error");
        }
    } catch (error) {
        console.error("Delete Error:", error);
        showToast("❌ Server Error.", "error");
    }
}

// ===========================
// 2. UI HELPER: TOAST NOTIFICATIONS
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
        toast.style.borderLeft = "5px solid #ff4757";
    } else {
        toast.style.borderLeft = "5px solid #2ed573";
    }

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ===========================
// 3. FILTER & SEARCH
// ===========================
async function searchItems() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    try {
        const response = await fetch(`${API_BASE_URL}/items/search?query=${query}`);
        const items = await response.json();
        renderItems(items);
    } catch (error) {
        loadItems();
    }
}

async function filterItems(filterType) {
    const chips = document.querySelectorAll('.chip');
    chips.forEach(c => c.classList.remove('active'));
    if(event && event.target) event.target.classList.add('active');

    try {
        const response = await fetch(`${API_BASE_URL}/items/filter?${filterType === 'LOST' || filterType === 'FOUND' ? 'status=' + filterType : 'location=' + filterType}`);

        if(filterType === 'ALL') {
             loadItems();
             return;
        }

        const items = await response.json();
        renderItems(items);
    } catch (error) {
        console.error("Filter error:", error);
        loadItems();
    }
}

// ===========================
// 4. RENDER ITEMS
// ===========================
function renderItems(items) {
    const displayTarget = document.getElementById("itemDisplay");
    if (!displayTarget) return;

    displayTarget.innerHTML = "";
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (items.length === 0) {
        displayTarget.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: var(--secondary-text); font-size: 1.1rem;'>No items found matching your criteria.</p>";
        return;
    }

    items.forEach((item, index) => {
        let imageUrl = item.image ? item.image : 'https://via.placeholder.com/300x200?text=No+Image';
        let delay = index * 0.1;
        let statusText = item.status || "REPORT";
        let statusColor = statusText === "LOST" ? "#ff4757" : "#2ed573";
        let statusBg = statusText === "LOST" ? "rgba(255, 71, 87, 0.1)" : "rgba(46, 213, 115, 0.1)";
        const itemSafe = encodeURIComponent(JSON.stringify(item));

        let cardHTML = `
            <div class="item-card" style="animation-delay: ${delay}s">
                <div style="height: 200px; overflow: hidden; position: relative; cursor: pointer;" onclick="openItemModal('${itemSafe}')">
                    <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover;">
                    ${isAdmin ? `
                    <button onclick="event.stopPropagation(); deleteItem('${item.id}')"
                            style="position: absolute; top: 10px; right: 10px; background: #ff4757; color: white; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.8rem; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: 0.3s;">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </div>
                <div class="card-content" onclick="openItemModal('${itemSafe}')" style="cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span class="status-badge" style="color: ${statusColor}; background: ${statusBg}; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 700;">
                            ${statusText}
                        </span>
                        <small style="color: var(--secondary-text); font-size: 0.8rem;">${item.date ? item.date.split(',')[0] : 'Recently'}</small>
                    </div>
                    <h3 style="margin-bottom: 5px; font-size: 1.2rem;">${item.name}</h3>
                    <p style="margin-bottom: 8px; color: var(--secondary-text); font-size: 0.9rem;">
                        <i class="fas fa-map-marker-alt" style="color: #0061ff; margin-right: 5px;"></i> ${item.location}
                    </p>
                    <p style="font-size: 0.9rem; line-height: 1.5; margin-bottom: 15px; color: var(--text-color);">${item.description}</p>
                    <button class="submit-btn" style="width: 100%; padding: 10px; border-radius: 8px;">View Details</button>
                </div>
            </div>
        `;
        displayTarget.innerHTML += cardHTML;
    });
}

// ===========================
// 5. LOAD ITEMS
// ===========================
async function loadItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/items`);
        const items = await response.json();
        renderItems(items);
    } catch (error) {
        console.error("Error loading items:", error);
        showToast("Failed to load items. Is backend running?", "error");
    }
}

// ===========================
// 6. UPLOAD ITEM
// ===========================
async function saveItem() {
    const itemIn = document.getElementById("item");
    const statusIn = document.getElementById("status");
    const locationIn = document.getElementById("location");
    const imgIn = document.getElementById("image");

    if(!itemIn.value || !locationIn.value || !statusIn.value) {
        showToast("Please fill all required fields!", "error");
        return;
    }

    const reader = new FileReader();
    if (!imgIn.files[0]) {
         submitData(itemIn.value, statusIn.value, locationIn.value, null);
         return;
    }

    reader.onload = async () => {
        submitData(itemIn.value, statusIn.value, locationIn.value, reader.result);
    };
    reader.readAsDataURL(imgIn.files[0]);
}

async function submitData(name, status, location, image) {
    const payload = {
        name: name,
        status: status,
        location: location,
        description: document.getElementById("desc").value,
        uploaderEmail: document.getElementById("uploaderEmail").value,
        date: new Date().toLocaleString(),
        image: image
    };

    try {
        await fetch(`${API_BASE_URL}/items/add`, {
            method: "POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(payload)
        });
        showToast("Report Submitted Successfully!");
        setTimeout(() => window.location.href = "view.html", 1500);
    } catch (error) {
        console.error("Error:", error);
        showToast("Failed to submit report.", "error");
    }
}

// ===========================
// 7. UPDATED: MONGODB LOGIN LOGIC
// ===========================
async function loginUser() {
    const email = document.getElementById("email").value;
    const passwordInput = document.getElementById("password");
    const passwordError = document.getElementById("passwordError");

    // 1. Reset visuals before trying again
    passwordError.style.display = "none";
    passwordInput.classList.remove("input-error");

    if (!email || !passwordInput.value) {
        showToast("Please enter both fields", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password: passwordInput.value })
        });

        if (response.ok) {
            const userData = await response.json();
            localStorage.setItem("userEmail", userData.email);
            localStorage.setItem("userName", userData.name);
            localStorage.setItem("isAdmin", userData.role === "ADMIN" ? "true" : "false");

            showToast(`Welcome back, ${userData.name}!`);
            setTimeout(() => window.location.href = "view.html", 1000);
        } else {
            // 2. Google-style Red Highlight
            passwordError.style.display = "block";
            passwordInput.classList.add("input-error");
            passwordInput.value = "";
            passwordInput.focus();
        }
    } catch (e) {
        showToast("Server connection failed.", "error");
    }
}

// 3. Clear the red highlight as soon as they start typing
document.getElementById("password").addEventListener("input", function() {
    this.classList.remove("input-error");
    document.getElementById("passwordError").style.display = "none";
});

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

// ===========================
// 8. PROFILE & MODAL CONTROLS
// ===========================

function checkLoginState() {
    const authLink = document.getElementById("authLink");
    const userEmail = localStorage.getItem("userEmail");
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (authLink && userEmail) {
        authLink.innerHTML = `<i class="fas fa-user-circle"></i> Profile`;
        authLink.href = "#";
        authLink.classList.add("nav-profile");

        authLink.onclick = (e) => {
            e.preventDefault();
            openProfile();
        };

        const deleteAllBtn = document.getElementById("deleteAllBtn");
        if (isAdmin && deleteAllBtn) {
            deleteAllBtn.style.display = "flex";
        }
    }
}

function openProfile() {
    const email = localStorage.getItem("userEmail") || "user@kct.ac.in";
    const name = localStorage.getItem("userName") || "KCT Student";
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const profileModal = document.getElementById("profileModal");
    if(!profileModal) return;

    document.getElementById("profileEmail").innerText = email;

    // ✅ Use real name from MongoDB
    if (isAdmin) {
        document.getElementById("profileName").innerText = "ADMIN PORTAL";
    } else {
        document.getElementById("profileName").innerText = name.toUpperCase();
    }

    profileModal.classList.add("active");
}

function closeProfile(event) {
    if (event.target.classList.contains("modal-overlay")) {
        document.getElementById("profileModal").classList.remove("active");
    }
}

function closeProfileManual() {
    document.getElementById("profileModal").classList.remove("active");
}

function openItemModal(itemEncoded) {
    const item = JSON.parse(decodeURIComponent(itemEncoded));
    const modal = document.getElementById("itemModal");
    if(!modal) return;

    document.getElementById("modalImg").src = item.image || 'https://via.placeholder.com/300x200?text=No+Image';
    document.getElementById("modalTitle").innerText = item.name;
    document.getElementById("modalLocation").innerText = item.location;
    document.getElementById("modalDesc").innerText = item.description || "No description provided.";

    const statusEl = document.getElementById("modalStatus");
    if (statusEl) {
        statusEl.innerText = item.status || "REPORT";
        statusEl.style.color = item.status === "LOST" ? "#ff4757" : "#2ed573";
    }

    const contactBtn = document.getElementById("modalContact");
    contactBtn.href = `mailto:${item.uploaderEmail}?subject=Regarding ${item.name}`;

    modal.classList.add("active");
}

function closeModal(event) {
    if (event.target.classList.contains("modal-overlay") || event.target.classList.contains("close-modal")) {
        document.getElementById("itemModal").classList.remove("active");
    }
}

// ===========================
// 9. GLOBAL ADMIN ACTIONS
// ===========================
async function deleteAllItems() {
    if (!confirm("🚨 WARNING: This will permanently delete EVERY report in the database. Continue?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/items/delete-all`, { method: "DELETE" });
        if (response.ok) {
            showToast("🧹 Database Cleared Successfully!");
            loadItems();
            closeProfileManual();
        } else {
            showToast("❌ Failed to clear database.", "error");
        }
    } catch (error) {
        console.error("Delete All Error:", error);
        showToast("❌ Server Error.", "error");
    }
}