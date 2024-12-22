window.addEventListener('load', function () {

    // Obtener las variables globales

    const form = document.querySelector("form");
    const email = document.querySelector("#inputEmail");
    const password = document.querySelector("#inputPassword");

    const url = "https://todo-api.digitalhouse.com/v1"; //endpoint

    form.addEventListener('submit', function (event) {
       event.preventDefault();
       const payload = {
            email: email.value,
            password: password.value
        };
    
        console.log(payload);
        const settings = {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        };

        console.log(settings);
        realizarLogin(settings);

    });

    function realizarLogin(settings) {
        console.log(settings);
        console.log("Lanzando la consulta a la API....");
        
        fetch(`${url}/users/login`, settings)
        .then( response => {
            console.log(response);
            if (response.ok){
                return response.json();
            }
            return Promise.reject(response);
                
            })
            .then(data =>{
                console.log(data);
                console.log(data.jwt);
                
                if (data.jwt) {
                    localStorage.setItem("jwt", JSON.stringify(data.jwt))
                    form.reset()

                    location.replace("./mis-tareas.html")
                }
            })
            .catch( err => {
                console.error(err);
                console.error(err.status);
            if (err.status == 400) {
                console.error("Contraseña incorrecta")
                alert("Contraseña incorrecta. Por favor vuelve a ingresarlo")
            } else if (err.status == 404) {
                console.error("El usuario no existe")
                alert("El usuario no existe, revise el email")
            } else {
                console.error("Error del servidor | url no existe")
                alert("Error del servidor o url no existe, comúniquese con el proveedor")
            }
        })        
    };
});
