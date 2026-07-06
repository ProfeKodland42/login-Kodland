

let studentMode = false;

document.addEventListener("DOMContentLoaded", () => {
    iniciarDashboard();
});

function iniciarDashboard(){
    animarBarras();
    activarTabs();
    activarBotones();
    animarCards();
    activarModoOscuro();
    activarGeneradores();
    saludo();
}
/*======================================================
        ANIMACIÓN BARRAS DE PROGRESO
======================================================*/
function animarBarras(){
    const barras = document.querySelectorAll(".bar");
    barras.forEach(barra=>{
        const progreso = barra.style.width;
        barra.style.width = "0%";
        setTimeout(()=>{
            barra.style.transition = "width 1.5s ease";
            barra.style.width = progreso;
        },300);
    });
}
/*======================================================
                    TABS
======================================================*/
function activarTabs(){
    const tabs = document.querySelectorAll(".tabs a");
    tabs.forEach(tab=>{
        tab.addEventListener("click",()=>{
            tabs.forEach(t=>{
                t.classList.remove("active");
            });
            tab.classList.add("active");
        });
    });
}
/*======================================================
            ANIMACIÓN TARJETAS
======================================================*/
function animarCards(){
    const cards = document.querySelectorAll(".card");
    cards.forEach((card,index)=>{
        card.style.opacity = "0";
        card.style.transform = "translateY(40px)";
        setTimeout(()=>{
            card.style.transition = ".6s";
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        },200*index);
    });
}
/*======================================================
            HERO BUTTON
======================================================*/
const heroButton = document.querySelector(".hero button");
if(heroButton){
    heroButton.addEventListener("click",()=>{
        document.querySelector(".cards").scrollIntoView({
            behavior:"smooth"
        });
    });
}
/*======================================================
                BOTONES DE LAS TARJETAS
======================================================*/
function activarBotones(){
    const botones = document.querySelectorAll(".card button");
    botones.forEach(btn=>{
        btn.addEventListener("click",()=>{
            // Si es un botón para generar enlace,
            // la función activarGeneradores() se encargará.
            if(btn.classList.contains("generate-link")){
                return;
            }
            const curso = btn.parentElement
                .querySelector("h3")
                .innerText;
            console.log("Curso seleccionado:",curso);
        });
    });
}
/*=====================================================
                MODO OSCURO
======================================================*/
function activarModoOscuro(){
    const icono = document.querySelector(".bi-moon");
    if(!icono) return;
    let oscuro = true;
    icono.parentElement.addEventListener("click",()=>{
        if(oscuro){
            document.documentElement.style.setProperty("--bg","#edf2ff");
            document.documentElement.style.setProperty("--sidebar","#ffffff");
            document.documentElement.style.setProperty("--card","#ffffff");
            document.documentElement.style.setProperty("--text","#222");
            document.documentElement.style.setProperty("--text2","#666");
            document.body.style.background="#edf2ff";
            icono.classList.remove("bi-moon");
            icono.classList.add("bi-sun");
            oscuro=false;
        }else{
            document.documentElement.style.setProperty("--bg","#0c1024");
            document.documentElement.style.setProperty("--sidebar","#131938");
            document.documentElement.style.setProperty("--card","#1a2149");
            document.documentElement.style.setProperty("--text","#ffffff");
            document.documentElement.style.setProperty("--text2","#b8bfd6");
            document.body.style.background=
                "linear-gradient(135deg,#090d20,#131938,#090d20)";
            icono.classList.remove("bi-sun");
            icono.classList.add("bi-moon");
            oscuro=true;
        }
    });
}
/*======================================================
                EFECTO HOVER
======================================================*/
const cards = document.querySelectorAll(".card");
cards.forEach(card=>{
    card.addEventListener("mousemove",(e)=>{
        const x = e.offsetX;
        const y = e.offsetY;
        const centroX = card.offsetWidth/2;
        const centroY = card.offsetHeight/2;
        const rotY = (x-centroX)/25;
        const rotX = (centroY-y)/25;
        card.style.transform = `
            rotateX(${rotX}deg)
            rotateY(${rotY}deg)
            translateY(-8px)
        `;
    });
    card.addEventListener("mouseleave",()=>{
        card.style.transform="rotateX(0) rotateY(0)";
    });
});
/*======================================================
                NOTIFICACIONES
======================================================*/
const campana = document.querySelector(".bi-bell");
if(campana){
    campana.parentElement.addEventListener("click",()=>{
        alert("No tienes nuevas notificaciones.");
    });
}
/*======================================================
                    SALUDO
======================================================*/
function saludo(){
    const hora = new Date().getHours();
    const titulo = document.querySelector(".titulo h1");
    if(!titulo) return;
    if(hora<12){
        titulo.innerHTML="🌞 Buenos días";
    }
    else if(hora<18){
        titulo.innerHTML="☀️ Buenas tardes";
    }
    else{
        titulo.innerHTML="🌙 Buenas noches";
    }
}
/*======================================================
                EFECTO SCROLL
======================================================*/
window.addEventListener("scroll",()=>{
    const header = document.querySelector("header");
    if(!header) return;
    if(window.scrollY>40){
        header.style.backdropFilter="blur(15px)";
        header.style.background="rgba(15,20,45,.75)";
        header.style.padding="15px 20px";
        header.style.borderRadius="15px";
    }
    else{
        header.style.background="transparent";
        header.style.backdropFilter="none";
        header.style.padding="0";
    }
});
/*======================================================
                RELOJ CONSOLA
======================================================*/
setInterval(()=>{
    console.clear();
    console.log("Tutor's Leveling");
    console.log(new Date().toLocaleTimeString());
},1000);
/*======================================================
            GENERAR LINK ESTUDIANTE
======================================================*/
async function generarLink(modulo){
    try{
        const respuesta = await fetch("/generate_link",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                module:modulo
            })
        });
        const datos = await respuesta.json();
        if(!datos.success){
            alert("No fue posible generar el enlace.");
            return;
        }
        await navigator.clipboard.writeText(datos.link);
        alert(
            `✅ Enlace generado correctamente.

            El enlace fue copiado al portapapeles.
${datos.link}`
        );
    }
    catch(error){
        console.error(error);
        alert("Error conectando con el servidor.");
    }
}
/*======================================================
        ACTIVAR BOTONES GENERAR LINK
======================================================*/
function activarGeneradores(){
    const botones = document.querySelectorAll(".generate-link");
    if(botones.length===0){
        return;
    }
    botones.forEach(boton=>{
        boton.addEventListener("click",()=>{
            const modulo = boton.dataset.module;
            generarLink(modulo);
        });
    });
}
/*======================================================
        UTILIDAD COPIAR TEXTO
======================================================*/
async function copiarTexto(texto){
    try{
        await navigator.clipboard.writeText(texto);
        return true;
    }
    catch(error){
        console.error(error);
        return false;
    }
}
/*======================================================
        MENSAJE TEMPORAL
======================================================*/
function mostrarMensaje(texto){
    const mensaje = document.createElement("div");
    mensaje.className = "mensaje-dashboard";
    mensaje.innerHTML = texto;
    document.body.appendChild(mensaje);
    setTimeout(()=>{
        mensaje.classList.add("mostrar");
    },50);
    setTimeout(()=>{
        mensaje.classList.remove("mostrar");
        setTimeout(()=>{
            mensaje.remove();
        },300);
    },2500);
}