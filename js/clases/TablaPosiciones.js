/**
 * Controla la tabla de posiciones de la liga
 */
export class TablaPosiciones {
    /**
     * Crea la tabla de posiciones
     * @param {Array} equipos Los equipos que participan
     */
    constructor(equipos){
        this.equipos = equipos;
        this.ordenados;
    }

    /**
     * Actualiza la tabla ordenando los equipos según los puntos y goles a favor
     */
    actualizar(){
        this.ordenados = this.equipos.sort(function(equipoA, equipoB){
            if(equipoA.pts === equipoB.pts){
                return equipoB.gf - equipoA.gf;
            }
            return equipoB.pts - equipoA.pts;
        });
    }

    /**
     * Obtiene los equipos ordenados
     * @returns {Array} Un array con los equipos
     */
    obtenerEquipos(){
        return this.ordenados;
    }
}