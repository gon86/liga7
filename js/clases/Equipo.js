/**
 * Permite controlar un equipo
 */
export class Equipo {
    /**
     * Crea el equipo con un nombre
     * @param {String} nombre El nombre del equipo
     */
    constructor(nombre){
        this.nombre = nombre;
        this.jugadores = [];
        this.jugadoresDisponibles = [];
        this.puntosDisponibles = 26;
        this.puntosConseguidos = 0;
        this.pts = 0;
        this.gf = 0;
        this.golesPartido = 0;
        this.jugadoresCreados = 0;
        this.jugadoresPermitidos = 7;
    }

    /**
     * Obtiene los puntos de experiencia que ganó el equipo después de un partido
     * @returns {Number} Los puntos conseguidos
     */
    obtenerPuntosConseguidos(){
        return this.puntosConseguidos;
    }

    /**
     * Obtiene la cantidad de jugadores que se han creado
     * @returns {Number} La cantidad de jugadores
     */
    obtenerJugadoresCreados(){
        return this.jugadoresCreados;
    }

    /**
     * Obtiene la cantidad de jugadores permitidos por equipo
     * @returns {Number} La cantidad de jugadores permitidos
     */
    obtenerJugadoresPermitidos(){
        return this.jugadoresPermitidos;
    }

    /**
     * Quita las tarjetas de los jugadores recibidas en un partido
     */
    quitarTarjetas(){
        for(let i=0; i<this.jugadores.length; i++){
            if(this.jugadores[i].amonestado){
                this.jugadores[i].amonestado = false;
            }
        }
    }

    /**
     * Amonesta a un jugador
     * @param {Number} indiceJugador El índice del jugador
     */
    amonestar(indiceJugador){
        this.jugadoresDisponibles[indiceJugador].amonestado = true;
    }

    /**
     * Obtiene los jugadores que no han sido expulsados
     * @returns {Array} Los jugadores
     */
    obtenerJugadoresDisponibles(){
        return this.jugadoresDisponibles;
    }

    /**
     * Reestablece el array de jugadores para comenzar un nuevo partido
     */
    restablecerJugadoresDisponibles(){
        this.jugadoresDisponibles = [];

        for(let i=0; i<this.jugadores.length; i++){
            this.jugadoresDisponibles.push(this.jugadores[i]);
        }
    }

    /**
     * Expulsa a un jugador
     * @param {Number} indiceJugador El indice del jugador
     */
    expulsar(indiceJugador){
        this.jugadoresDisponibles.splice(indiceJugador, 1);
    }

    /**
     * Entrena a los equipos controlados por el ordenador
     */
    entrenar(){
        while(this.puntosDisponibles > 0){
            const jugadorAleatorio = Math.floor(Math.random() * this.jugadores.length);
            this.jugadores[jugadorAleatorio].experiencia++;
            this.puntosDisponibles--;
        }
    }

    /**
     * Agrega los puntos de experiencia al equipo
     * @param {Number} puntos Los puntos conseguidos
     */
    agregarPuntosDisponibles(puntos){
        this.puntosDisponibles += puntos;
        this.puntosConseguidos = puntos;
    }

    /**
     * Actualiza los puntos que se mostrarán en la tabla de posiciones
     * @param {Number} ptsPartido Los puntos obtenidos
     */
    actualizarPts(ptsPartido){
        this.pts += ptsPartido;
    }

    /**
     * Actualiza los goles a favor que se mostrarán en la tabla de posiciones
     */
    actualizarGF(){
        this.gf += this.golesPartido;
    }

    /**
     * Agrega un jugador al equipo
     * @param {String} nombre El nombre del jugador
     * @param {Number} numero El número de camiseta
     * @param {String} posicion La posición del jugador
     */
    agregarJugador(nombre, numero, posicion){
        if(this.jugadoresCreados < this.jugadoresPermitidos){
            const jugador = {
                nombre: nombre, 
                numero: numero, 
                posicion: posicion, 
                experiencia: 0,
                amonestado: false
            };

            this.jugadores.push(jugador);
            this.jugadoresCreados++;
        } else {
            throw "El máximo permitido de jugadores es 7";
        }
    }

    /**
     * Reestablece los goles del partido para comenzar uno nuevo
     */
    restablecerGoles(){
        this.golesPartido = 0;
    }

    /**
     * Obtiene los goles anotados en un partido
     * @returns {Number} Los goles anotados
     */
    obtenerGolesPartido(){
        return this.golesPartido;
    }

    /**
     * Anota un gol
     */
    convertirGolPartido(){
        this.golesPartido++;
    }

    /**
     * Obtiene un jugador
     * @param {Number} indice El índice del jugador
     * @returns {Object} El objeto literal del jugador con sus datos
     */
    obtenerJugador(indice){
        return this.jugadores[indice];
    }

    /**
     * Obtiene todos los jugadores del equipo
     * @returns {Array} Los jugadores
     */
    obtenerJugadores(){
        return this.jugadores;
    }

    /**
     * Obtiene el total de puntos de experiencia del equipo
     * @returns {Number} Los puntos de experiencia que pueden ser utilizados
     */
    obtenerPuntos(){
        return this.puntosDisponibles;
    }

    /**
     * Establece el total de puntos de experiencia del equipo
     * @param {Number} puntos Los puntos de experiencia
     */
    establecerPuntos(puntos){
        this.puntosDisponibles = puntos;
    }

    /**
     * Obtiene el nombre del equipo
     * @returns {String} El nombre
     */
    obtenerNombre(){
        return this.nombre;
    }

    /**
     * Obtiene los puntos ganados a mostrar en la tabla de posiciones
     * @returns {Number} Los puntos conseguidos
     */
    obtenerPts(){
        return this.pts;
    }

    /**
     * Obtiene los goles a favor a mostrar en la tabla de posiciones
     * @returns {Number} Los goles a favor
     */
    obtenerGF(){
        return this.gf;
    }

    /**
     * Reinicia los puntos conseguidos
     */
    reiniciarPts(){
        this.pts = 0;
    }

    /**
     * Reinicia los goles a favor
     */
    reiniciarGF(){
        this.gf = 0;
    }
}