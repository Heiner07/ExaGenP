// Descarga de archivos generados en memoria (RF-004).
// Recibe el contenido en base64 desde Blazor WASM y dispara la descarga con un Blob.
window.descargarArchivo = function (nombre, base64, tipoMime) {
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: tipoMime });
    const url = URL.createObjectURL(blob);

    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

    URL.revokeObjectURL(url);
};