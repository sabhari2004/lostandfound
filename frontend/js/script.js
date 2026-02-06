function saveItem() {
    let item = document.getElementById("item").value;
    let location = document.getElementById("location").value;
    let desc = document.getElementById("desc").value;
    let uploaderEmail = document.getElementById("uploaderEmail").value; 
    let imageInput = document.getElementById("image");

    if (!item || !uploaderEmail || imageInput.files.length === 0) {
        alert("Please fill all fields and upload an image");
        return;
    }

    let reader = new FileReader();
    reader.onload = function () {
        let imageData = reader.result;
        let now = new Date();
        let dateString = now.toLocaleDateString() + " " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        let newItem = {
            id: Date.now(),
            item: item,
            location: location,
            desc: desc,
            image: imageData,
            uploaderEmail: uploaderEmail,
            date: dateString
        };

        // Get the current list from storage, or start a new array
        let itemList = JSON.parse(localStorage.getItem("foundItems")) || [];
        
        // Add the new item to the collection
        itemList.push(newItem);

        // Save the updated list back to localStorage
        localStorage.setItem("foundItems", JSON.stringify(itemList));

        alert("Item uploaded successfully!");
        window.location.href = "view.html";
    };
    reader.readAsDataURL(imageInput.files[0]);
}
function loginUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    // 1. Store the email to show it on the View page
    localStorage.setItem("userEmail", email);

    // 2. Check for Admin Credentials
    if (email === "rsnithyashree22bit071@gmail.com" && password === "Lf123") {
        localStorage.setItem("isAdmin", "true");
        alert("Logged in as Admin. Control features unlocked!");
    } else {
        localStorage.setItem("isAdmin", "false");
        alert("Logged in successfully as: " + email);
    }

    // 3. Redirect to the view page
    window.location.href = "view.html";
}
// Add a logout function to clear admin status
function logout() {
    localStorage.removeItem("isAdmin");
    window.location.href = "login.html";
}
function registerUser() {
    let name = document.getElementById("newName").value;
    let email = document.getElementById("newEmail").value;
    let pass = document.getElementById("newPassword").value;
    let confirmPass = document.getElementById("confirmPassword").value;

    if (!name || !email || !pass) {
        alert("Please fill in all fields");
        return;
    }

    if (pass !== confirmPass) {
        alert("Passwords do not match!");
        return;
    }

    // Create user object
    let newUser = {
        name: name,
        email: email,
        password: pass
    };

    // Get existing users or empty array
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        alert("This email is already registered!");
        return;
    }

    // Save user
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully! Please login.");
    window.location.href = "login.html";
}