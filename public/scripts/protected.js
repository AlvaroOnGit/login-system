const logoutButton = document.getElementById('logoutBtn');

logoutButton.addEventListener('click', async e => {

    try {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
        })
        if (!res.ok) {
            console.error('Internal server error');
        }
        window.location.replace('/');
    }
    catch (e) {
        console.error(e)
    }
})