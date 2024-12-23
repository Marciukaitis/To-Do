function validarCoincidenciaContraseñas(password, passwordRepetida) {
    if (password !== passwordRepetida) {
        return "Las contraseñas no coinciden.";
    }
    return "";
}

// Valida el formato de un email
function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "El formato del email es inválido.";
    }
    return "";
}

// Valida la fortaleza de una contraseña
function validarPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return `La contraseña debe tener al menos ${minLength} caracteres.`;
    }
    if (!hasUpperCase) {
        return "La contraseña debe incluir al menos una letra mayúscula.";
    }
    if (!hasLowerCase) {
        return "La contraseña debe incluir al menos una letra minúscula.";
    }
    if (!hasNumber) {
        return "La contraseña debe incluir al menos un número.";
    }
    if (!hasSpecialChar) {
        return "La contraseña debe incluir al menos un carácter especial (!@#$%^&*...).";
    }

    return "";
}

// Exportar funciones para su uso en otros archivos
export { validarCoincidenciaContraseñas, validarEmail, validarPassword };