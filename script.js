const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (!input || !icon) return;

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function showMessage(elementId, text, type) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.textContent = text;
    element.className = `message show ${type}`;
}

function clearMessage(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.textContent = '';
    element.className = 'message';
}

function saveUser(userData) {
    localStorage.setItem(userData.email, JSON.stringify(userData));
}

function getUserByEmail(email) {
    const data = localStorage.getItem(email);
    return data ? JSON.parse(data) : null;
}

function setCurrentSession(email) {
    sessionStorage.setItem('currentUserEmail', email);
}

function getCurrentSession() {
    return sessionStorage.getItem('currentUserEmail');
}

function clearCurrentSession() {
    sessionStorage.removeItem('currentUserEmail');
}

function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;

    clearMessage('reg-message');

    if (!name) {
        showMessage('reg-message', 'Erro: O nome é obrigatório.', 'error');
        return;
    }

    if (!emailRegex.test(email)) {
        showMessage('reg-message', 'Erro: Formato de e-mail inválido.', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('reg-message', 'Erro: A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }

    const userData = { name, email, password };
    saveUser(userData);

    showMessage('reg-message', 'Sucesso: Conta cadastrada com êxito! Redirecionando...', 'success');

    setTimeout(() => {
        window.location.href = `login.html?email=${encodeURIComponent(email)}`;
    }, 1200);
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    clearMessage('login-message');

    const user = getUserByEmail(email);

    if (!user) {
        showMessage('login-message', 'Erro: E-mail não cadastrado.', 'error');
        return;
    }

    if (user.password !== password) {
        showMessage('login-message', 'Erro: Senha incorreta.', 'error');
        return;
    }

    setCurrentSession(user.email);
    showMessage('login-message', 'Autenticação confirmada. Bem-vindo.', 'success');

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function forgotPassword() {
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const modal = document.getElementById('modal-overlay');
    const modalText = document.getElementById('modal-text');

    if (!modal || !modalText) return;

    if (!email) {
        modalText.innerHTML = 'Por favor, preencha o e-mail no login para recuperar a senha.';
    } else {
        const user = getUserByEmail(email);

        if (user) {
            modalText.innerHTML = `Identidade confirmada.<br><br>Sua senha é: <span class="modal-password">${user.password}</span>`;
        } else {
            modalText.innerHTML = 'Nenhuma conta associada a este e-mail foi encontrada no LocalStorage.';
        }
    }

    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.classList.remove('show');
    }
}

function loadDashboard() {
    const currentUserEmail = getCurrentSession();

    if (!currentUserEmail) {
        window.location.href = 'login.html';
        return;
    }

    const user = getUserByEmail(currentUserEmail);

    if (!user) {
        clearCurrentSession();
        window.location.href = 'login.html';
        return;
    }

    const displayName = document.getElementById('user-display-name');
    if (displayName) {
        displayName.textContent = user.name;
    }
}

function logout() {
    clearCurrentSession();
    window.location.href = 'login.html';
}

function preloadLoginEmailFromQuery() {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('email');
    const loginEmail = document.getElementById('login-email');

    if (email && loginEmail) {
        loginEmail.value = email;
    }
}

function initializePage() {
    const page = document.body.dataset.page;

    if (page === 'register') {
        const registerForm = document.getElementById('register-form');
        if (registerForm) registerForm.addEventListener('submit', handleRegister);
    }

    if (page === 'login') {
        const loginForm = document.getElementById('login-form');
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        preloadLoginEmailFromQuery();
    }

    if (page === 'dashboard') {
        loadDashboard();
    }
}

window.addEventListener('DOMContentLoaded', initializePage);
