let editor;

const files = {
    html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mi Primera Página</title>
</head>
<body>



</body>
</html>`,

    css: `body{

    font-family:Arial,sans-serif;
    padding:40px;
    background:#fafafa;

}

h1{

    color:#007acc;

}

button{

    padding:12px 20px;

    border:none;

    border-radius:6px;

    background:#007acc;

    color:white;

    cursor:pointer;

}`,

    js: `function saludar(){

    alert("¡Hola desde JavaScript!");

}`
};

let currentFile = "html";

require.config({
    paths:{
        vs:"/static/monaco/min/vs"
    }
});

require(["vs/editor/editor.main"],function(){

    editor = monaco.editor.create(
        document.getElementById("editor"),
        {

            value:files.html,

            language:"html",

            theme:"vs-dark",

            automaticLayout:true,

            minimap:{
                enabled:false
            },

            fontSize:16,

            tabSize:4,

            wordWrap:"on",

            scrollBeyondLastLine:false

        }
    );

    configureTabs();

    configureButtons();

    renderPreview();

    cargarReto();

    editor.onDidChangeModelContent(() => {

        renderPreview();

        validarEjercicio();

    });

});

function configureTabs(){

    document
    .querySelectorAll(".file-tab")
    .forEach(tab=>{

        tab.onclick=()=>{

            files[currentFile]=editor.getValue();

            document
            .querySelectorAll(".file-tab")
            .forEach(t=>t.classList.remove("active"));

            tab.classList.add("active");

            currentFile=tab.dataset.file;

            let language="html";

            if(currentFile==="css") language="css";

            if(currentFile==="js") language="javascript";

            monaco.editor.setModelLanguage(
                editor.getModel(),
                language
            );

            editor.setValue(
                files[currentFile]
            );

            setTimeout(() => {

                validarEjercicio();

            }, 50);

        };

    });

}

function configureButtons(){

    document
    .getElementById("runBtn")
    .onclick=renderPreview;

    document
    .getElementById("resetBtn")
    .onclick=resetProject;

    document
    .getElementById("openBtn")
    .onclick=openPreview;

}

function renderPreview(){

    files[currentFile]=editor.getValue();

    const html=files.html;
    const css=files.css;
    const js=files.js;

    document
    .getElementById("preview")
    .srcdoc=`
<!DOCTYPE html>

<html>

<head>

<style>

${css}

</style>

</head>

<body>

${html}

<script>

${js}

</script>

</body>

</html>
`;

validarEjercicio();

}

function resetProject(){

    location.reload();

}

function openPreview(){

    files[currentFile]=editor.getValue();

    const html=files.html;
    const css=files.css;
    const js=files.js;

    const win=window.open();

    win.document.write(`
<!DOCTYPE html>

<html>

<head>

<style>

${css}

</style>

</head>

<body>

${html}

<script>

${js}

</script>

</body>

</html>
`);

    win.document.close();

}