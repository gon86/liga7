export const UI = iniciarUI();

/**
 * Inicia la interfaz de usuario permitiendo acceder a los elementos HTML
 * @returns {Object} Objeto literal con sus propiedades y métodos
 */
function iniciarUI(){
    const $pantallas = document.getElementsByClassName("pantalla"),
        $alineacion = document.getElementById("alineacion"),
        $fondoPopups = document.getElementById("fondo-popups"),
        $popups = document.querySelectorAll("#fondo-popups .popup");
          
    return {
        contenedor: document.getElementById("contenedor"),
        botonEquipo: document.getElementById("b-crear-equipo"),
        formEquipo: document.querySelectorAll(".subpantalla-equipo form")[0],
        formJugador: document.querySelectorAll(".subpantalla-equipo form")[1],
        nombreEquipo: document.getElementById("nombre-equipo"), 
        subpantallaEquipo: document.getElementsByClassName("subpantalla-equipo")[0],
        subpantallaJugador: document.getElementsByClassName("subpantalla-equipo")[1],
        nombreJugador: document.getElementById("nombre-jugador"),
        numeroCamiseta: document.getElementById("numero-camiseta"),
        posicion: document.getElementById("posicion"),
        botonEntrenar: document.getElementById("b-entrenar"),
        puntosDisponibles: document.getElementById("puntos-disponibles"),
        botonesEntrenarJugador: document.getElementsByClassName("b-entrenar-jugador"),
        contenedorFixture: document.getElementById("contenedor-fixture"),
        botonFixture: document.getElementById("b-fixture"),
        tPosiciones: document.querySelector("#t-posiciones tbody"),
        botonTablaPosiciones: document.getElementById("b-tabla-posiciones"),
        botonJugarPartido: document.getElementById("b-jugar-partido"),
        tablaRelato: document.querySelector("#t-relato tbody"),
        botonMenuPartido: document.querySelector("#partido .b-menu"),
        botonComenzarTiempo1: document.getElementById("b-comenzar-tiempo-1"),
        botonComenzarTiempo2: document.getElementById("b-comenzar-tiempo-2"),
        fecha: document.getElementById("fecha"),
        vs: document.getElementById("vs"),
        botonSiguiente: document.getElementById("b-jugador-siguiente"),
        botonReiniciar: document.getElementById("b-reiniciar"),
        tablaEntrenamiento: document.querySelector("#t-entrenamiento tbody"),
        cargandoRecursos: document.getElementById("cargando-recursos"),
        circulosCargandoRecursos: document.getElementsByClassName("cargando")[0],
        cargando: document.getElementsByClassName("cargando")[1],
        botonMensaje: document.querySelector("#mensaje button"),
        botonDialogoAceptar: document.querySelectorAll("#dialogo button")[0],
        botonDialogoCancelar: document.querySelectorAll("#dialogo button")[1],
        botonDialogoReiniciarAceptar: document.querySelectorAll("#dialogo-reiniciar button")[0],
        botonDialogoReiniciarCancelar: document.querySelectorAll("#dialogo-reiniciar button")[1],
        botonInstrucciones: document.getElementById("b-instrucciones"),
        botonSonido: document.getElementById("b-sonido"),
        botonCargandoComenzar: document.getElementById("b-cargando-comenzar"),
         
        /**
         * Muestra una pantalla específica
         * @param {String} id El atributo id de la etiqueta HTML
         */
        mostrarPantalla: function(id){
            for(let i=0; i<$pantallas.length; i++){
                if($pantallas[i].classList.contains("activa")){
                    $pantallas[i].classList.remove("activa");
                    break;
                }
            }

            document.getElementById(id).classList.add("activa");
        },

        /**
         * Muestra el botón que inicia el primer tiempo
         */
        mostrarBotonTiempo1: function(){
            this.botonComenzarTiempo1.classList.remove("oculto");
            this.botonComenzarTiempo1.classList.add("visible");
        },

        /**
         * Muestra el botón que inicia el segundo tiempo
         */
        mostrarBotonTiempo2: function(){
            this.botonComenzarTiempo2.classList.remove("oculto");
            this.botonComenzarTiempo2.classList.add("visible");
        },

        /**
         * Oculta el botón del primer tiempo
         */
        ocultarBotonTiempo1: function(){
            this.botonComenzarTiempo1.classList.remove("visible");
            this.botonComenzarTiempo1.classList.add("oculto");
        },
        
        /**
         * Oculta el botón del segundo tiempo
         */
        ocultarBotonTiempo2: function(){
            this.botonComenzarTiempo2.classList.remove("visible");
            this.botonComenzarTiempo2.classList.add("oculto"); 
        },

        /**
         * Agrega la clase de evento a una fila
         * @param {Object} fila La fila a la que se agrega la clase
         */
        agregarClaseEvento: function(fila){
            fila.minuto.classList.add("d-minuto");
            fila.mensaje.classList.add("d-mensaje");
        },
        
        /**
         * Agrega la clase de evento fin a una fila
         * @param {Object} fila La fila a la que se agrega la clase
         */
        agregarClaseEventoFin: function(fila){
            fila.minuto.classList.add("d-minuto-fin");
            fila.mensaje.classList.add("d-mensaje-fin");
        },

        /**
         * Finaliza los eventos del partido
         * @param {Object} fila La fila a la que se agrega la clase de evento final
         */
        finalizarEventos: function(fila){
            this.agregarClaseEventoFin(fila);
            this.botonMenuPartido.removeAttribute("disabled");
        },

        /**
         * Crea la fila de un evento
         * @param {String} minuto El minuto actual con su símbolo
         * @param {String} mensaje El mensaje
         * @returns {Object} Objeto con la fila HTML, el minuto y mensaje
         */
        crearFilaEvento: function(minuto, mensaje){
            const fila = document.createElement("tr"),
                celdaMinuto = document.createElement("td"),
                celdaMensaje = document.createElement("td"),
                divMinuto = document.createElement("div"),
                divMensaje = document.createElement("div");
                
            divMinuto.appendChild(document.createTextNode(minuto));
            celdaMinuto.appendChild(divMinuto);
            divMensaje.appendChild(document.createTextNode(mensaje));
            celdaMensaje.appendChild(divMensaje);
            fila.appendChild(celdaMinuto);
            fila.appendChild(celdaMensaje);
            
            return {
                tr: fila,
                minuto: divMinuto,
                mensaje: divMensaje
            };
        },

        /**
         * Desactiva el botón entrenar cuando se consumen todos los puntos de experiencia
         * @param {Number} puntosDisponibles Los puntos de experiencia disponibles
         * @returns {String} Atributo disabled cuando sea necesario
         */
        desactivarBotonEntrenar: function(puntosDisponibles){
            if(puntosDisponibles === 0){
                return "disabled";
            }
            return "";
        },

        /**
         * Obtiene el valor seleccionado
         * @param {String} posicion La posición del jugador actual
         * @param {String} valor La posición a mostrar en el select
         * @returns {String} Atributo selected cuando sea necesario
         */
        obtenerSeleccion: function(posicion, valor){
            if(posicion === valor){
                return "selected";
            }
            return "";
        },

        /**
         * Crea un select HTML
         * @param {Number} i El índice de posición
         * @param {String} posicion La posición del jugador
         * @returns {String} select para modificar la posición o div en caso del arquero
         */
        crearSelect: function(i, posicion){
            if(posicion === "arquero"){
                return `<div class="arquero-entrenamiento">Arquero</div>`;
            }
            
            return `<select class="posicion-jugador" data-iposicion="${i}">
                        <option ${this.obtenerSeleccion(posicion, "defensor")} value="defensor">Defensor</option>
                        <option ${this.obtenerSeleccion(posicion, "mediocampista")} value="mediocampista">Mediocampista</option>
                        <option ${this.obtenerSeleccion(posicion, "delantero")} value="delantero">Delantero</option>
                    </select>`
        },

        /**
         * Muestra la alineación del equipo
         * @param {Array} jugadores Los jugadores del equipo
         */
        establecerAlineacion: function(jugadores){
            let defensores = 0, mediocampistas = 0, delanteros = 0;
        
            for(let i=0; i<jugadores.length; i++){
                switch(jugadores[i].posicion){
                    case "defensor": defensores++;
                        break;
                    case "mediocampista": mediocampistas++;
                        break;
                    case "delantero": delanteros++;
                        break;
                }
            }
        
            $alineacion.textContent = `${defensores} - ${mediocampistas} - ${delanteros}`;
        },

        /**
         * Reestablece el formulario de creación del jugador
         */
        restablecerFormJugador: function(){
            this.nombreJugador.value = "";
            this.numeroCamiseta.value = "";
            this.posicion.value = "";
        },

        /**
         * Muestra el ícono del cargando
         */
        mostrarCargando: function(){
            this.cargando.classList.remove("cargando-oculto");
            this.cargando.classList.add("cargando-visible");
        },

        /**
         * Oculta el ícono del cargando
         */
        ocultarCargando: function(){
            this.cargando.classList.remove("cargando-visible");
            this.cargando.classList.add("cargando-oculto");
        },

        /**
         * Permite centrar el cargando horizontalmente
         * @param {Boolean} centrado true para centrarlo o false caso contrario
         */
        centrarCargando: function(centrado){
            if(centrado){
                this.cargando.classList.remove("descentrado");
                this.cargando.classList.add("centrado");
            } else {
                this.cargando.classList.remove("centrado");
                this.cargando.classList.add("descentrado");
            }
        },

        /**
         * Abre un popup
         * @param {String} id El atributo id del elemento HTML
         * @param {String} texto El texto a mostrar
         */
        abrirPopup(id, texto){
            for(let i=0; i<$popups.length; i++){
                if($popups[i].classList.contains("activo")){
                    $popups[i].classList.remove("activo");
                    break;
                }
            }

            $fondoPopups.classList.remove("fondo-oculto");
            $fondoPopups.classList.add("fondo-visible");
            document.querySelector(`#${id} .texto-popup`).textContent = texto;
            document.getElementById(id).classList.add("activo");
        },

        /**
         * Cierra el popup visible
         */
        cerrarPopup(){
            $fondoPopups.classList.remove("fondo-visible");
            $fondoPopups.classList.add("fondo-oculto");
        }
    }
}
