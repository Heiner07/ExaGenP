// Preferencias de la aplicación guardadas en el navegador (localStorage).
// Se usan, por ejemplo, para recordar las opciones de exportación a Word (RF-004).
window.exagenLeerPreferencias = function (clave) {
    try {
        return localStorage.getItem(clave);
    } catch {
        return null;
    }
};

window.exagenGuardarPreferencias = function (clave, valor) {
    try {
        localStorage.setItem(clave, valor);
    } catch {
        // Almacenamiento no disponible (modo privado): se ignora, no es crítico
    }
};