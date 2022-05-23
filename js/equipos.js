import { Equipo } from "./clases/Equipo.js";

/**
 * Crea equipos predeterminados controlados por el ordenador
 * @param {Array} equipos El array donde se guardarán los equipos
 */
export function crearEquipos(equipos){
    const equipo1 = new Equipo("Los Álamos");
    equipo1.agregarJugador("Ignacio Rojas", "1", "arquero");
    equipo1.agregarJugador("Rubén Pérez", "2", "defensor");
    equipo1.agregarJugador("Alberto Islas", "6", "defensor");
    equipo1.agregarJugador("René Villalba", "5", "mediocampista");
    equipo1.agregarJugador("Arturo López", "8", "mediocampista");
    equipo1.agregarJugador("Esteban Cruz", "10", "mediocampista");
    equipo1.agregarJugador("Damián Redondo", "9", "delantero");
    equipos.push(equipo1);

    const equipo2 = new Equipo("Atribuciones");
    equipo2.agregarJugador("Pedro Damato", "1", "arquero");
    equipo2.agregarJugador("Luis Almendra", "2", "defensor");
    equipo2.agregarJugador("Ernesto López", "3", "defensor");
    equipo2.agregarJugador("Adrián Funes", "5", "mediocampista");
    equipo2.agregarJugador("Lucas Junín", "10", "mediocampista");
    equipo2.agregarJugador("Marcos Salvio", "7", "delantero");
    equipo2.agregarJugador("José Rondeau", "9", "delantero");
    equipos.push(equipo2);

    const equipo3 = new Equipo("Vendaval FC");
    equipo3.agregarJugador("Arnaldo Villa", "1", "arquero");
    equipo3.agregarJugador("Arturo Redrado", "2", "defensor");
    equipo3.agregarJugador("Rafael Pareto", "5", "mediocampista");
    equipo3.agregarJugador("David Minujín", "7", "mediocampista");
    equipo3.agregarJugador("Luciano Valverde", "8", "mediocampista");
    equipo3.agregarJugador("Oscar Méndez", "9", "delantero");
    equipo3.agregarJugador("Gonzalo Rivas", "11", "delantero");
    equipos.push(equipo3);
    
    const equipo4 = new Equipo("CA Barraquero");
    equipo4.agregarJugador("Francisco Troglio", "1", "arquero");
    equipo4.agregarJugador("Martín Hernández", "6", "defensor");
    equipo4.agregarJugador("Enzo Vilkas", "14", "mediocampista");
    equipo4.agregarJugador("Ignacio Torres", "5", "mediocampista");
    equipo4.agregarJugador("Gonzalo Arias", "8", "mediocampista");
    equipo4.agregarJugador("Renzo Funes", "20", "delantero");
    equipo4.agregarJugador("Armando López", "11", "delantero");
    equipos.push(equipo4);

    const equipo5 = new Equipo("Deportivo Aliados");
    equipo5.agregarJugador("Lucas Vidal", "1", "arquero");
    equipo5.agregarJugador("Ezequiel Flores", "6", "defensor");
    equipo5.agregarJugador("Gabriel Durantini", "18", "defensor");
    equipo5.agregarJugador("Javier Quezada", "5", "mediocampista");
    equipo5.agregarJugador("Ignacio Campos", "8", "mediocampista");
    equipo5.agregarJugador("Maxi Torrente", "22", "delantero");
    equipo5.agregarJugador("Andrés Estévez", "7", "delantero");
    equipos.push(equipo5);

    const equipo6 = new Equipo("Fuerza Real");
    equipo6.agregarJugador("Alejandro Paredes", "1", "arquero");
    equipo6.agregarJugador("Juan Díaz", "4", "defensor");
    equipo6.agregarJugador("Nicolás Funes", "5", "defensor");
    equipo6.agregarJugador("Ernesto Villa", "10", "mediocampista");
    equipo6.agregarJugador("Rubén Calles", "30", "delantero");
    equipo6.agregarJugador("Aldo Méndez", "9", "delantero");
    equipo6.agregarJugador("Martín De Lucía", "7", "delantero");
    equipos.push(equipo6);

    const equipo7 = new Equipo("Atlético Rojas");
    equipo7.agregarJugador("Ismael Trejo", "1", "arquero");
    equipo7.agregarJugador("Adrián Pereira", "2", "defensor");
    equipo7.agregarJugador("Ariel Centeno", "4", "defensor");
    equipo7.agregarJugador("Pedro Villalba", "15", "defensor");
    equipo7.agregarJugador("Leandro Minuzzi", "10", "mediocampista");
    equipo7.agregarJugador("Marcos Rivas", "7", "mediocampista");
    equipo7.agregarJugador("Esteban Mitre", "11", "delantero");
    equipos.push(equipo7);
}
