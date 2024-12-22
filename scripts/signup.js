window.addEventListener('load', function () {

    // Obtener las variables globales   
    
    const form = document.querySelector("form");
    const nombre = document.querySelector('#inputNombre');
    const apellido = document.querySelector('#inputApellido');
    const email = document.querySelector('#inputEmail');
    const password = document.querySelector('#inputPassword');

    const url = "https://todo-api.digitalhouse.com/v1"

    form.addEventListener('submit', function (event) {
        event.preventDefault();

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
                    console.warn("El usuario ya se encuentra registrado / Alguno de los datos requeridos está incompleto");
                    alert("El usuario ya se encuentra registrado / Alguno de los datos requeridos está incompleto");
                } else {
                    console.error("Error del servidor | url no existe");                   
                }
            })
    };
});