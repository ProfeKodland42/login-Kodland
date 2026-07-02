/*=========================================================
                ARCHIVOS DEL WORKSPACE
=========================================================*/

const archivos = {

    "main.py":
`print("Bienvenido a Tutor's Leveling")

nombre = input("¿Cómo te llamas? ")

print("Hola", nombre)
`,

    "variables.py":
`nombre = "Santiago"

edad = 29

pais = "Colombia"

print(nombre)
print(edad)
print(pais)
`,

    "ejercicios.py":
`print("Tabla del 5")

for i in range(1,11):

    print(f"5 x {i} = {5*i}")
`
};
/*=========================================================
                MONACO
=========================================================*/
require.config({
    paths:{
        vs:"https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs"
    }
});
let editor;
let archivoActual = "main.py";
require(["vs/editor/editor.main"],function(){
    editor = monaco.editor.create(
        document.getElementById("editor"),
        {
            value: archivos["main.py"],
            language:"python",
            theme:"vs-dark",
            automaticLayout:true,
            fontSize:16,
            minimap:{
                enabled:false
            }
        }
    );
});
/*=========================================================
                CAMBIAR PESTAÑAS
=========================================================*/
document.querySelectorAll(".tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
        document.querySelectorAll(".tab").forEach(t=>{
            t.classList.remove("active");
        });
        tab.classList.add("active");
        archivoActual = tab.dataset.file;
        editor.setValue(
            archivos[archivoActual]
        );
    });
});
/*=========================================================
                EJECUTAR
=========================================================*/
document.getElementById("run").addEventListener("click",async()=>{
    const codigo = editor.getValue();
    const stdin = document.getElementById("stdin").value;
    document.getElementById("output").textContent =
"Ejecutando...";
    try{
        const respuesta = await fetch("/ejecutar",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                codigo:codigo,
                stdin:stdin
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
            salida="Proceso finalizado.";
        document.getElementById("output").textContent = salida;
    }
    catch(error){
        document.getElementById("output").textContent =
"Error de conexión.";
    }
});