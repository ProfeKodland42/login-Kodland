async function agregarUsuario() {

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const rol = document.getElementById("rol").value;
    await fetch("/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario,
            password,
            rol
        })
    });
    alert("Usuario agregado");
}

async function eliminarUsuario() {
    const id = document.getElementById("usuarioEliminar").value;
    await fetch(`/usuarios/${id}`, {
        method: "DELETE"
    });
    alert("Usuario eliminado");
}
async function cargarUsuarios() {
    const res = await fetch("/usuarios");
    const data = await res.json();
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    data.forEach(u => {
        const li = document.createElement("li");
        li.textContent = `${u.id} - ${u.usuario} - ${u.rol}`;
        lista.appendChild(li);

    });
}