const form = document.getElementById("loginForm");
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const usuario = document.getElementById("user").value;
    const password = document.getElementById("password").value;
    if (usuario === "" || password === "") {
        alert("Completa todos los campos.");
        return;
    }
    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario: usuario,
                password: password
            })
        });
        const datos = await response.json();
        if (datos.success) {
            alert("Bienvenido " + usuario);
            if (datos.rol === "admin") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/dashboard";
            }
        } else {
            alert(datos.mensaje);
        }
    } catch (error) {
        console.log(error);
        alert("Error en el servidor");
    }
});