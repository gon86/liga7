/**
 * Permite controlar el desarrollo de un partido
 */
export class Partido {
    /**
     * Crea un partido con los dos equipos a enfrentarse
     * @param {Equipo} equipoA Un equipo
     * @param {Equipo} equipoB El otro equipo
     */
    constructor(equipoA, equipoB){
        this.equipoA = equipoA;
        this.equipoB = equipoB;
        this.eventosDelPartido = [];
        this.eventosTiempo1 = [];
        this.eventosTiempo2 = [];
        this.minutoActual = 0;
        this.minutoSuspension = null;
        this.equipoSuspendido = null;
        this.minimoJugadores = 4;
    }

    /**
     * Obtiene el primer equipo
     * @returns {Equipo} El equipo A
     */
    obtenerEquipoA(){
        return this.equipoA;
    }

    /**
     * Obtiene el segundo equipo
     * @returns {Equipo} El equipo B
     */
    obtenerEquipoB(){
        return this.equipoB;
    }

    /**
     * Inicia el partido
     */
    iniciar(){
        this.equipoA.quitarTarjetas();
        this.equipoB.quitarTarjetas();
        this.equipoA.restablecerJugadoresDisponibles();
        this.equipoB.restablecerJugadoresDisponibles();
        this.generarEventos(1, 45, "Entretiempo");
        this.generarEventos(46, 90, "Fin del partido");
        this.separarEventosPorTiempo();
        this.actualizarPtsEquipos();
        this.equipoA.actualizarGF();
        this.equipoB.actualizarGF();
    }

    /**
     * Finaliza el partido
     */
    finalizar(){
        this.equipoA.restablecerGoles();
        this.equipoB.restablecerGoles();
    }

    /**
     * Actualiza los puntos de ambos equipos de acuerdo al resultado
     */
    actualizarPtsEquipos(){
        const golesEquipoA = this.equipoA.obtenerGolesPartido();
        const golesEquipoB = this.equipoB.obtenerGolesPartido(); 
        const puntosGanado = 26;
        const puntosEmpatado = 23;
        const puntosPerdido = 20;

        if(this.seSuspendio()){
            if(this.equipoSuspendido === this.equipoA.obtenerNombre()){
                this.equipoB.actualizarPts(3);
                this.equipoB.agregarPuntosDisponibles(golesEquipoB + puntosGanado);
                this.equipoA.agregarPuntosDisponibles(golesEquipoA + puntosPerdido);    
            } else {
                this.equipoA.actualizarPts(3);
                this.equipoA.agregarPuntosDisponibles(golesEquipoA + puntosGanado);
                this.equipoB.agregarPuntosDisponibles(golesEquipoB + puntosPerdido);
            }
        } else if(golesEquipoA > golesEquipoB){
            this.equipoA.actualizarPts(3);
            this.equipoA.agregarPuntosDisponibles(golesEquipoA + puntosGanado);
            this.equipoB.agregarPuntosDisponibles(golesEquipoB + puntosPerdido);
        } else if(golesEquipoA < golesEquipoB){
            this.equipoB.actualizarPts(3);
            this.equipoB.agregarPuntosDisponibles(golesEquipoB + puntosGanado);
            this.equipoA.agregarPuntosDisponibles(golesEquipoA + puntosPerdido);
        } else {
            this.equipoA.actualizarPts(1);
            this.equipoB.actualizarPts(1);
            this.equipoA.agregarPuntosDisponibles(golesEquipoA + puntosEmpatado);
            this.equipoB.agregarPuntosDisponibles(golesEquipoB + puntosEmpatado);
        }
    }

    /**
     * Separa los eventos del partido en dos tiempos
     */
    separarEventosPorTiempo(){
        let indiceActual = 0;

        for(let i=indiceActual; i<this.eventosDelPartido.length; i++){
            this.eventosTiempo1.push(this.eventosDelPartido[i]);
            if(this.eventosDelPartido[i].fin){
                indiceActual = (i+1);
                break;
            }
        }

        for(let i=indiceActual; i<this.eventosDelPartido.length; i++){
            this.eventosTiempo2.push(this.eventosDelPartido[i]);
            if(this.eventosDelPartido[i].fin){
                break;
            }
        }
    }

    /**
     * Genera todos los eventos que se producen en el partido
     * @param {Number} inicio El minuto de inicio del tiempo
     * @param {Number} fin El minuto de finalización del tiempo
     * @param {String} mensajeFin Un mensaje que indica el final del tiempo
     */
    generarEventos(inicio, fin, mensajeFin){
        if(!this.seSuspendio()){
            let ocurrieronEventos = false;

            for(let i=inicio; i<=fin; i++){
                this.minutoActual = i; 
                if(this.obtenerNumeroAleatorio(10) === 0){
                    this.verificarEstadoPartido();
                    ocurrieronEventos = true;
                }
                if(this.minutoSuspension === i){
                    break;
                }
            }

            if(!ocurrieronEventos){
                this.agregarEvento("-", "No hubieron jugadas destacadas", false, false, null, false);
            }

            if(!this.seSuspendio()){
                this.agregarEvento(fin+"'", mensajeFin, true, false, null, false);
            }
        }
    }

    /**
     * Permite saber si el partido se suspendió o no
     * @returns {Boolean} true si se suspendió o false caso contrario
     */
    seSuspendio(){
        return this.minutoSuspension !== null;
    }

    /**
     * Obtiene los eventos del primer tiempo
     * @returns {Array} Los eventos
     */
    obtenerEventosTiempo1(){
        return this.eventosTiempo1;
    }

    /**
     * Obtiene los eventos del segundo tiempo
     * @returns {Array} Los eventos
     */
    obtenerEventosTiempo2(){
        return this.eventosTiempo2;
    }

    /**
     * Verifica el estado del partido determinando el equipo que posee el balón
     */
    verificarEstadoPartido(){
        const posesionEquipoA = this.obtenerPosesionBalon(this.equipoA);
        const posesionEquipoB = this.obtenerPosesionBalon(this.equipoB);

        if(posesionEquipoA > posesionEquipoB){
            this.verificarAtaque(this.equipoA, this.equipoB);
        } else if(posesionEquipoA < posesionEquipoB){
            this.verificarAtaque(this.equipoB, this.equipoA);
        } else {
            if(this.obtenerNumeroAleatorio(2) === 0){
                this.verificarAtaque(this.equipoA, this.equipoB);
            } else {
                this.verificarAtaque(this.equipoB, this.equipoA);
            }
        }
    }
    
    /**
     * Agrega un evento al partido
     * @param {String} minuto El minuto actual con el símbolo correspondiente
     * @param {String} mensaje El mensaje del evento
     * @param {Boolean} fin Indica si el partido ha finalizado
     * @param {Boolean} gol Indica si hubo un gol
     * @param {Equipo} equipo El equipo que posee el balón en ese momento
     * @param {Boolean} partidoSuspendido Indica si el partido ha sido suspendido
     */
    agregarEvento(minuto, mensaje, fin, gol, equipo, partidoSuspendido){
        this.eventosDelPartido.push({
            minuto: minuto,
            mensaje: mensaje,
            fin: fin,
            gol: gol,
            equipo: equipo,
            partidoSuspendido: partidoSuspendido
        });
    }
    
    /**
     * Obtiene la suma de experiencia de jugadores en una posición
     * @param {Equipo} equipo El equipo actual
     * @param {String} posicion La posición de los jugadores
     * @returns {Number} La suma de experiencia
     */
    obtenerExperiencia(equipo, posicion){
        let exp = 0;
    
        for(let i=0; i<equipo.jugadoresDisponibles.length; i++){
            if(equipo.jugadoresDisponibles[i].posicion === posicion){
                exp += equipo.jugadoresDisponibles[i].experiencia;
            }
        }
    
        return exp;
    }
    
    /**
     * Determina como será el ataque
     * @param {Equipo} atacante El equipo que ataca
     * @param {Equipo} defensor El equipo que defiende
     */
    verificarAtaque(atacante, defensor){
        switch(this.obtenerNumeroAleatorio(11)){
            case 0: 
                this.tiroPenal(atacante, defensor);
                break;
            case 1: 
                this.expulsarJugador(defensor, null);
                break;
            case 2: case 3: 
                this.amonestarJugador(defensor);
                break;
            case 4: case 5:    
                this.tiroLibre(atacante, defensor);
                break;
            case 6: case 7:    
                this.tiroDeEsquina(atacante, defensor);
                break;
            default: 
                let expAtacante = this.obtenerExperiencia(atacante, "delantero");
                let expDefensor = this.obtenerExperiencia(defensor, "defensor");
                this.superarDefensa(atacante, expAtacante, defensor, expDefensor);
        }
    }
    
    /**
     * Genera un ataque mediante tiro penal
     * @param {Equipo} atacante El equipo que ataca
     * @param {Equipo} defensor El equipo que defiende
     */
    tiroPenal(atacante, defensor){
        this.agregarEvento(this.minutoActual+"'", `Penal para ${atacante.nombre}`, false, false, null, false);
    
        if(this.obtenerNumeroAleatorio(3) == 0){
            this.rematar(atacante, defensor);
        } else {
            let rematador = this.obtenerRematador(atacante);
            this.agregarEvento(this.minutoActual+"'", `¡Gol de ${atacante.nombre}! (${rematador.nombre})`, false, true, atacante, false);
            atacante.convertirGolPartido();
        }
    }
    
    /**
     * Genera un ataque mediante tiro libre
     * @param {Equipo} atacante El equipo que ataca
     * @param {Equipo} defensor El equipo que defiende
     */
    tiroLibre(atacante, defensor){
        this.agregarEvento(this.minutoActual+"'", `Tiro libre para ${atacante.nombre}`, false, false, null, false);
        this.rematar(atacante, defensor);
    }

    /**
     * Genera un ataque mediante tiro de esquina
     * @param {Equipo} atacante El equipo que ataca
     * @param {Equipo} defensor El equipo que defiende
     */
    tiroDeEsquina(atacante, defensor){
        this.agregarEvento(this.minutoActual+"'", `Tiro de esquina para ${atacante.nombre}`, false, false, null, false);
        this.rematar(atacante, defensor);
    }
    
    /**
     * Amonesta un jugador
     * @param {Equipo} equipo El equipo al que pertenece el jugador
     */
    amonestarJugador(equipo){
        const jugadores = equipo.obtenerJugadoresDisponibles();
        const indiceJugador = this.obtenerIndiceAleatorio(jugadores);
        const jugador = jugadores[indiceJugador];

        if(jugador.amonestado){
            this.expulsarJugador(equipo, indiceJugador);
        } else {
            equipo.amonestar(indiceJugador);
            this.agregarEvento(this.minutoActual+"'", `Tarjeta amarilla para ${jugador.nombre} (${equipo.obtenerNombre()})`, false, false, equipo, false);
        }
    }

    /**
     * Expulsa un jugador
     * @param {Equipo} equipo El equipo al que pertenece el jugador
     * @param {Number} indiceAmonestado El índice del jugador amonestado
     */
    expulsarJugador(equipo, indiceAmonestado){
        const jugadores = equipo.obtenerJugadoresDisponibles();
        const indiceJugador = (indiceAmonestado === null ? this.obtenerIndiceAleatorio(jugadores) : indiceAmonestado);
        const jugador = jugadores[indiceJugador];
        equipo.expulsar(indiceJugador);

        if(jugadores.length >= this.minimoJugadores){
            if(indiceAmonestado === null){
                this.agregarEvento(this.minutoActual+"'", `${jugador.nombre} (${equipo.obtenerNombre()}) consigue una roja directa y ha sido expulsado`, false, false, equipo, false);
            } else {
                this.agregarEvento(this.minutoActual+"'", `${jugador.nombre} (${equipo.obtenerNombre()}) consigue dos tarjetas amarillas y ha sido expulsado`, false, false, equipo, false);
            }
        } else {
            this.minutoSuspension = this.minutoActual;
            this.equipoSuspendido = equipo.obtenerNombre();
            this.agregarEvento(this.minutoActual+"'", `${equipo.obtenerNombre()} consiguió cuatro expulsados y el partido se suspendió`, true, false, equipo, true);
        }
    }

    /**
     * Obtiene el índice aleatorio de un jugador
     * @param {Array} jugadores Los jugadores del equipo
     * @returns {Number} Un índice aleatorio
     */
    obtenerIndiceAleatorio(jugadores){
        let jugadorAleatorio = this.obtenerNumeroAleatorio(jugadores.length);

        while(jugadores[jugadorAleatorio].posicion === "arquero"){
            jugadorAleatorio = this.obtenerNumeroAleatorio(jugadores.length);
        }

        return jugadorAleatorio;
    }

    /**
     * Determina si el equipo que ataca supera al que defiende
     * @param {Equipo} atacante El equipo atacante
     * @param {Number} expAtacante La experiencia del equipo atacante
     * @param {Equipo} defensor El equipo defensor
     * @param {Number} expDefensor La experiencia del equipo defensor
     */
    superarDefensa(atacante, expAtacante, defensor, expDefensor){
        const posibilidadRemate = this.obtenerNumeroAleatorio(expAtacante);
        const posibilidadBloqueo = this.obtenerNumeroAleatorio(expDefensor);
    
        if(this.obtenerNumeroAleatorio(2) === 0){
            this.agregarEvento(this.minutoActual+"'", `${atacante.nombre} ingresa al área rival`, false, false, null, false);
        } else {
            this.agregarEvento(this.minutoActual+"'", `${atacante.nombre} se lanza al ataque`, false, false, null, false);
        }

        if(posibilidadRemate > posibilidadBloqueo){
            this.rematar(atacante, defensor);
        } else if(this.obtenerNumeroAleatorio(2) == 0) {
            this.agregarEvento(this.minutoActual+"'", `${defensor.nombre} defiende con éxito`, false, false, null, false);
        } else {
            this.agregarEvento(this.minutoActual+"'", `La jugada no prospera y ${defensor.nombre} rechaza el balón`, false, false, null, false);
        }
    }
    
    /**
     * Genera un remate al arco
     * @param {Equipo} atacante El equipo atacante
     * @param {Equipo} defensor El equipo defensor
     */
    rematar(atacante, defensor){
        let rematador = this.obtenerRematador(atacante);
        let arquero = this.obtenerArquero(defensor);
        let aleatorioRematador = this.obtenerNumeroAleatorio(rematador.experiencia);
        let aleatorioArquero = (arquero === null ? 0 : this.obtenerNumeroAleatorio(arquero.experiencia));

        if(aleatorioRematador > aleatorioArquero || arquero === null){
            this.agregarEvento(this.minutoActual+"'", `¡Gol de ${atacante.nombre}! (${rematador.nombre})`, false, true, atacante, false);
            atacante.convertirGolPartido();
        } else {
            switch(this.obtenerNumeroAleatorio(5)){
                case 0: 
                    this.agregarEvento(this.minutoActual+"'", `El balón pegó en el palo`, false, false, null, false);
                    break;
                case 1:
                case 2:    
                    this.agregarEvento(this.minutoActual+"'", `${arquero.nombre} atrapó el balón`, false, false, null, false);
                    break;
                default: 
                    this.agregarEvento(this.minutoActual+"'", `Disparo desviado`, false, false, null, false);
            }
        }
    }
    
    /**
     * Obtiene el jugador que remata al arco
     * @param {Equipo} atacante El equipo que ataca
     * @returns {Object} El jugador que va a rematar
     */
    obtenerRematador(atacante){
        let posiblesRematadores = [];
    
        for(let i=0; i<atacante.jugadoresDisponibles.length; i++){
            if(atacante.jugadoresDisponibles[i].posicion !== "arquero"){
                posiblesRematadores.push(atacante.jugadoresDisponibles[i]);
            }
        }
    
        let indiceRematador = this.obtenerNumeroAleatorio(posiblesRematadores.length);
        return posiblesRematadores[indiceRematador];
    }
    
    /**
     * Obtiene un número aleatorio
     * @param {Number} limite El número límite
     * @returns {Number} El número generado
     */
    obtenerNumeroAleatorio(limite){
        return Math.floor(Math.random() * limite);
    }
    
    /**
     * Obtiene el arquero
     * @param {Equipo} equipo El equipo al que pertenece
     * @returns {Object} El arquero
     */
    obtenerArquero(equipo){
        for(let i=0; i<equipo.jugadoresDisponibles.length; i++){
            if(equipo.jugadoresDisponibles[i].posicion === "arquero"){
                return equipo.jugadoresDisponibles[i];
            }
        }

        return null;
    }
    
    /**
     * Obtiene la posibilidad de posesión de un equipo
     * @param {Equipo} equipo El equipo
     * @returns {Number} Un número generado aleatoriamente
     */
    obtenerPosesionBalon(equipo){
        let mediocampistas = [];
        
        for(let i=0; i<equipo.jugadoresDisponibles.length; i++){
            if(equipo.jugadoresDisponibles[i].posicion === "mediocampista"){
                mediocampistas.push(equipo.jugadoresDisponibles[i]);
            }
        }
        
        if(mediocampistas.length === 0){
            return 0;
        }

        const jugadorActual = this.obtenerNumeroAleatorio(mediocampistas.length);
        const posibilidadDePosesion = this.obtenerNumeroAleatorio(mediocampistas[jugadorActual].experiencia);
        return posibilidadDePosesion;
    }
}