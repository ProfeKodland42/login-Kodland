/*======================================================
                PROJECT DATABASE
======================================================*/

const projects = {

    house:{
        title:"Starter House",
        image:"/static/img/house.png",
        difficulty:"⭐ Fácil",
        duration:"15 minutos",
        description:
        "Aprende a construir tu primera casa utilizando madera, piedra y vidrio. Ideal para comenzar en el modo supervivencia.",
        concepts:[
            "Bloques",
            "Crafting",
            "Puertas",
            "Ventanas"
        ],
        practice:"https://studio.code.org/courses/aquatic/units/1/lessons/1/levels/1"
    },

    bridge:{
        title:"Wooden Bridge",
        image:"/static/img/bridge.png",
        difficulty:"⭐⭐ Fácil",
        duration:"20 minutos",
        description:
        "Construye un puente de madera para conectar dos zonas del mapa.",
        concepts:[
            "Simetría",
            "Escaleras",
            "Losas",
            "Decoración"
        ],
        practice:"https://studio.code.org/courses/aquatic/units/1/lessons/1/levels/1"
    },

    castle:{
        title:"Medieval Castle",
        image:"/static/img/castle.png",
        difficulty:"⭐⭐⭐ Media",
        duration:"60 minutos",
        description:
        "Aprende a levantar un castillo medieval utilizando piedra, murallas y torres.",
        concepts:[
            "Murallas",
            "Torres",
            "Decoración",
            "Escalas"
        ],
        practice:"https://studio.code.org/courses/aquatic/units/1/lessons/1/levels/1"
    },

    redstone:{
        title:"Redstone Door",
        image:"/static/img/redstone.png",
        difficulty:"⭐⭐⭐⭐ Difícil",
        duration:"45 minutos",
        description:
        "Automatiza una puerta utilizando Redstone, palancas y pistones.",
        concepts:[
            "Redstone",
            "Pistones",
            "Palancas",
            "Circuitos"
        ],
        practice:"https://studio.code.org/courses/aquatic/units/1/lessons/1/levels/1"
    },
    farm:{
        title:"Automatic Farm",
        image:"/static/img/farm.png",
        difficulty:"⭐⭐⭐ Media",
        duration:"35 minutos",
        description:
        "Construye una granja automática para producir comida de forma eficiente.",
        concepts:[
            "Agua",
            "Cultivos",
            "Tolvas",
            "Automatización"
        ],
        practice:"https://studio.code.org/courses/aquatic/units/1/lessons/1/levels/1"
    }
};
/*======================================================
                UPDATE PROJECT
======================================================*/
function updateProject(project){
    const data = projects[project];
    if(!data) return;
    document.getElementById("project-image").src = data.image;
    document.getElementById("project-info").innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <hr>
        <strong>Dificultad</strong>
        <p>${data.difficulty}</p>
        <strong>Duración</strong>
        <p>${data.duration}</p>
        <strong>Conceptos</strong>
        <ul>
            ${data.concepts.map(c=>`<li>${c}</li>`).join("")}
        </ul>
        <hr>
        <h4>¿Listo para practicar?</h4>
        <p>
            Haz clic en el siguiente botón para realizar
            la actividad en Minecraft Education.
        </p>
        <a
            href="${data.practice}"
            target="_blank"
            rel="noopener noreferrer"
            class="practice-btn">
            🚀 Practicar en Minecraft Education
        </a>
    `;
}
/*======================================================
                EVENTS
======================================================*/
const cards = document.querySelectorAll(".project");
cards.forEach(card=>{
    card.addEventListener("click",()=>{
        cards.forEach(c=>c.classList.remove("active"));
        card.classList.add("active");
        updateProject(card.dataset.project);
    });
});
/*======================================================
                DEFAULT PROJECT
======================================================*/
updateProject("house");