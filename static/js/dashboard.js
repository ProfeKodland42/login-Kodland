/*==================================================
            DASHBOARD.JS
==================================================*/
document.addEventListener("DOMContentLoaded", () => {
    iniciarDashboard();
});
/*==================================================
            INICIALIZAR
==================================================*/
function iniciarDashboard(){
    animarBarras();
    activarTabs();
    activarBotones();
    animarCards();
    activarModoOscuro();
}
/*==================================================
        ANIMACIÓN BARRAS PROGRESO
==================================================*/
function animarBarras(){
    const barras = document.querySelectorAll(".bar");
    barras.forEach(barra=>{
        const progreso = barra.style.width;
        barra.style.width="0%";
        setTimeout(()=>{
            barra.style.transition="width 1.5s ease";
            barra.style.width=progreso;
        },300);
    });
}
/*==================================================
            TABS
==================================================*/
function activarTabs(){
    const tabs=document.querySelectorAll(".tabs a");
    tabs.forEach(tab=>{
        tab.addEventListener("click",()=>{
            tabs.forEach(t=>t.classList.remove("active"));
            tab.classList.add("active");
        });
    });
}

/*==================================================
            BOTONES
==================================================*/
function activarBotones(){
    const botones=document.querySelectorAll(".card button");
    botones.forEach(btn=>{
        btn.addEventListener("click",()=>{
            const curso=btn.parentElement.querySelector("h3").innerText;
            alert("Ingresando al curso: "+curso);
        });
    });
}
/*==================================================
        ANIMACIÓN TARJETAS
==================================================*/
function animarCards(){
    const cards=document.querySelectorAll(".card");
    cards.forEach((card,index)=>{
        card.style.opacity="0";
        card.style.transform="translateY(40px)";
        setTimeout(()=>{
            card.style.transition=".6s";
            card.style.opacity="1";
            card.style.transform="translateY(0)";
        },200*index);
    });
}
/*==================================================
            HERO BOTÓN
==================================================*/
const heroButton=document.querySelector(".hero button");
if(heroButton){
    heroButton.addEventListener("click",()=>{
        document.querySelector(".cards").scrollIntoView({
            behavior:"smooth"
        });
    });
}
/*==================================================
            MODO OSCURO
==================================================*/
function activarModoOscuro(){
    const boton=document.querySelector(".bi-moon");
    if(!boton) return;
    let oscuro=true;
    boton.parentElement.addEventListener("click",()=>{
        if(oscuro){
            document.documentElement.style.setProperty("--bg","#edf2ff");
            document.documentElement.style.setProperty("--sidebar","#ffffff");
            document.documentElement.style.setProperty("--card","#ffffff");
            document.documentElement.style.setProperty("--text","#222");
            document.documentElement.style.setProperty("--text2","#666");
            document.body.style.background="#edf2ff";
            boton.classList.remove("bi-moon");
            boton.classList.add("bi-sun");
            oscuro=false;
        }else{
            document.documentElement.style.setProperty("--bg","#0c1024");
            document.documentElement.style.setProperty("--sidebar","#131938");
            document.documentElement.style.setProperty("--card","#1a2149");
            document.documentElement.style.setProperty("--text","#ffffff");
            document.documentElement.style.setProperty("--text2","#b8bfd6");
            document.body.style.background="linear-gradient(135deg,#090d20,#131938,#090d20)";
            boton.classList.remove("bi-sun");
            boton.classList.add("bi-moon");
            oscuro=true;
        }
    });
}
/*==================================================
        EFECTO HOVER TARJETAS
==================================================*/
const cards=document.querySelectorAll(".card");
cards.forEach(card=>{
    card.addEventListener("mousemove",(e)=>{
        const x=e.offsetX;
        const y=e.offsetY;
        const centroX=card.offsetWidth/2;
        const centroY=card.offsetHeight/2;
        const rotY=((x-centroX)/25);
        const rotX=((centroY-y)/25);
        card.style.transform=`
            rotateX(${rotX}deg)
            rotateY(${rotY}deg)
            translateY(-8px)
        `;
    });
    card.addEventListener("mouseleave",()=>{
        card.style.transform="rotateX(0) rotateY(0)";
    });
});
/*==================================================
        BOTÓN NOTIFICACIONES
==================================================*/
const campana=document.querySelector(".bi-bell");
if(campana){
    campana.parentElement.addEventListener("click",()=>{
        alert("No tienes nuevas notificaciones.");
    });
}

/*==================================================
        SALUDO AUTOMÁTICO
==================================================*/
function saludo(){
    const hora=new Date().getHours();
    const titulo=document.querySelector(".titulo h1");
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
saludo();
/*==================================================
            EFECTO SCROLL
==================================================*/

window.addEventListener("scroll",()=>{
    const header=document.querySelector("header");
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


/*==================================================
        RELOJ EN CONSOLA
==================================================*/

setInterval(()=>{
    console.clear();
    console.log("Tutor's Leveling");
    console.log(new Date().toLocaleTimeString());
},1000);