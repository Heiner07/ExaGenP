// Compresión y redimensionado de imágenes en el navegador.
// Abre el selector de archivos y devuelve un array de strings:
//   ["ok", mime, ancho, alto, base64]
//   ["error", "", "0", "0", mensaje]
//   null si el usuario cancela.
// El tope es el LADO MAYOR de la imagen; las imágenes pequeñas no se amplían.
window.exagenElegirImagen = function (maxLado, calidad) {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/png,image/jpeg,image/webp';

        input.onchange = async () => {
            const archivo = input.files && input.files[0];
            if (!archivo) {
                resolve(null);
                return;
            }

            try {
                const limiteOriginal = 10 * 1024 * 1024;
                if (archivo.size > limiteOriginal) {
                    resolve(["error", "", "0", "0", "La imagen supera los 10 MB."]);
                    return;
                }

                const bitmap = await createImageBitmap(archivo);
                const escala = Math.min(1, (maxLado || 1200) / Math.max(bitmap.width, bitmap.height));
                const ancho = Math.max(1, Math.round(bitmap.width * escala));
                const alto = Math.max(1, Math.round(bitmap.height * escala));

                const canvas = document.createElement('canvas');
                canvas.width = ancho;
                canvas.height = alto;

                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff'; // fondo blanco: JPEG no tiene transparencia
                ctx.fillRect(0, 0, ancho, alto);
                ctx.drawImage(bitmap, 0, 0, ancho, alto);

                const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', calidad || 0.8));
                if (!blob) {
                    resolve(["error", "", "0", "0", "No se pudo comprimir la imagen."]);
                    return;
                }

                const bytes = new Uint8Array(await blob.arrayBuffer());
                let binario = '';
                const paso = 0x8000;
                for (let i = 0; i < bytes.length; i += paso) {
                    binario += String.fromCharCode.apply(null, bytes.subarray(i, i + paso));
                }

                resolve(["ok", "image/jpeg", String(ancho), String(alto), btoa(binario)]);
            } catch (e) {
                resolve(["error", "", "0", "0", "No se pudo procesar la imagen: " + (e && e.message ? e.message : e)]);
            }
        };

        input.click();
    });
};