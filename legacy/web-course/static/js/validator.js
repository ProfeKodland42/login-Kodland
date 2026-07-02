let challenge = null;

async function cargarReto() {

    try {

        const respuesta = await fetch("/api/challenge/html/1");

        challenge = await respuesta.json();

        validarEjercicio();

    }

    catch (error) {

        console.error(error);

    }

}

function validarEjercicio() {

    if (!editor) return;

    if (!challenge) return;

    const parser = new DOMParser();

    const documento = parser.parseFromString(
        editor.getValue(),
        "text/html"
    );

    let completados = 0;

    challenge.objetivos.forEach(objetivo => {

        const elemento = document.getElementById(objetivo.id);

        if (!elemento) return;

        let encontrado = false;

        switch (objetivo.tipo) {

            case "html": {

                const elementoHTML = documento.querySelector(objetivo.selector);

                if (!elementoHTML) {

                    encontrado = false;
                    break;

                }

                const codigo = editor.getValue();

                const apertura = `<${objetivo.selector}`;
                const cierre = `</${objetivo.selector}>`;

                const tieneApertura = codigo.includes(apertura);
                const tieneCierre = codigo.includes(cierre);

                const tieneTexto =
                    elementoHTML.textContent.trim().length > 0;

                encontrado =
                    tieneApertura &&
                    tieneCierre &&
                    tieneTexto;

                break;

            }

        }

        const icono = elemento.querySelector(".goal-icon");

        if (encontrado) {

            completados++;

            icono.textContent = "✅";

            elemento.style.opacity = "1";

            elemento.style.borderLeft = "5px solid #4ade80";

        }

        else {

            icono.textContent = "⏳";

            elemento.style.opacity = ".65";

            elemento.style.borderLeft = "5px solid transparent";

        }

    });

    actualizarProgreso(
        completados,
        challenge.objetivos.length
    );

}

function actualizarProgreso(actuales, total) {

    const porcentaje = Math.round(
        actuales / total * 100
    );

    document.getElementById(
        "progressValue"
    ).textContent = porcentaje + "%";

    document.getElementById(
        "progressFill"
    ).style.width = porcentaje + "%";

    if (porcentaje === 100) {

        document.getElementById(
            "consoleText"
        ).textContent =
        "🎉 ¡Reto completado! +" + challenge.xp + " XP";

    }

    else {

        document.getElementById(
            "consoleText"
        ).textContent =
        "Objetivos completados: " +
        actuales +
        "/" +
        total;

    }

}