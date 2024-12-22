

console.log(localStorage.jwt);

if (!localStorage.jwt) {
  location.replace("./index.html");
}
window.addEventListener('load', function () {

  const formCrearTarea = document.querySelector('.nueva-tarea');
  const btnCerrarSesion = document.querySelector('#closeApp');
  const nuevaTarea = document.querySelector('#nuevaTarea');
  
  const url = "https://todo-api.digitalhouse.com/v1";
  const urlUsuario = `${url}/users/getMe`;
  const urlTareas = `${url}/tasks`;
  const token = JSON.parse(localStorage.jwt);

  
  obtenerNombreUsuario();
  consultarTareas();

  btnCerrarSesion.addEventListener('click', function () {
    const cerrarSesion = confirm("¿Está seguro de que desea cerrar sesión?");

    if (cerrarSesion) {
    
      localStorage.clear();
      location.replace("./index.html");
    }
  });
  function obtenerNombreUsuario() {
   const settings = {
      method: "GET",
      headers: {
        authorization: token
      }
    };
    console.log(settings); 

    fetch(urlUsuario, settings)
      
      .then( response => {
        
        if (response.ok != true) {
          return Promise.reject(response);
        }
        return response.json();
      })
        .then( userData => {

          console.log(userData);
          console.log(userData.firstName);

          const nombreUsuario = document.querySelector(".user-info p")
          nombreUsuario.textContent = userData.firstName
        })
        
        .catch(err => {
          console.error(err);
          console.error(err.status);
          if (err.status == 400) {
              console.warn("El usuario no existe.");
              alert("El usuario no existe");
          } else {
              console.error("Error del servidor.");                  
          }
        })
    

  };

  function consultarTareas() {
    const settings = {
      method: "GET",
      headers: {
        authorization: token
      }
    }
    
    console.log("🚩Consultando las tareas...");
    fetch(urlTareas, settings)
      .then( response => response.json())
        .then( tareas => {
          console.log("Tareas del usuario");
          console.log(tareas);

          renderizarTareas(tareas);
          botonesCambioEstado();
          botonBorrarTarea();
        })
        .catch( err => console.log(err))
  };


  formCrearTarea.addEventListener('submit', function (event) {
    event.preventDefault() // *
    console.log("🚩Tarea nueva");
    console.log(nuevaTarea.value);

    const payload = {
      description: nuevaTarea.value.trim(),
      completed: "false"
    };

    const settings = {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        authorization: token 
      }
    };
    console.log("🚩Creando una tarea nueva en la DB");
    fetch(urlTareas, settings)
      .then( response => response.json())
      .then( tarea => {
        console.log(tarea);
        consultarTareas();
      })
      .catch( err => console.log(err))

      // limpieza del formulario
      formCrearTarea.reset() //*
  });
  function renderizarTareas(listado) {

    const tareasPendientes = document.querySelector(".tareas-pendientes")
    const tareasTerminadas = document.querySelector(".tareas-terminadas")
    tareasPendientes.innerHTML = ""
    tareasTerminadas.innerHTML = ""

    const cantidadFinalizadas = document.querySelector("#cantidad-finalizadas");
    let contador = 0;
    cantidadFinalizadas.textContent = contador;

    listado.forEach(tarea => {
    
      let fecha = new Date(tarea.createdAt)
      if (tarea.completed) {
        contador++; 
        tareasTerminadas.innerHTML += `
          <li class="tarea">
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${tarea.id}"><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>
        `        
      } else {
   
        tareasPendientes.innerHTML += `
          <li class="tarea">
            <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <p class="timestamp">${fecha.toLocaleDateString()}</p>
            </div>
          </li>
        `
      }      
    });

    cantidadFinalizadas.textContent = contador;
  };

  function botonesCambioEstado() {
    const btnCambioEstado = document.querySelectorAll(".change");
    btnCambioEstado.forEach( boton => {
   
      boton.addEventListener("click", (ev) => { 
        console.log("🪵 cambio estado de tarea");
      
        console.log(ev.target.id);
        
        const id = ev.target.id
        const urlChange = `${urlTareas}/${id}`
        const payload = {}

     
        if (ev.target.classList.contains("incompleta")) {
    
          payload.completed = false
        } else {
          
          payload.completed = true
        }
        console.log(payload);

        const settings = {
          method: "PUT",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            authorization: token, 
          }
        }

        fetch(urlChange, settings)
          .then(response => {
            console.log(response);
            consultarTareas()
          })
       })
    }) 
  }

  function botonBorrarTarea() {
    
    const btnBorrarTarea = document.querySelectorAll('.borrar');

    btnBorrarTarea.forEach(boton => {

      boton.addEventListener('click', function (event) {
        const id = event.target.id;
        const url = `${urlTareas}/${id}`

        const settingsCambio = {
          method: 'DELETE',
          headers: {
            "Authorization": token,
          }
        }
        fetch(url, settingsCambio)
          .then(response => {
            console.log("Borrando tarea...");
            console.log(response.status);
        
            consultarTareas();
          })
      })
    });
  }
});