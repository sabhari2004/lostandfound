const API_BASE_URL = "http://localhost:8080/api";

// ===========================
// 1. REGISTER USER
// ===========================
async function registerUser() {
    const name = document.getElementById("newName").value;
    const email = document.getElementById("newEmail").value;
    const pass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    if (!name || !email || !pass) {
        alert("Please fill in all fields");
        return;
    }

    if (pass !== confirmPass) {
        alert("Passwords do not match!");
        return;
    }

    const userData = { name: name, email: email, password: pass };

    try {
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            alert("Account created! Redirecting to login...");
            window.location.href = "login.html";
        } else {
            alert("Registration Failed! Email might exist.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Backend connection failed.");
    }
}

// ===========================
// 2. LOGIN USER (User & Admin)
// ===========================
async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    // --- ADMIN CHECK ---
    if (email === "rsnithyashree22bit071@gmail.com" && password === "Lf123") {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isAdmin", "true");
        alert("Logged in as Admin!");
        window.location.href = "view.html";
        return;
    }

    // --- NORMAL USER LOGIN ---
    const loginData = { email: email, password: password };

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const user = await response.json();
            localStorage.setItem("userEmail", user.email);
            localStorage.setItem("isAdmin", "false");
            alert("Login Successful!");
            window.location.href = "view.html";
        } else {
            alert("Invalid Email or Password!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Login Error. Check Backend.");
    }
}

// ===========================
// 3. LOGOUT
// ===========================
function logout() {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userEmail");
    window.location.href = "login.html";
}

// ===========================
// 4. UPLOAD ITEM
// ===========================
function saveItem() {
    // Safety Check: Only run on upload page
    const itemEl = document.getElementById("item");
    if (!itemEl) return;

    const item = itemEl.value;
    const location = document.getElementById("location").value;
    const desc = document.getElementById("desc").value;
    const uploaderEmail = document.getElementById("uploaderEmail").value;
    const imageEl = document.getElementById("image");

    if (!item || !uploaderEmail || imageEl.files.length === 0) {
        alert("Please fill all fields and upload an image");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function () {
        const base64Image = reader.result;
        const now = new Date();
        const dateString = now.toLocaleDateString() + " " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const newItem = {
            name: item,
            location: location,
            description: desc,
            uploaderEmail: uploaderEmail,
            date: dateString,
            image: base64Image
        };

        try {
            const response = await fetch(`${API_BASE_URL}/items/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });

            if (response.ok) {
                alert("Item uploaded successfully!");
                window.location.href = "view.html";
            } else {
                alert("Upload Failed!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Backend connection failed.");
        }
    };
    reader.readAsDataURL(imageEl.files[0]);
}

// ===========================
// 5. RENDER ITEMS (Handles Display & Admin Buttons)
// ===========================
function renderItems(items) {
    const displayTarget = document.getElementById("itemDisplay") || document.getElementById("itemsContainer");
    if (!displayTarget) return;

    const isAdmin = localStorage.getItem("isAdmin") === "true";

    displayTarget.innerHTML = ""; // Clear list

    if (items.length === 0) {
        displayTarget.innerHTML = "<p style='color:white; text-align:center;'>No items found.</p>";
        return;
    }

    items.forEach(item => {
        let imageUrl = item.image ? item.image : 'images/default.jpg';

        let card = `
            <div class="item-card" style="background:black; padding:20px; border-radius:15px; width:320px; margin:10px; color:white; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
                <span class="status-badge" style="background:lightskyblue; padding:6px 14px; border-radius:20px; font-size:12px; font-weight:bold; color:white;">Available</span>
                <br><br>
                <img src="${imageUrl}" style="width:100%; height:200px; object-fit:cover; border-radius:10px; margin-bottom:10px;">
                <p><strong>Item:</strong> ${item.name}</p>
                <p><strong>Location:</strong> ${item.location}</p>
                <p><strong>Description:</strong> ${item.description}</p>
                <p style="font-size:12px; color:gray;">Posted: ${item.date}</p>

                <button onclick="alert('Contact Owner: ${item.uploaderEmail}')"
                        style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%; margin-top:10px; font-weight: bold;">
                    Claim Item & Say Thanks
                </button>
        `;

        // --- ADMIN ONLY: DELETE BUTTON ---
        if (isAdmin) {
            card += `
                <button onclick="deleteItem('${item.id}')"
                        style="background: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%; margin-top:10px; font-weight: bold;">
                    🗑️ Delete Post (Admin)
                </button>
            `;
        }

        card += `</div>`; // Close card div
        displayTarget.innerHTML += card;
    });
}

// ===========================
// 6. LOAD & SEARCH
// ===========================
async function loadItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/items?t=${Date.now()}`);
        const items = await response.json();

        const countEl = document.getElementById("itemCount");
        if(countEl) countEl.innerText = `Total Items: ${items.length}`;

        renderItems(items);
    } catch (error) {
        console.error("Error loading items:", error);
    }
}

async function searchItems() {
    const query = document.getElementById("searchInput").value;
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

// ===========================
// 7. ADMIN ACTIONS (Delete)
// ===========================
async function deleteItem(itemId) {
    if (!confirm("ADMIN: Are you sure you want to delete this post?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/items/delete/${itemId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Item deleted successfully!");
            loadItems(); // Refresh list immediately
        } else {
            alert("Failed to delete item.");
        }
    } catch (error) {
        console.error("Delete Error:", error);
    }
}

async function deleteAllItems() {
    const password = prompt("ADMIN SECURITY CHECK:\nEnter password to WIPE ALL DATA:");

    if (password !== "Lf123") {
        alert("Wrong password!");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/items/deleteAll`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("DATABASE WIPED: All items deleted.");
            loadItems();
        }
    } catch (error) {
        console.error("Delete All Error:", error);
    }
}

// ===========================
// 8. AUTO-RUN (On Page Load)
// ===========================
if (window.location.pathname.endsWith("view.html")) {
    window.onload = function() {
        const userEmail = localStorage.getItem("userEmail");
        const isAdmin = localStorage.getItem("isAdmin") === "true";

        if (userEmail && document.getElementById("welcomeText")) {
            document.getElementById("welcomeText").innerText = "Logged in as: " + userEmail;
        }

        // Show Admin UI elements
        if (isAdmin) {
            const adminBadge = document.getElementById("adminStatus");
            const deleteAllBtn = document.getElementById("deleteAllBtn");
            if (adminBadge) adminBadge.style.display = "inline";
            if (deleteAllBtn) deleteAllBtn.style.display = "inline-block";
        }

        loadItems(); // Load data from DB
    };
}