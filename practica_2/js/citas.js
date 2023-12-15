const nombre = document.querySelector("#nombre")
const apellido = document.querySelector("#apellido")
const telefono = document.querySelector("#telefono")
const fecha = document.querySelector("#fecha")
const sintomas = document.querySelector("#sintomas")
const hora = document.querySelector("#hora")
const sentimientoSelect = document.getElementById('sentimiento');
const musicaRadios = document.querySelectorAll('input[name="musica"]');
const colorInput = document.getElementById('color');

const formulario = document.querySelector("#registro")
formulario.addEventListener('submit', nuevaCita)

const ol = document.querySelector("#lista-citas");

let modificar = false

const citaObj = {
    nombre: '',
    apellido: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
        console.log(this.citas)
    }


    modificarCita(citaActualizar) {
        this.citas = this.citas.map(cita => cita.id == citaActualizar.id ? citaActualizar : cita)

    }

    eliminarCita(id) {
        this.citas = this.citas.filter((cita) => cita.id != id)
        console.log(this.citas)
    }
}


//Interfaz
class UI {
    mostrarAlerta(mensaje, tipo) {
        const div = document.createElement("div");
        div.classList.add("alert")
        div.textContent = mensaje;
        if (tipo == "error") {
            div.classList.add("alert-danger")
        } else {
            div.classList.add("alert-success")
        }
        document.querySelector("#contenedor").insertBefore(div, document.querySelector("#primer-card"));
        setTimeout(() => {
            div.remove();
        }, 2500)
    }

    mostrarCitas({ citas }) {
        this.limpiarCitas();

        citas.forEach(cita => {
            const { nombre, apellido, telefono, fecha, hora, sintomas, sentimiento, musica, color, id } = cita;

            const li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start");

            const div = document.createElement("div");
            div.classList.add("ms-2", "me-auto");

            const divn = document.createElement("div");
            divn.classList.add("fw-bold");
            divn.textContent = nombre + " " + apellido;

            const divt = document.createElement("div");
            divt.textContent = "Telefono: " + telefono;

            const divf = document.createElement("div");
            divf.textContent = "Fecha: " + fecha;

            const divh = document.createElement("div");
            divh.textContent = "Hora: " + hora;

            const divs = document.createElement("div");
            divs.textContent = "Sintomas: " + sintomas;

            // Nuevos campos
            const divSentimiento = document.createElement("div");
            divSentimiento.textContent = "Sentimiento: " + sentimiento;

            const divMusica = document.createElement("div");
            divMusica.textContent = "Música: " + musica;

            const divColor = document.createElement("div");
            divColor.textContent = "Color: " + color;
            // Cambiar el fondo de color
            li.style.backgroundColor = color;

            const btne = document.createElement("button");
            btne.classList.add("badge", "bg-danger", "rounded-pill");
            btne.textContent = "Eliminar";
            btne.onclick = () => eliminarCita(id);

            const btnm = document.createElement("button");
            btnm.classList.add("badge", "bg-warning", "rounded-pill");
            btnm.textContent = "Modificar";
            btnm.onclick = () => modificarCita(cita);

            div.appendChild(divn);
            div.appendChild(divt);
            div.appendChild(divf);
            div.appendChild(divh);
            div.appendChild(divs);
            div.appendChild(divSentimiento);
            div.appendChild(divMusica);
            div.appendChild(divColor);

            li.appendChild(div);
            li.appendChild(btne);
            li.appendChild(btnm);

            ol.appendChild(li);
        });
    }

    limpiarCitas() {
        while (ol.firstChild) {
            ol.removeChild(ol.firstChild)
        }
    }

}

const adminCitas = new Citas();
const ui = new UI();

//eventos
events();
function events() {
    nombre.addEventListener("change", datosCita);
    apellido.addEventListener("change", datosCita);
    telefono.addEventListener("change", datosCita);
    fecha.addEventListener("change", datosCita);
    hora.addEventListener("change", datosCita);
    sintomas.addEventListener("change", datosCita);
    sentimientoSelect.addEventListener("change", datosCita);
    musicaRadios.forEach(radio => {
        radio.addEventListener("change", datosCita);
    });
    colorInput.addEventListener("change", datosCita);

}


function datosCita(e) {
    if (e.target.name === "musica" || e.target.name === "color" || e.target.name === "sentimiento") {
        citaObj[e.target.name] = e.target.value;
    } else {
        citaObj[e.target.name] = e.target.value;
    }

    console.log(citaObj);
}


function nuevaCita(e) {
    e.preventDefault();
    const { nombre, apellido, telefono, fecha, hora, sintomas, sentimiento, musica, color } = citaObj;

    if (nombre == "" || apellido == "" || telefono == "" || fecha == "" || hora == "" || sintomas == "") {
        ui.mostrarAlerta("Todos los campos son requeridos", "error");
        return;
    }

    if (modificar) {
        adminCitas.modificarCita({ ...citaObj });
        ui.mostrarAlerta("La cita se ha modificado de manera exitosa", "exito");
    } else {
        citaObj.id = Date.now();
        adminCitas.agregarCita({ ...citaObj });
        ui.mostrarAlerta("Cita Guardada", "exito");
    }

    formulario.reset();
    limpiarObj();
    ui.mostrarCitas(adminCitas);
}



function limpiarObj() {
    citaObj.nombre = "",
        citaObj.apellido = "",
        citaObj.telefono = "",
        citaObj.fecha = "",
        citaObj.hora = "",
        citaObj.sintomas = "",
        citaObj.id = ""
}

function eliminarCita(id) {
    console.log(id)

    adminCitas.eliminarCita(id)

    ui.mostrarAlerta("Cita eliminada con exito!", "exito")

    ui.mostrarCitas(adminCitas)
}

function modificarCita(cita) {
    modificar = true;
    nombre.value = cita.nombre;
    apellido.value = cita.apellido;
    telefono.value = cita.telefono;
    fecha.value = cita.fecha;
    hora.value = cita.hora;
    sintomas.value = cita.sintomas;
    sentimientoSelect.value = cita.sentimiento;

    musicaRadios.forEach(radio => {
        if (radio.value === cita.musica) {
            radio.checked = true;
        }
    });

    colorInput.value = cita.color;
    citaObj.nombre = cita.nombre;
    citaObj.apellido = cita.apellido;
    citaObj.telefono = cita.telefono;
    citaObj.fecha = cita.fecha;
    citaObj.hora = cita.hora;
    citaObj.sintomas = cita.sintomas;
    citaObj.sentimiento = cita.sentimiento;
    citaObj.musica = cita.musica;
    citaObj.color = cita.color;
    citaObj.id = cita.id;
}
