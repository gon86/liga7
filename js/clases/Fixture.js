/**
 * Controla el calendario de fechas
 */
export class Fixture {
    /**
     * Crea el fixture con todos los equipos
     * @param {Array} equipos Los equipos que participan en la liga
     */
    constructor(equipos){
        this.equipos = equipos;
        this.grupoA = [];
        this.grupoB = [];
        this.calendario = [];
        this.cantidadPartidos;
        this.cantidadFechas;
    }

    /**
     * Permite crear el calendario
     */
    crearCalendario(){
        this.separarEnGrupos();

        for(let i=0; i<this.cantidadFechas; i++){
            let fecha = [];
            for(let j=0; j<this.cantidadPartidos; j++){
                fecha.push([this.grupoA[j], this.grupoB[j]]);
            }
            this.calendario.push(fecha);
            this.rotar();
        }
    }

    /**
     * Separa los equipos en dos grupos para definir las fechas
     */
    separarEnGrupos(){
        const total = this.equipos.length;

        for(let i=0; i<total; i++){
            if(i < (total/2)){
                this.grupoA.push(this.equipos[i]);
            } else {
                this.grupoB.push(this.equipos[i]);
            }
        }

        this.cantidadPartidos = this.grupoA.length;
        this.cantidadFechas = (this.cantidadPartidos*2)-1;
    }

    /**
     * Rota los equipos para definir el próximo enfrentamiento respetando el sistema de liga
     */
    rotar(){
        const primero = 0;
        const ultimo = this.grupoA.length - 1;
    
        this.grupoB.push(this.grupoA[ultimo]);
        this.grupoA.splice(ultimo,1);
        this.grupoA.splice(1,0,this.grupoB[primero]);
        this.grupoB.splice(primero,1);
    }

    /**
     * Obtiene el calendario con todas las fechas
     * @returns {Array} El calendario
     */
    obtenerCalendario(){
        return this.calendario;
    }
}