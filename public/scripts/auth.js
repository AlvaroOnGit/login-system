const authForm = document.getElementById("authForm");
const toggleForm = document.getElementById("toggleForm");
const submitButton = document.querySelector(".submit-btn");

class WarningHandler {

    static password = document.getElementById("passwordWarning");
    static username = document.getElementById("usernameWarning");
    static email = document.getElementById("emailWarning");

    static passwordWarning (message) {
        this.password.textContent = message;
        this.password.hidden = false;
    }
    static usernameWarning (message) {
        this.username.textContent = message;
        this.username.hidden = false;
    }
    static emailWarning (message) {
        this.email.textContent = message;
        this.email.hidden = false;
    }
    static hideWarnings () {

        const warnings = [this.username, this.password, this.email];

        warnings.forEach((warning) => {
            warning.hidden = true;
        })
    }
}

let isLogin = true;
let isWaiting = false;

toggleForm.addEventListener("click", event => {

    event.preventDefault();

    isLogin = !isLogin;

    updateForm();
})

function updateForm() {

    const usernameGroup = document.getElementById("usernameGroup");

    if (!isLogin) {
        usernameGroup.classList.add('show');
        usernameGroup.required = true;
        usernameGroup.disabled = false;
    }
    else {
        document.getElementById("username").value = "";
        usernameGroup.classList.remove('show');
        usernameGroup.required = false;
        usernameGroup.disabled = true;
    }

    document.querySelector(".form-title").textContent = isLogin ? "Iniciar Sesión" : "Crear Cuenta";
    submitButton.textContent = isLogin ? "Iniciar Sesión" : "Registrarse";
    toggleForm.textContent = isLogin ? "¿No tienes cuenta? Regístrate" : "¿Tienes cuenta? Inicia Sesión";
}

authForm.addEventListener("submit", async event => {

    event.preventDefault();

    if (isWaiting) return;

    isWaiting = true;
    submitButton.disabled = true;
    submitButton.classList.add('inactive');

    const formData = new FormData(authForm);

    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
    }

    const jsonData = JSON.stringify(data);

    WarningHandler.hideWarnings();

    const success = await submitAuthForm(jsonData);

    if (!success) {
        setTimeout(() => {
            isWaiting = false;
            submitButton.classList.remove('inactive');
            submitButton.disabled = false;
        }, 3000);
    }
})

async function submitAuthForm(jsonData) {

    if (isLogin) {
        try{
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: jsonData,
            })

            if (!res.ok) {
                WarningHandler.passwordWarning('Invalid credentials');
                return false;
            }

            window.location.replace('/');

        } catch (e) {
            console.error(e);
        }
    }
    else {
        try{
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: jsonData,
            })

            const data = await res.json();

            if (!res.ok) {
                switch (data.message) {
                    case "username-email-match": {
                        WarningHandler.usernameWarning('Username already exists')
                        WarningHandler.emailWarning('Email already exists')
                        return;
                    }
                    case "email-match": {
                        WarningHandler.emailWarning('Email already exists')
                        return;
                    }
                    case "username-match": {
                        WarningHandler.usernameWarning('Username already exists')
                        return;
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
}