import { UI } from "./comun/ui.js";
import { Form } from "./comun/form.js";
import { Equipo } from "./clases/Equipo.js";
import { crearEquipos } from "./equipos.js";
import { Fixture } from "./clases/Fixture.js";
import { TablaPosiciones } from "./clases/TablaPosiciones.js";
import { Partido } from "./clases/Partido.js";
import { GestorRecursos } from "./comun/gestorRecursos.js";

/**
 * Una vez cargado el DOM, se cargan los recursos
 */
window.addEventListener("DOMContentLoaded", function(e){ GestorRecursos.cargar(iniciar) });

/**
 * Inicia la aplicación
 */
function iniciar(){
    const audioArbitro = GestorRecursos.obtenerAudio("arbitro.mp3"),
        audioEntrenar = GestorRecursos.obtenerAudio("entrenar.mp3"),
        audioEstadio = GestorRecursos.obtenerAudio("estadio.mp3"),
        audioMusica = GestorRecursos.obtenerAudio("musica.mp3"),
        goles = { equipoA: 0, equipoB: 0 };
    let equipo = null,
        equipos = [],
        fixture = null,
        tablaPosiciones = null,
        partidoPrincipal = null,
        partidosFecha = [],
        historialFechas = [],
        fechas = null,
        fechaActual = 0,
        mostrarExp = false,
        audioActivado = true;

    audioEstadio.loop();
    audioMusica.loop();
    UI.botonCargandoComenzar.classList.remove("oculto");
    UI.circulosCargandoRecursos.classList.add("cargando-oculto");
    UI.botonEntrenar.style.display = "none";
    UI.botonJugarPartido.style.display = "none";
    UI.botonTablaPosiciones.style.display = "none";
    UI.botonFixture.style.display = "none";

    try {
        crearEquipos(equipos);
    } catch (error) {
        UI.abrirPopup("mensaje", "Error: " + error);
    }

    UI.restablecerFormJugador();
    UI.nombreEquipo.value = "";
    
    /**
     * Al perder el foco la ventana, se desactiva el audio
     */
    window.addEventListener("blur", function(e){
        if(audioActivado){
            desactivarAudio();
        }
    });

    /**
     * Al tomar foco la ventana, se activa el audio
     */
    window.addEventListener("focus", function(e){
        if(audioActivado){
            activarAudio();
        }
    });

    /**
     * Muestra la pantalla menu
     */
    UI.botonCargandoComenzar.addEventListener("click", function(e){
        UI.cargandoRecursos.style.display = "none";
        UI.mostrarPantalla("menu");
        audioMusica.play();
    });

    /**
     * Agrega evento click al contenedor
     */
    UI.contenedor.addEventListener("click", function(e){ 
        if(e.target.classList.contains("b-menu")){ // Click en el botón menu
            UI.mostrarPantalla("menu");
            audioMusica.play();
        }
        if(e.target.classList.contains("b-entrenar-jugador")){  // Click en el botón entrenar
            if(equipo.obtenerPuntos() > 0){
                const indice = e.target.dataset.ientrenar;
                const jugador = equipo.obtenerJugador(indice);

                equipo.establecerPuntos(equipo.obtenerPuntos()-1);
                jugador.experiencia++;
                UI.puntosDisponibles.textContent = equipo.obtenerPuntos();
                document.getElementById("exp-" + indice).textContent = jugador.experiencia;
                audioEntrenar.stop();
                audioEntrenar.play();
            }
            if(equipo.obtenerPuntos() === 0){
                const $botones = UI.botonesEntrenarJugador;

                for(let i=0; i<$botones.length; i++){
                    $botones[i].setAttribute("disabled", "");
                }
            }
        }
    });

    /**
     * Agrega evento change al contenedor
     */
    UI.contenedor.addEventListener("change", function(e){
        if(e.target.classList.contains("posicion-jugador")){ // Cambia la posicion del jugador
            const select = e.target;
            const indice = select.dataset.iposicion;
            const jugador = equipo.obtenerJugador(indice);
            jugador.posicion = select.options[select.selectedIndex].value;
            UI.establecerAlineacion(equipo.obtenerJugadores());
        }
    });

    /**
     * Muestra la pantalla para crear el equipo
     */
    UI.botonEquipo.addEventListener("click", function(e){
        UI.mostrarPantalla("crear-equipo");
        UI.nombreEquipo.focus();
    });

    /**
     * Agrega el evento submit al formulario de equipo
     */
    UI.formEquipo.addEventListener("submit", function(e){
        e.preventDefault();
        const valor = UI.nombreEquipo.value;

        if(Form.esNombre(valor) && Form.esAlfanumerico(valor)){
            if(!Form.existeElEquipo(valor, equipos)){
                equipo = new Equipo(Form.convertirAMayusculas(valor));

                if(e.submitter.dataset.equipo === "personalizado"){
                    UI.subpantallaEquipo.classList.remove("activa");
                    UI.subpantallaJugador.classList.add("activa");
                    UI.botonSiguiente.textContent = `Siguiente (${equipo.obtenerJugadoresCreados()+1} de ${equipo.obtenerJugadoresPermitidos()})`;
                    UI.nombreJugador.focus();
                } else {
                    try {
                        equipo.agregarJugador("Lucas Bilardo", "1", "arquero");
                        equipo.agregarJugador("Sebastián Torrente", "2", "defensor");
                        equipo.agregarJugador("Rodrigo Benavidez", "6", "defensor");
                        equipo.agregarJugador("Martín Pérez", "5", "mediocampista");
                        equipo.agregarJugador("Nahuel Vizancio", "8", "mediocampista");
                        equipo.agregarJugador("Aldo Pedraza", "10", "mediocampista");
                        equipo.agregarJugador("Sergio Muñoz", "9", "delantero");
                        equipos.unshift(equipo);
                        iniciarJuego();
                    } catch (error) {
                        UI.abrirPopup("mensaje", "Error: " + error);
                    }
                }
            } else {
                UI.abrirPopup("mensaje", "Ya existe un equipo con ese nombre");
            }
        } else {
            UI.abrirPopup("mensaje", "El nombre del equipo debe tener entre 3 y 20 caracteres. Se permiten letras y/o números");
        }
    });

    /**
     * Agrega el evento submit al formulario de jugador
     */
    UI.formJugador.addEventListener("submit", function(e){
        e.preventDefault();
        let esValido = true,
            mensajes = [];
        const valorNombre = UI.nombreJugador.value,
              valorNumero = UI.numeroCamiseta.value,
              valorPosicion = UI.posicion.value;

        if(!Form.esNombre(valorNombre) || !Form.esAlfabetico(valorNombre)){
            mensajes.push("El nombre debe tener entre 3 y 20 caracteres. Solo se permiten letras");
            esValido = false;
        }

        if(!Form.esNumeroCamiseta(valorNumero)){
            mensajes.push("El número de camiseta debe ser positivo y tener como máximo 2 dígitos");
            esValido = false;
        }

        if(valorPosicion.trim() === ""){
            mensajes.push("Debes seleccionar la posición");
            esValido = false;
        }

        if(Form.existeNumeroCamiseta(valorNumero, equipo.obtenerJugadores())){
            mensajes.push("Ya existe otro jugador con ese número de camiseta");
            esValido = false;
        }

        if(Form.existeArquero(valorPosicion, equipo.obtenerJugadores())){
            mensajes.push("Ya has creado al arquero");
            esValido = false;
        }

        if(!Form.verificarArquero(valorPosicion, equipo)){
            mensajes.push("Debes crear un arquero");
            esValido = false;
        }

        if(esValido){
            equipo.agregarJugador(Form.convertirAMayusculas(valorNombre), valorNumero, valorPosicion);
            UI.restablecerFormJugador();
            UI.botonSiguiente.textContent = `Siguiente (${equipo.obtenerJugadoresCreados()+1} de ${equipo.obtenerJugadoresPermitidos()})`;
            UI.nombreJugador.focus();
            
            if(equipo.obtenerJugadores().length === equipo.obtenerJugadoresPermitidos()){
                equipos.unshift(equipo);
                iniciarJuego();
            }
        } else {
            UI.abrirPopup("mensaje", mensajes[0]);
        }
    });

    /**
     * Botón entrenar del menú principal
     */
    UI.botonEntrenar.addEventListener("click", function(e){
        UI.mostrarPantalla("entrenamiento");
        UI.establecerAlineacion(equipo.obtenerJugadores());
        UI.puntosDisponibles.innerHTML = equipo.obtenerPuntos();
        const jugadores = equipo.obtenerJugadores();
        const $tabla = UI.tablaEntrenamiento;
        let html = "";

        for(let i=0; i<jugadores.length; i++){
            html += `<tr>
                        <td>
                            <div>${jugadores[i].nombre} (${jugadores[i].numero})</div>
                            <div>${UI.crearSelect(i, jugadores[i].posicion)}</div>
                        </td>
                        <td>
                            <div>Exp: <span id="exp-${i}">${jugadores[i].experiencia}</span></div>
                            <button class="b-entrenar-jugador" ${UI.desactivarBotonEntrenar(equipo.obtenerPuntos())} data-ientrenar="${i}">Entrenar</button>
                        </td>
                     </tr>`;
        }

        $tabla.innerHTML = html;

        if(mostrarExp){
            UI.abrirPopup("mensaje", `Has conseguido ${equipo.obtenerPuntosConseguidos()} puntos de experiencia`);
            mostrarExp = false;
        }
    });

    /**
     * Botón fixture del menú principal
     */
    UI.botonFixture.addEventListener("click", function(e){
        UI.mostrarPantalla("fixture");
        const contenedor = UI.contenedorFixture;
        let html = "";
        
        for(let i=0; i<fechas.length; i++){
            html += `<div class="fixture-fecha"><b>Fecha ${i+1}</b></div>`;
            for(let j=0; j<fechas[i].length; j++){
                if(historialFechas[i][j].nombreA !== null && historialFechas[i][j].nombreB !== null){
                    html += `<div class="fixture-vs">
                                ${historialFechas[i][j].nombreA} (${historialFechas[i][j].golesA})<br>
                                ${historialFechas[i][j].nombreB} (${historialFechas[i][j].golesB})
                            </div>`;
                } else {
                    const equipoA = fechas[i][j][0];
                    const equipoB = fechas[i][j][1];
                    html += `<div class="fixture-vs">${equipoA.obtenerNombre()} vs ${equipoB.obtenerNombre()}</div>`;
                }
            }
        }

        contenedor.innerHTML = html;
    });

    /**
     * Botón tabla de posiciones del menú principal
     */
    UI.botonTablaPosiciones.addEventListener("click", function(e){
        UI.mostrarPantalla("tabla-posiciones");
        tablaPosiciones.actualizar();
        const equiposTabla = tablaPosiciones.obtenerEquipos();
        let $tabla = UI.tPosiciones;
        let html = "";

        for(let i=0; i<equiposTabla.length; i++){
            html += `<tr>
                        <td>${i+1}</td>
                        <td>${equiposTabla[i].obtenerNombre()}</td>
                        <td>${equiposTabla[i].obtenerPts()}</td>
                        <td>${equiposTabla[i].obtenerGF()}</td>
                    </tr>`;
        }

        $tabla.innerHTML = html;
    });

    /**
     * Botón jugar partido del menú principal
     */
    UI.botonJugarPartido.addEventListener("click", function(e){        
        jugarPartido();
    });

    /**
     * Botón para comenzar el primer tiempo
     */
    UI.botonComenzarTiempo1.addEventListener("click", function(e){
        for(let i=0; i<partidosFecha.length; i++){
            const partido = partidosFecha[i];
            const equipoA = partido.obtenerEquipoA();
            const equipoB = partido.obtenerEquipoB();

            if(equipoA.obtenerNombre() !== equipo.obtenerNombre()){
                equipoA.entrenar();
            }
            if(equipoB.obtenerNombre() !== equipo.obtenerNombre()){
                equipoB.entrenar();
            }

            partido.iniciar();
            historialFechas[fechaActual][i].nombreA = equipoA.obtenerNombre();
            historialFechas[fechaActual][i].nombreB = equipoB.obtenerNombre();
            historialFechas[fechaActual][i].golesA = equipoA.obtenerGolesPartido();
            historialFechas[fechaActual][i].golesB = equipoB.obtenerGolesPartido();
            partido.finalizar();
        }

        fechaActual++;
        UI.botonMenuPartido.setAttribute("disabled", "");
        UI.botonComenzarTiempo1.setAttribute("disabled", "");
        UI.botonComenzarTiempo1.textContent = "Comenzando";
        UI.mostrarCargando();
        UI.centrarCargando(true);
        audioMusica.stop();
        audioEstadio.play();
        relatarPartido(partidoPrincipal.obtenerEventosTiempo1(), true);
    });

    /**
     * Botón para comenzar el segundo tiempo
     */
    UI.botonComenzarTiempo2.addEventListener("click", function(e){
        UI.botonComenzarTiempo2.setAttribute("disabled", "");
        UI.botonComenzarTiempo2.textContent = "Comenzando";
        UI.mostrarCargando();
        UI.centrarCargando(true);
        window.scrollTo(0, document.body.scrollHeight);
        relatarPartido(partidoPrincipal.obtenerEventosTiempo2(), false);      
    });

    /**
     * Botón reiniciar del menú principal
     */
    UI.botonReiniciar.addEventListener("click", function(e){
        UI.abrirPopup("dialogo-reiniciar", "¿Quires reiniciar? Perderás los puntos y comenzarás de nuevo");
    });

    /**
     * Botón mensaje para cerrar el popup
     */
    UI.botonMensaje.addEventListener("click", function(e){
        UI.cerrarPopup();
    });

    /**
     * Botón cancelar del popup
     */
    UI.botonDialogoCancelar.addEventListener("click", function(e){
        UI.cerrarPopup();
    });

    /**
     * Botón aceptar del popup
     */
    UI.botonDialogoAceptar.addEventListener("click", function(e){
        reiniciarJuego();
        jugarPartido();
    });

    /**
     * Botón cancelar del popup reiniciar
     */
    UI.botonDialogoReiniciarCancelar.addEventListener("click", function(e){
        UI.cerrarPopup();
    });

    /**
     * Botón aceptar del popup reiniciar
     */
    UI.botonDialogoReiniciarAceptar.addEventListener("click", function(e){
        equipo = null;
        equipos = [];
        mostrarExp = false;

        try {
            crearEquipos(equipos);
        } catch (error) {
            UI.abrirPopup("mensaje", "Error: " + error);
        }

        UI.botonEquipo.removeAttribute("disabled");
        UI.botonEquipo.style.display = "block";
        UI.nombreEquipo.value = "";
        UI.botonEntrenar.setAttribute("disabled", "");
        UI.botonEntrenar.style.display = "none";
        UI.botonJugarPartido.setAttribute("disabled", "");
        UI.botonJugarPartido.style.display = "none";
        UI.botonTablaPosiciones.setAttribute("disabled", "");
        UI.botonTablaPosiciones.style.display = "none";
        UI.botonFixture.setAttribute("disabled", "");
        UI.botonFixture.style.display = "none";
        UI.botonReiniciar.setAttribute("disabled", "");
        reiniciarJuego();
    });

    /**
     * Botón instrucciones del menú principal
     */
    UI.botonInstrucciones.addEventListener("click", function(e){
        UI.mostrarPantalla("instrucciones");
    });

    /**
     * Botón para activar o desactivar el audio
     */
    UI.botonSonido.addEventListener("click", function(e){
        if(audioActivado){
            desactivarAudio();
            UI.botonSonido.textContent = "Activar sonido";
            audioActivado = false;
        } else {
            activarAudio();
            UI.botonSonido.textContent = "Desactivar sonido";
            audioActivado = true;
        }
    });

    /**
     * Activa todos los sonidos
     */
    function activarAudio(){
        audioMusica.activarSonido();
        audioArbitro.activarSonido();
        audioEstadio.activarSonido();
        audioEntrenar.activarSonido();
    }

    /**
     * Desactiva todos los sonidos
     */
    function desactivarAudio(){
        audioMusica.desactivarSonido();
        audioArbitro.desactivarSonido();
        audioEstadio.desactivarSonido();
        audioEntrenar.desactivarSonido();
    }

    /**
     * Reinicia el juego para comenzar nuevamente
     */
    function reiniciarJuego(){
        fechaActual = 0;
        historialFechas = [];
        reiniciarPosiciones();
        fixture = new Fixture(equipos);
        fixture.crearCalendario();
        fechas = fixture.obtenerCalendario();
        establecerHitorialFechas();
        tablaPosiciones = new TablaPosiciones(equipos);
        UI.cerrarPopup();
    }
    
    /**
     * Reinicia las posiciones de los equipos reestableciendo los puntos y goles a favor
     */
    function reiniciarPosiciones(){
        for(let i=0; i<equipos.length; i++){
            equipos[i].reiniciarPts();
            equipos[i].reiniciarGF();
        }
    }
    
    /**
     * Crea un nuevo partido con los equipos de la fecha actual
     */
    function jugarPartido(){
        if(fechaActual < fechas.length){
            UI.mostrarPantalla("partido");
            UI.mostrarBotonTiempo1();
            partidosFecha = [];
    
            for(let i=0; i<fechas[fechaActual].length; i++){
                const equipoA = fechas[fechaActual][i][0];
                const equipoB = fechas[fechaActual][i][1];
                const partido = new Partido(equipoA, equipoB);
                partidosFecha.push(partido);
                goles.equipoA = 0;
                goles.equipoB = 0;
    
                if(esPartidoPrincipal(partido)){
                    partidoPrincipal = partido;
                }
            }
    
            UI.vs.innerHTML = `${partidoPrincipal.obtenerEquipoA().obtenerNombre()} (0)<br>
                                ${partidoPrincipal.obtenerEquipoB().obtenerNombre()} (0)`;
            UI.fecha.textContent = `FECHA ${fechaActual+1} de ${fechas.length}`;
            UI.tablaRelato.innerHTML = "";
            UI.botonComenzarTiempo1.removeAttribute("disabled");
            UI.botonComenzarTiempo1.textContent = "Comenzar 1° tiempo";
            UI.botonComenzarTiempo2.removeAttribute("disabled");
            UI.botonComenzarTiempo2.textContent = "Comenzar 2° tiempo";
        } else {
            UI.abrirPopup("dialogo", "Finalizó el torneo. ¿Quieres comenzar uno nuevo?");
        }
    }
    
    /**
     * Agrega las fechas al historial
     */
    function establecerHitorialFechas(){
        for(let i=0; i<fechas.length; i++){
            let partidos = [];
            for(let j=0; j<fechas[i].length; j++){
                partidos.push({
                    nombreA: null,
                    nombreB: null,
                    golesA: null,
                    golesB: null
                });
            }
            historialFechas.push(partidos);
        }
    }
    
    /**
     * Relata un partido mediante texto
     * @param {Array} eventos Los eventos que se produjeron en el partido
     * @param {Boolean} primerTiempo Indica si es el primer tiempo
     */
    function relatarPartido(eventos, primerTiempo){
        const $tabla = UI.tablaRelato,
              $vs = UI.vs;
        let i = 0;
    
        let intervalo = setInterval(function(){
            if(primerTiempo){
                UI.ocultarBotonTiempo1();
            } else {
                UI.ocultarBotonTiempo2();
            }
    
            const fila = UI.crearFilaEvento(eventos[i].minuto, eventos[i].mensaje);
            UI.centrarCargando(false);
            
            if(eventos[i].fin){
                if(eventos[i].partidoSuspendido || !primerTiempo){
                    UI.finalizarEventos(fila);
                    verificarPosicionFinal();
                    mostrarExp = true;
                    audioEstadio.stop();
                } else if(primerTiempo){
                    UI.agregarClaseEventoFin(fila);
                    UI.mostrarBotonTiempo2();
                }
                UI.ocultarCargando();
                clearInterval(intervalo);
                audioArbitro.play();
            } else {
                UI.agregarClaseEvento(fila);
                
                if(eventos[i].gol){
                    const equipoA = partidoPrincipal.obtenerEquipoA(),
                            equipoB = partidoPrincipal.obtenerEquipoB();
    
                    if(eventos[i].equipo.obtenerNombre() === equipoA.obtenerNombre()){
                        goles.equipoA++;
                    } else if(eventos[i].equipo.obtenerNombre() === equipoB.obtenerNombre()){
                        goles.equipoB++;
                    }
    
                    $vs.innerHTML = `${equipoA.obtenerNombre()} (${goles.equipoA})<br>
                                        ${equipoB.obtenerNombre()} (${goles.equipoB})`;
                }
            }
    
            $tabla.appendChild(fila.tr);
            i++;
            window.scrollTo(0, document.body.scrollHeight);
        },3000);
    }
    
    /**
     * Inicia el juego una vez completado el formulario de creación del equipo
     */
    function iniciarJuego(){
        UI.botonEquipo.setAttribute("disabled", "");
        UI.botonEquipo.style.display = "none";
        UI.botonReiniciar.removeAttribute("disabled");
        UI.botonEntrenar.style.display = "block";
        UI.botonEntrenar.removeAttribute("disabled");
        UI.botonFixture.style.display = "block";
        UI.botonFixture.removeAttribute("disabled");
        UI.botonTablaPosiciones.style.display = "block";
        UI.botonTablaPosiciones.removeAttribute("disabled");
        UI.botonJugarPartido.style.display = "block";
        UI.botonJugarPartido.removeAttribute("disabled");
        fixture = new Fixture(equipos);
        fixture.crearCalendario();
        fechas = fixture.obtenerCalendario();
        establecerHitorialFechas();
        tablaPosiciones = new TablaPosiciones(equipos);
        UI.mostrarPantalla("menu");
    }
    
    /**
     * 
     * @param {Partido} partido El partido a disputar
     * @returns {Boolean} Indica si es el partido disputado por el jugador principal
     */
    function esPartidoPrincipal(partido){
        return (equipo.obtenerNombre() === partido.obtenerEquipoA().obtenerNombre()) || 
               (equipo.obtenerNombre() === partido.obtenerEquipoB().obtenerNombre());
    }
    
    /**
     * Muestra la posición del jugador principal cuando finaliza la competición
     */
    function verificarPosicionFinal(){
        if(fechaActual === fechas.length){
            tablaPosiciones.actualizar();
            const equiposTabla = tablaPosiciones.obtenerEquipos();
            let texto = "";
    
            if(equiposTabla[0].obtenerNombre() === equipo.obtenerNombre()){
                texto = "¡Felicitaciones! Eres el campeón de la liga";
            } else {
                for(let i=0; i<equiposTabla.length; i++){
                    if(equiposTabla[i].obtenerNombre() === equipo.obtenerNombre()){
                        texto = "Conseguiste el puesto N° " + (i+1);
                        break;
                    }
                }
            }
    
            UI.abrirPopup("mensaje", texto);
        }
    }
}
