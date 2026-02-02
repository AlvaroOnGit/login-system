const authForm = document.getElementById("authForm");
const toggleForm = document.getElementById("toggleForm");
const usernameGroup = document.getElementById("usernameGroup");
const usernameInput = document.getElementById("username");

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
class SubmitButtonHandler {

    static submitButton = document.querySelector(".submit-btn");
    static isWaiting = false;

    static #enableAfterDelay (delay) {
        setTimeout(() => {
            this.isWaiting = false;
            this.submitButton.classList.remove('inactive');
            this.submitButton.disabled = false;
        }, delay);
    }

    static disableSubmitButton () {
        this.isWaiting = true;
        this.submitButton.disabled = true;
        this.submitButton.classList.add('inactive');
    }
    static enableSubmitButton (status) {

        if ( status === "login-success" ||  status === "register-success" ) {
            this.#enableAfterDelay(1000);
        }
        else if ( status === "login-error" ||  status === "register-error" ) {
            this.#enableAfterDelay(3000);
        }
    }
}

let isLogin = true;

toggleForm.addEventListener("click", event => {

    event.preventDefault();

    isLogin = !isLogin;

    updateForm();
})

function updateForm() {

    if (!isLogin) {
        usernameGroup.classList.add('show');
        usernameInput.required = true;
        usernameInput.disabled = false;
    }
    else {
        usernameInput.value = "";
        usernameGroup.classList.remove('show');
        usernameInput.required = false;
        usernameInput.disabled = true;
    }

    document.querySelector(".form-title").textContent = isLogin ? "Iniciar Sesión" : "Crear Cuenta";
    SubmitButtonHandler.submitButton.textContent = isLogin ? "Iniciar Sesión" : "Registrarse";
    toggleForm.textContent = isLogin ? "¿No tienes cuenta? Regístrate" : "¿Tienes cuenta? Inicia Sesión";
}

authForm.addEventListener("submit", async event => {

    event.preventDefault();

    if (SubmitButtonHandler.isWaiting) return;

    SubmitButtonHandler.disableSubmitButton();

    const data = Object.fromEntries(new FormData(authForm));
    const jsonData = JSON.stringify(data);

    WarningHandler.hideWarnings();

    const status = await submitAuthForm(jsonData);

    SubmitButtonHandler.enableSubmitButton(status);
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
                return 'login-error';
            }

            window.location.replace('/');
            return 'login-success';

        } catch (e) {
            console.error(e);
            return 'login-error';
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
                        return 'register-error';
                    }
                    case "email-match": {
                        WarningHandler.emailWarning('Email already exists')
                        return 'register-error';
                    }
                    case "username-match": {
                        WarningHandler.usernameWarning('Username already exists')
                        return 'register-error';
                    }
                    default: {
                        return 'register-error';
                    }
                }
            }

            isLogin = !isLogin;

            updateForm();

            return 'register-success';

        } catch (e) {
            console.error(e);
            return 'register-error';
        }
    }
}