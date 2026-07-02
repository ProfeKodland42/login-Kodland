/*======================================================
        TUTOR'S LEVELING
        PYTHON PRO IDE
======================================================*/
let editor = null;
let currentProject = "calculator";
let originalCode = "";
let ideStatus = "Connected";
let projectName = "Calculator";
let openedTabs = [];
/*======================================================
                MONACO
======================================================*/
require.config({
    paths: {
        vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"
    }
});
require(["vs/editor/editor.main"], function () {
    console.log("Monaco cargado.");
    editor = monaco.editor.create(
        document.getElementById("editor"),
        {
            value: "",
            language: "python",
            theme: "vs-dark",
            automaticLayout: true,
            fontSize: 16,
            minimap: {
                enabled: false
            },
            scrollBeyondLastLine: false,
            roundedSelection: true
        }
    );
    registerEditorEvents();
    editor.setValue(
`# Tutor's Leveling Python Pro

# Selecciona un archivo desde el Explorer.
`);
});
/*======================================================
                STATUS
======================================================*/

function updateStatus(status){

    ideStatus = status;

    const items = document.querySelectorAll(".status-bar span");
    if(items.length){
        items[items.length-1].textContent = "🟢 " + status;
    }
}
/*======================================================
            LOAD PROJECT
======================================================*/
async function loadProject(project){
    currentProject = project;
    projectName = project;
    updateStatus("Loading...");
    console.log("Cargando proyecto:",project);
    try{
        const respuesta = await fetch(`/static/projects/${project}.py`);
        if(!respuesta.ok){
            throw new Error(`No existe ${project}.py`);
        }
        const codigo = await respuesta.text();
        editor.setValue(codigo);
        originalCode = codigo;
        updateStatus("Connected");
    }
    catch(error){
        console.error(error);
        editor.setValue(
`# Error
# ${error.message}
# Verifique que el archivo exista en
# static/projects/${project}.py`
        );
        updateStatus("Error");
    }
}
/*======================================================
            CONSOLE
======================================================*/
function clearConsole(){
    document.getElementById("output").textContent =
`Python Pro IDE

Console cleared.
`;
}
/*======================================================
            RESET
======================================================*/
function resetCode(){
    if(editor){
        editor.setValue(originalCode);
    }
}
/*======================================================
            SAVE
======================================================*/
function saveLocal(){
    if(!editor) return;
    localStorage.setItem(
        "python_pro_code",
        editor.getValue()
    );
}
/*======================================================
            RESTORE
======================================================*/
function restoreLocal(){
    if(!editor) return;
    const saved = localStorage.getItem("python_pro_code");
    if(saved){
        editor.setValue(saved);
        originalCode = saved;
    }
}
/*======================================================
                RUN
======================================================*/
async function runCode(){
    if(!editor) return;
    updateStatus("Running...");
    document.getElementById("output").textContent =
`Running project...
Please wait..
`;
    try{
        const codigo = editor.getValue();
        const respuesta = await fetch("/ejecutar",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                codigo:codigo
            })
        });
        const datos = await respuesta.json();
        let salida = "";
        if(datos.stdout)
            salida += datos.stdout;
        if(datos.stderr)
            salida += datos.stderr;
        if(datos.build_stderr)
            salida += datos.build_stderr;
        if(datos.build_result)
            salida += datos.build_result;
        if(salida.trim()==="")
            salida = "Process finished successfully.";
        document.getElementById("output").textContent = salida;
        updateStatus("Completed");
    }
    catch(error){
        console.error(error);
        document.getElementById("output").textContent =
`Connection Error
${error}`;
        updateStatus("Error");
    }
}
/*======================================================
                EVENTS
======================================================*/
document.getElementById("run").addEventListener("click",runCode);
document.getElementById("clear").addEventListener("click",clearConsole);
/*======================================================
                SHORTCUTS
=====================================================*/
document.addEventListener("keydown",(event)=>{
    if(event.ctrlKey && event.key==="s"){
        event.preventDefault();
        saveLocal();
        updateStatus("Saved");
    }
    if(event.ctrlKey && event.key==="r"){
        event.preventDefault();
        resetCode();
        updateStatus("Reset");
    }
});
/*======================================================
                AUTO SAVE
======================================================*/
setInterval(()=>{
    if(editor){
        saveLocal();
    }
},5000);
/*======================================================
                RESTORE
======================================================*/
window.addEventListener("load",()=>{
    setTimeout(()=>{
        restoreLocal();
    },300);
});
/*======================================================
                EDITOR EVENTS
======================================================*/
function flashStatus(text){
    updateStatus(text);
    setTimeout(()=>{
        updateStatus("Connected");
    },2000);
}
function registerEditorEvents(){
    editor.onDidChangeModelContent(()=>{
        flashStatus("Editing");
    });
}
async function openFile(project){
    if(!openedTabs.includes(project)){
        openedTabs.push(project);
        createTab(project);
    }
    await loadProject(project);
    activateTab(project);
}
function createTab(project){
    document.querySelectorAll(".tab").forEach(tab=>{
        tab.classList.remove("active");
    });
    const tabs=document.getElementById("tabs");
    const tab=document.createElement("div");
    tab.className="tab active";
    tab.dataset.project=project;
    tab.innerHTML=`
        <i class="bi bi-file-earmark-code"></i>
        ${project}.py
    `;
    tab.onclick=()=>{
        loadProject(project);
        activateTab(project);
    };
    tabs.appendChild(tab);
}
function activateTab(project){
    document.querySelectorAll(".tab").forEach(tab=>{
        tab.classList.remove("active");
    });
    document
        .querySelector(`[data-project="${project}"]`)
        .classList.add("active");
}
document.querySelectorAll(".explorer-file").forEach(file=>{
    file.addEventListener("click",()=>{
        openFile(file.dataset.file);
    });
});