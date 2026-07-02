/*======================================================
        TUTOR'S LEVELING
        PYTHON PRO IDE
======================================================*/

let editor;

let currentProject = "calculator";

let originalCode = "";

let ideStatus = "Connected";

let projectName = "Calculator";


/*======================================================
                MONACO
======================================================*/

require.config({
    paths:{
        vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"
    }
});

require(["vs/editor/editor.main"],function(){

    editor = monaco.editor.create(

        document.getElementById("editor"),

        {

            value:"",

            language:"python",

            theme:"vs-dark",

            automaticLayout:true,

            fontSize:16,

            minimap:{
                enabled:false
            },

            scrollBeyondLastLine:false,

            roundedSelection:true

        }

    );

    registerEditorEvents();

    loadProject("calculator");

});


/*======================================================
                STATUS
======================================================*/

function updateStatus(status){

    ideStatus=status;

    const items=document.querySelectorAll(".status-bar span");

    items[items.length-1].textContent="🟢 "+status;

}


/*======================================================
            LOAD PROJECT
======================================================*/

async function loadProject(project){

    currentProject=project;

    projectName=project;

    updateStatus("Loading...");

    try{

        const respuesta = await fetch(`/static/projects/${project}.py`);

        if(!respuesta.ok){

            throw new Error("Proyecto no encontrado.");

        }

        const codigo = await respuesta.text();

        editor.setValue(codigo);

        originalCode = codigo;

        updateStatus("Connected");

    }

    catch(error){

        editor.setValue(

`# Error

# ${error.message}`

        );

        updateStatus("Error");

    }

}


/*======================================================
            CONSOLE
======================================================*/

function clearConsole(){

    document.getElementById("output").textContent=

`Python Pro IDE

Console cleared.

`;
}
/*======================================================
            RESET
======================================================*/
function resetCode(){
    editor.setValue(originalCode);
}
/*======================================================
            SAVE
======================================================*/
function saveLocal(){
    localStorage.setItem(
        "python_pro_code",
        editor.getValue()
    );
}
/*======================================================
            RESTORE
======================================================*/
function restoreLocal(){
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
    updateStatus("Running...");
    document.getElementById("output").textContent=

`Running project...

Please wait...

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
        let salida="";
        if(datos.stdout)
            salida+=datos.stdout;
        if(datosstderr)
            salida+=datos.stderr;
        if(datos.build_stderr)
            salida+=datos.build_stderr;
        if(datos.build_result)
            salida+=datos.build_result;
        if(salida==="")
            salida="Process finished successfully.";
        document.getElementById("output").textContent=salida;
        updateStatus("Completed");
    }
    catch(error){
        document.getElementById("output").textContent=
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
/*=====================================================
                SHORTCUTS
======================================================*/
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
        if(localStorage.getItem("python_pro_code")){
            restoreLocal();
        }
    },300);
});
/*======================================================
                EDITOR
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