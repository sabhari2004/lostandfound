const API_BASE_URL = "http://localhost:8080/api";

// ===========================
// 1. REGISTER USER
// ===========================
async function registerUser() {
    console.log("Register button clicked!");

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

    const userData = {
        name: name,
        email: email,
        password: pass
    };

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
// 2. LOGIN USER
// ===========================
async function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    // Admin Check
    if (email === "rsnithyashree22bit071@gmail.com" && password === "Lf123") {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isAdmin", "true");
        alert("Logged in as Admin!");
        window.location.href = "view.html";
        return;
    }

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
// 4. UPLOAD ITEM (Corrected!)
// ===========================
function saveItem() {
    console.log("Upload button clicked!");

    // GET ELEMENTS SAFE CHECK
    const itemEl = document.getElementById("item");
    const uploaderEl = document.getElementById("uploaderEmail");
    const imageEl = document.getElementById("image");

    // If elements don't exist, stop (prevents error on other pages)
    if (!itemEl || !uploaderEl || !imageEl) return;

    const item = itemEl.value;
    const location = document.getElementById("location").value;
    const desc = document.getElementById("desc").value;
    const uploaderEmail = uploaderEl.value;

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
// 5. LOAD ITEMS
// ===========================
async function loadItems() {
    const container = document.getElementById("itemsContainer");
    if (!container) return;

    try {
        const response = await fetch(`${API_BASE_URL}/items`);
        const items = await response.json();

        container.innerHTML = "";

        if (items.length === 0) {
            container.innerHTML = "<p style='color:white; text-align:center;'>No items found.</p>";
            return;
        }

        items.forEach(item => {
            const card = `
                <div class="item-card" style="background:white; padding:15px; margin:10px; border-radius:10px; width:300px; display:inline-block; vertical-align:top;">
                    <img src="${item.image}" alt="Item" style="width:100%; height:200px; object-fit:cover; border-radius:5px;">
                    <h3 style="color:black;">${item.name}</h3>
                    <p style="color:black;"><strong>Location:</strong> ${item.location}</p>
                    <p style="color:black;"><strong>Description:</strong> ${item.description}</p>
                    <p style="color:gray;"><small>${item.date}</small></p>
                    <button style="background:green; color:white; padding:5px 10px; border:none; border-radius:3px; cursor:pointer;" onclick="alert('Contact: ${item.uploaderEmail}')">Contact Finder</button>
                </div>
            `;
            container.innerHTML += card;
        });

    } catch (error) {
        console.error("Error loading items:", error);
        container.innerHTML = "<p>Error loading items.</p>";
    }
}

// Run loadItems only if we are on the view page
if (window.location.pathname.endsWith("view.html")) {
    window.onload = loadItems;
}