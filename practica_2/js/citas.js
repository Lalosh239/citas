const nombre = document.querySelector("#nombre")
const apellido = document.querySelector("#apellido")
const telefono = document.querySelector("#telefono")
const fecha = document.querySelector("#fecha")
const sintomas = document.querySelector("#sintomas")
const hora = document.querySelector("#hora")

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


    modificarCita(citaActualizar){
        this.citas = this.citas.map (cita => cita.id == citaActualizar.id ? citaActualizar : cita) 

    }

    eliminarCita(id) {
        this.citas = this.citas.filter((cita) => cita.id != id)
        console.log(this.citas)
    }
}


//Interfaz
class UI {
    mostrarAlerta(mensaje, tipo) {//error , exito
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

        this.limpiarCitas()

        citas.forEach(cita => {

            const { nombre, apellido, telefono, fecha, hora, sintomas, id } = cita

            const li = document.createElement("li")
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-start")

            const div = document.createElement("div");
            div.classList.add("ms-2", "me-auto")

            //div nombre
            const divn = document.createElement("div")
            divn.classList.add("fw-bold")
            divn.textContent = nombre + " " + apellido

            const divt = document.createElement("div")
            divt.textContent = "Telefono: " + telefono

            const divf = document.createElement("div")
            divf.textContent = "Fecha: " + fecha

            const divh = document.createElement("div")
            divh.textContent = "Hora: " + hora

            const divs = document.createElement("div")
            divs.textContent = "Sintomas: " + sintomas

            const btne = document.createElement("button")
            btne.classList.add("badge", "bg-danger", "rounded-pill")
            btne.textContent = "Eliminar"
            btne.onclick = () => eliminarCita(id)

            const btnm = document.createElement("button")
            btnm.classList.add("badge", "bg-warning", "rounded-pill")
            btnm.textContent = "Modificar"
            btnm.onclick = () => modificarCita(cita)

            div.appendChild(divn)
            div.appendChild(divt)
            div.appendChild(divf)
            div.appendChild(divh)
            div.appendChild(divs)

            li.appendChild(div)
            li.appendChild(btne)
            li.appendChild(btnm)

            ol.appendChild(li)
        })
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

}


function datosCita(e) {
    citaObj[e.target.name] = e.target.value
    // console.log(e.target.value);
    // console.log(e.target.name);
    console.log(citaObj)
}

function nuevaCita(e) {
    e.preventDefault();
    const { nombre, apellido, telefono, fecha, hora, sintomas } = citaObj;

    if (nombre == "" || apellido == "" || telefono == "" || fecha == "" || hora == "" || sintomas == "") {
        ui.mostrarAlerta("Todos los campos son requeridos", "error");
        return;
    }

    // Validar que la hora esté entre 9 a 20 horas
    const horaValida = parseInt(hora);
    if (horaValida < 9 || horaValida > 20) {
        ui.mostrarAlerta("La hora debe estar entre 9 y 20 horas", "error");
        return;
    }

    if (modificar) {
        // Modificar una cita
        adminCitas.modificarCita({ ...citaObj });
        ui.mostrarAlerta("La cita se ha modificado de manera exitosa", "exito");
    } else {
        // Nueva cita

        // Validar que la hora no se repita
        if (adminCitas.citas.some(cita => cita.hora === hora)) {
            ui.mostrarAlerta("La hora ya esta ocupada, elige otra hora", "error");
            return;
        }

        // Validar que la hora tenga al menos 1 hora de diferencia
        const horaNueva = new Date(fecha + ' ' + hora);
        if (adminCitas.citas.some(cita => {
            const horaCitaExistente = new Date(cita.fecha + ' ' + cita.hora);
            const diferenciaHoras = Math.abs((horaNueva - horaCitaExistente) / 36e5);
            return diferenciaHoras < 1;
        })) {
            ui.mostrarAlerta("Debe haber al menos 1 hora de diferencia con otras citas", "error");
            return;
        }

        citaObj.id = Date.now();
        // Agregar Cita al array
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

//Funcion para eliminar cita de un array
function eliminarCita(id) {
    console.log(id)

    //Eliminar cita
    adminCitas.eliminarCita(id)

    //Mostrar mensaje
    ui.mostrarAlerta("Cita eliminada con exito!", "exito")

    //Mostrar el array
    ui.mostrarCitas(adminCitas)
}

function modificarCita(cita) {
    modificar = true

    //const { nombre, apellido, telefono, fecha, hora, sintomas, id } = cita

    nombre.value = cita.nombre
    apellido.value = cita.apellido
    telefono.value = cita.telefono
    fecha.value = cita.fecha
    hora.value = cita.hora
    sintomas.value = cita.sintomas

    citaObj.nombre = cita.nombre
    citaObj.apellido = cita.apellido
    citaObj.telefono = cita.telefono
    citaObj.fecha = cita.fecha
    citaObj.hora = cita.hora
    citaObj.sintomas = cita.sintomas
    citaObj.id = cita.id

    //Actualizar cita
    // adminCitas.modificarCita({...citaObj})

}

//Validar citas de 9 a 20 y que no se puedan duplicar













