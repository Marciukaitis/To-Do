import { validarCoincidenciaContraseñas, validarEmail, validarPassword } from './utils.js';


window.addEventListener('load', function () {
    
    const form = document.querySelector("form");
    const nombre = document.querySelector('#inputNombre');
    const apellido = document.querySelector('#inputApellido');
    const email = document.querySelector('#inputEmail');
    const password = document.querySelector('#inputPassword');
    const passwordRepetida = document.querySelector('#inputPasswordRepetida');
    const passwordError = document.querySelector('#passwordError')
   

    const url = "https://todo-api.digitalhouse.com/v1"



    form.addEventListener('submit', function (event) {
        event.preventDefault();
   // Limpiar mensajes de error previos
   passwordError.textContent = "";

   // Validar contraseñas coincidentes
   const mensajeCoincidencia = validarCoincidenciaContraseñas(password.value, passwordRepetida.value);
   if (mensajeCoincidencia) {
       passwordError.textContent = mensajeCoincidencia;
       return;
   }

   // Validar formato del email
   const mensajeEmail = validarEmail(email.value);
   if (mensajeEmail) {
       passwordError.textContent = mensajeEmail;
       return;
   }

   // Validar fortaleza de la contraseña
   const mensajePassword = validarPassword(password.value);
   if (mensajePassword) {
       passwordError.textContent = mensajePassword;
       return;
   }
        const payload = {
            firstName: nombre.value,
            lastName: apellido.value, 
            email: email.value,
            password: password.value
        };

        const settings = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        realizarRegister(settings);

    });
    
    function realizarRegister(settings) {
        console.log("Lanzando el registro a la API...");

        fetch(`${url}/users`, settings)
        .then(response => {
            console.log(response);
            
            if (response.ok != true) {
                return Promise.reject(response)
            }
            
            return response.json();
            
        })
            .then(data => {
                console.log("Promesa cumplida:");
                console.log(data);
                
                if (data.jwt) {
                    localStorage.setItem('jwt', JSON.stringify(data.jwt));
                    
                    form.reset();
            
                    location.replace('./mis-tareas.html');
                    }   
                })
            .catch(err => {
                console.error(err);
                console.error(err.status);
                if (err.status == 400) {
                    console.warn("El usuario ya se encuentra registrado");
                    alert("El usuario ya se encuentra registrado");
                } else {
                    console.error("Error del servidor | url no existe");                   
                }
            });
        }
    
       
    });
    