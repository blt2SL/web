document.getElementById('crearNodos').addEventListener('click', crearNodos);
document.getElementById('ingresarDatos').addEventListener('click', ingresarDatos);
document.getElementById('iniciarEleccion').addEventListener('click', iniciarEleccion);

function bully(nodos, iniciador, fallo) {
    let pasos = [];
    let etapa = 1;

    // Filtrar nodos que no han fallado
    let nodosActivos = nodos.filter(nodo => nodo !== fallo);
    
    // Comenzar la elección
    pasos.push(`Iniciando el proceso de elección desde el Proceso ${iniciador}.`);
    
    function enviarSolicitudes(proceso) {
        const nodosMayores = nodosActivos.filter(nodo => nodo > proceso);
        pasos.push(`\nETAPA ${etapa}: Proceso ${proceso} busca un nuevo coordinador.`);
        
        for (const nodo of nodosMayores) {
            pasos.push(`Proceso ${proceso} envía una SOLICITUD a Proceso ${nodo}.`);
            pasos.push(`Proceso ${nodo} recibió la SOLICITUD.`);

            // Simular respuesta
            if (nodo === nodosActivos[nodosActivos.length - 1]) { // Simular que el último nodo no responde
                pasos.push(`Proceso ${nodo} responde: OK.`);
            } else {
                pasos.push(`Proceso ${nodo} responde: OK.`);
            }
        }
        etapa++;
        return nodosMayores.length > 0 ? Math.max(...nodosMayores) : null; // Devuelve el nuevo coordinador o null si no hay
    }

    let coordinador = iniciador;

    while (true) {
        // Solo se permite que el iniciador sea un nodo activo
        if (!nodosActivos.includes(coordinador)) {
            pasos.push(`El Proceso ${iniciador} no está activo, por lo que se queda como coordinador.`);
            break;
        }

        coordinador = enviarSolicitudes(coordinador);

        // Si no hay más nodos mayores, el iniciador se queda como coordinador
        if (coordinador === null) {
            pasos.push(`No hay nodos mayores disponibles. El Proceso ${iniciador} se queda como coordinador.`);
            break;
        }

        // Asegúrate de que el nuevo coordinador no sea el nodo que falló
        if (coordinador === fallo) {
            pasos.push(`El Proceso ${coordinador} ha fallado. Buscando un nuevo coordinador...`);
            coordinador = null; // Reinicia la búsqueda
            continue;
        }

        // Asigna el nuevo coordinador
        pasos.push(`El nuevo coordinador elegido es: Proceso ${coordinador}.`);
        iniciador = coordinador; // Actualiza el iniciador
    }

    pasos.push(`\nEl nuevo coordinador final es: Proceso ${iniciador}.`);
    return pasos.join('\n');
}

function crearNodos() {
    const numNodos = parseInt(document.getElementById('numNodos').value);
    const nodosInputs = document.getElementById('nodosInputs');
    nodosInputs.innerHTML = '';

    for (let i = 1; i <= numNodos; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nodo ${i}`;
        nodosInputs.appendChild(input);
    }

    document.getElementById('nodosContainer').style.display = 'block';
}

function ingresarDatos() {
    const nodos = Array.from(document.querySelectorAll('#nodosInputs input')).map(input => parseInt(input.value));

    // Validar que los nodos sean números y únicos
    const nodosUnicos = [...new Set(nodos)].filter(nodo => !isNaN(nodo));
    if (nodosUnicos.length === 0) {
        alert("Por favor, ingrese nodos válidos.");
        return;
    }

    // Actualizar selectores con los nodos ingresados
    actualizarSelectores(nodosUnicos);
}

function actualizarSelectores(nodos) {
    const iniciadorSelect = document.getElementById('iniciador');
    const falloSelect = document.getElementById('fallo');
    
    // Limpiar las opciones anteriores
    iniciadorSelect.innerHTML = '';
    falloSelect.innerHTML = '';

    nodos.forEach(nodo => {
        const option1 = document.createElement('option');
        option1.value = nodo;
        option1.textContent = `Proceso ${nodo}`;
        iniciadorSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = nodo;
        option2.textContent = `Proceso ${nodo}`;
        falloSelect.appendChild(option2);
    });
}

function iniciarEleccion() {
    const nodos = Array.from(document.querySelectorAll('#nodosInputs input')).map(input => parseInt(input.value));
    nodos.sort((a, b) => a - b); // Ordenar nodos en orden ascendente

    const iniciador = parseInt(document.getElementById('iniciador').value);
    const fallo = parseInt(document.getElementById('fallo').value); // Obtener el nodo que falló

    const resultado = bully(nodos, iniciador, fallo);
    document.getElementById('resultado').innerText = resultado; // Mostrar el resultado en el elemento correspondiente
}