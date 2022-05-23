export const Form = iniciarForm();

/**
 * Inicia el manejador de formulario
 * @returns {Object} Objeto con métodos para validar un formulario
 */
function iniciarForm(){          
    return {
        /**
         * Verifica si ya se ha creado al arquero
         * @param {String} posicion La posición del jugador
         * @param {Equipo} equipo El equipo al que pertenece
         * @returns {Boolean} true si se ha creado el arquero y false caso contrario
         */
        verificarArquero: function(posicion, equipo){
            const jugadores = equipo.obtenerJugadores();
            let hayArquero = false;
        
            for(let i=0; i<jugadores.length; i++){
                if(jugadores[i].posicion === "arquero"){
                    hayArquero = true;
                    break;
                }
            }
        
            if(!hayArquero && posicion !== "arquero" && jugadores.length === (equipo.obtenerJugadoresPermitidos()-1)){
                return false;
            }
        
            return true;
        },

        /**
         * Determina si existe el arquero
         * @param {String} posicion La posicion del jugador
         * @param {Array} jugadores Los jugadores del equipo
         * @returns {Boolean} true si existe o false caso contrario
         */
        existeArquero: function(posicion, jugadores){
            for(let i=0; i<jugadores.length; i++){
                if(jugadores[i].posicion === "arquero" && posicion === "arquero"){
                    return true;
                }
            }
            return false;
        },

        /**
         * Verifica si ya se ha creado un jugador con ese número de camiseta
         * @param {Number} numero El número de camiseta
         * @param {Array} jugadores Los jugadores del equipo
         * @returns {Boolean} true si existe o false caso contrario
         */
        existeNumeroCamiseta: function(numero, jugadores){
            for(let i=0; i<jugadores.length; i++){
                if(jugadores[i].numero === numero){
                    return true;
                }
            }
            return false;
        },

        /**
         * Verifica si existe otro equipo con el mismo nombre
         * @param {String} nombre El nombre del equipo
         * @param {Array} equipos El resto de equipos
         * @returns {Boolean} true si existe o false caso contrario
         */
        existeElEquipo: function(nombre, equipos){
            for(let i=0; i<equipos.length; i++){
                if(equipos[i].nombre.toUpperCase() === nombre.toUpperCase()){
                    return true;
                }
            }
            return false;
        },

        /**
         * Determina si es un nombre válido
         * @param {String} valor El nombre
         * @returns {Boolean} true si es válido o false caso contrario
         */
        esNombre: function(valor){
            const resultado = (valor.trim() !== "" && valor.length >= 3 && valor.length <= 20);
            return resultado;
        },

        /**
         * Determina si es un número de camiseta válido
         * @param {Number} valor El número de camiseta
         * @returns {Boolean} true si es válido o false caso contrario
         */
        esNumeroCamiseta: function(valor){
            const valorConvertido = parseInt(valor);
            const esEntero = valorConvertido.toString() === valor;
            const resultado = esEntero && valorConvertido > 0 && valorConvertido < 100;
            return resultado;
        },

        /**
         * Verifica si el valor es alfanumérico
         * @param {String} valor El valor a verificar
         * @returns {Boolean} true si es alfanumérico o false caso contrario
         */
        esAlfanumerico: function(valor){
            const regex = /^[a-záéíóúñ\d ]*$/i;
            const resultado = regex.test(valor);
            return resultado;
        },

        /**
         * Verifica si el valor es alfabético
         * @param {String} valor El valor a verificar
         * @returns {Boolean} true si es alfabético o false caso contrario
         */
        esAlfabetico: function(valor){
            const regex = /^[a-záéíóúñ ]*$/i;
            const resultado = regex.test(valor);
            return resultado;
        },

        /**
         * Convierte a mayúsculas la primer letra de cada palabra
         * @param {String} valor El texto a convertir
         * @returns {String} El texto convertido
         */
        convertirAMayusculas(valor){
            const sinEspacios = valor.trim();
            const palabras = sinEspacios.split(" ");
            let texto = "";
            let textoFinal = "";

            for(let i=0; i<palabras.length; i++){
                const primerLetra = palabras[i].charAt(0).toUpperCase();
                const restoPalabra = palabras[i].substring(1, palabras[i].length);
                texto += primerLetra + restoPalabra + " ";
            }

            textoFinal = texto.substring(0, texto.length-1);
            return textoFinal;
        }
    }
}
