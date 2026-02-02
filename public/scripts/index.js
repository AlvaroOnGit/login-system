const logoutButton = document.getElementById("logoutBtn");

let userLogged = false;

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/api/auth/session", {
            credentials: "include",
        });

        if (!res.ok) {
            return;
        }

        userLogged = true;

        const userData = await res.json();

        document.getElementById("webTitle").textContent = `Hola, ${userData.user.username}!`;
        document.getElementById("loginBtn").hidden = true;
        logoutButton.hidden = false;
    }
    catch (e) {
        console.error(e)
    }
})

logoutButton.addEventListener("click", async () => {

    try {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
        })
        if (!res.ok) {
            console.error('Internal server error');
        }
        window.location = '/auth';
    }
    catch (e) {
        console.error(e)
    }
})