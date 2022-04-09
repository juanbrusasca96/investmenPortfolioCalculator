//calcula la asignacion de activos para una cartera de inversion segun la edad y el perfil del inversor
let edad = prompt("ingrese su edad");
alert("ingrese su perfil del inversor");
let perfilInversor = pedirValor("perfil");
const perfiles = [];
perfiles.push("conservador");
perfiles.push("moderado");
perfiles.push("agresivo");
perfilInversor = perfiles[perfilInversor]; //seleccino el perfil del inversor mediante un indice, el cual me lo devuelve la funcion pedir valor
const porcentajesCarteraDavidSwensen = [30, 20, 15, 5, 15, 15]; //guarda por defecto los pesos porcentuales de la cartera original de swensen

function redondearADosDecimales(num) { //redondea los numeros a dos decimales
    return +(Math.round(num + "e+2") + "e-2");
}

class Persona {
    constructor(edad, perfil) { 
        this.edad = edad;
        this.perfil = perfil;
        if (perfil === "conservador") { //asigna la regla correspondiente segun el perfil del inversor
            this.regla = 100;
        }
        else if (perfil === "moderado") {
            this.regla = 110;
        }
        else if (perfil === "agresivo") {
            this.regla = 120;
        }
        if (this.edad > this.regla) { //si la edad es mayor que la regla, la edad es la regla. por ej: si pongo que tengo 105 años y utilizo la regla del 100, voy a tener como consecuencia porcentajes negativos en algunos activos, por lo tanto el maximo de la edad debe ser 100 para este caso y aunque la persona siguiera creciendo su cartera ya llego al tope de cartera conservadora
            this.edad = this.regla;
        }
        if (this.edad < this.regla - 100) { //caso similar al de arriba. si por ejemplo pongo que tengo 15 años y utilizo la regla del 120, voy a obtener porcebtajes negativos en algunos activos por lo tanto el minimo de edad para este caso deberia ser 20, el cual con esta configuracion ya esta en el tope de cartera agresiva por lo tanto aunque la persona sea mas chica la cartera no puede ser mas agresiva de lo que ya es
            this.edad = this.regla - 100;
        }
        this.acciones = this.regla - this.edad; //calcula el porcentaje de la parte agresiva, la que tiene en mayor medida acciones
        this.bonos = 100 - this.acciones; //calcula el porcentaje de la parte conservadora que tendra mayormente bonos
        this.cartera = []; //creo un arreglo cartera donde luego guardare los etf que la componen
    }

    calcularPorcentajeAcciones(edad) { //calculo el porcentaje de acciones teniendo en cuenta la edad pasada por parametro y retorno dicho porcentaje
        return this.regla - edad;
    }

    conformarCartera(carteraDavidSwensen, cartera, porcentajeAcciones, porcentajeBonos) { //conforma la cartera teniendo en cuenta una cartera por default de david swensen, una cartera la cual se llenara con los etf y su porcentaje correspondiente, y para dicho calculo tengo en cuenta el porcentaje de acciones y bonos pasado por parametro
        for (let i = 0; i < 4; i++) { //calculo los porcentajes de los etf que conforman la parte de acciones
            carteraDavidSwensen[i].porcentaje = redondearADosDecimales(porcentajeAcciones * porcentajesCarteraDavidSwensen[i] / 70);
            cartera.push(carteraDavidSwensen[i]); //cargo los etf en la cartera
        }
        for (let i = 4; i < 6; i++) { //calculo los porcentajes de los etf de la parte de bonos
            carteraDavidSwensen[i].porcentaje = redondearADosDecimales(porcentajeBonos * porcentajesCarteraDavidSwensen[i] / 30);
            cartera.push(carteraDavidSwensen[i]); //cargo los etf en la cartera
        }
        return cartera;
    }

    calcularRendimientoCartera(cartera) { //calcula el rendimiento de una cartera teniendo en cuenta los etf que la componen, el porcentaje de cada uno y un rendimiento promedio
        let rendimiento = 0;
        for (let i = 0; i < cartera.length; i++) {
            rendimiento += cartera[i].porcentaje * cartera[i].rendimientoPromedio / 100;
        }
        return rendimiento;
    }

    calcularRendimientoPromedio50Anos() { //calcula el rendimiento promedio de una cartera en 50 años, teniendo en cuenta que el peso porcentual de los activos que la componen se va modificando a lo largo de los años
        let edadFicticia = this.edad; //trabajo con una edad ficticia para no modificar la edad de la persona, teniendo en cuena que la edad se ira incrementando
        const carteraDavidSwensenFicticia = carteraDavidSwensen; //trabajo con una copia de la cartera por default de swensen para no modificar el arreglo original
        let sumaRendimiento = 0;
        for (let i = 0; i < 50; i++) {
            sumaRendimiento += this.calcularRendimientoCartera(this.conformarCartera(carteraDavidSwensenFicticia, [],
                this.calcularPorcentajeAcciones(edadFicticia), 100 - this.calcularPorcentajeAcciones(edadFicticia))); //sumo los rendimientos de los proximos 50 años, utilizo las funciones anteriores de la clase persona
            if (edadFicticia < this.regla) { //mientras la edad sea menos que la regla, se incrementa. en caso de que la edad alcance a la regla (por ej: que esta edad ficticia llegue a 100) la edad deja de incrementarse porque llegamos al tope y la cartera no puede ser mas conservadora
                edadFicticia++;
            }
        }
        return sumaRendimiento / 50; //retorno el promedio como la suma de los rendimientos dividido la cantidad de años, 50
    }
}

class ETF { //clase etf, los cuales tendran un nombre, un porcentaje dentro de la cartera y un rendimiento promedio
    constructor(nombre, porcentaje, rendimientoPromedio) {
        this.nombre = nombre;
        this.porcentaje = porcentaje;
        this.rendimientoPromedio = rendimientoPromedio;
    }
}

const persona = new Persona(edad, perfilInversor);

const spy = new ETF("SPY", 0, 10.97);
const vnq = new ETF("VNQ", 0, 9.12);
const vea = new ETF("VEA", 0, 3.49);
const vwo = new ETF("VWO", 0, 2.29);
const tip = new ETF("TIP", 0, 4.08);
const tlt = new ETF("TLT", 0, 6.38);
const carteraDavidSwensen = [spy, vnq, vea, vwo, tip, tlt]; //cargo los etf que conformaran la cartera de swensen por defecto. dichos etf todavia no tienen un porcentaje asignado dentro de la cartera

persona.conformarCartera(carteraDavidSwensen, persona.cartera, persona.acciones, persona.bonos); //asigno el porcentaje de cada etf dentro de la cartera, teniendo en cuenta la parte de acciones y la de bonos, las cuales se calculan teniendo en cuenta la regla y la edad (esto ultimo se hace en el constructor de la clase persona)

let mensaje = "";

for (let i = 0; i < persona.cartera.length; i++) {
    mensaje += persona.cartera[i].nombre + ": " + persona.cartera[i].porcentaje + "%\n"; //guardo los porcentajes de cada etf junto con su nombre para luego mostrarlos en el mensaje que sale por alert
}

mensaje += "Esta cartera tiene un rendimiento promedio de " + redondearADosDecimales(persona.calcularRendimientoCartera(persona.cartera)) +
    " %, teniendo en cuenta los rendimientos de todos los intrumentos " +
    "(desde enero 2008, hasta diciembre 2021) y su peso porcentual dentro de la cartera.\n" +
    "A su vez esta cartera tiene un rendimiento promedio en los proximos 50 años de " + redondearADosDecimales(persona.calcularRendimientoPromedio50Anos()) +
    " %, teniendo en cuenta que las posiciones de la cartera se van modificando en su valor porcentual año a año.\n" + 
    "Puede usar alguno de estos valores (recomendamos el ultimo, ya que tiene en cuenta el cambio de las posiciones de la cartera a largo plazo) " + 
    "en nuestra calculadora de interes compuesto que se encuentra mas abajo."

alert(mensaje);


//calcula el interes compuesto segun los datos ingresados

let balanceFinal = 0;
let inversionInicial = prompt("ingrese la inversion inicial (solo valido enteros sin separador de miles)");
let tasaInteres = prompt("ingrese la tasa de interes (en %)");
alert("ingrese la frecuencia con la cual se aplicara este interes. ");
let frecuenciaTasaInteres = pedirValor();
let cantidadAños = prompt("ingrese la cantidad de años");
let aporte = prompt("ingrese el aporte que va a realizar (solo valido enteros sin separador de miles)");
alert("ingrese la frecuencia con la cual se realizaran estos aportes. ");
let frecuenciaAporte = pedirValor();

function pedirValor(perfil) { //funcion que pide un valor especifico y en caso de no estar dentro del rango sigue pidiendolo indefinidamente
    let num = 0;
    let valor = 0;
    if (perfil === "perfil") { //si lo que pido es el perfil del inversor entra en esta seccion de la funcion
        do {
            num = prompt("Puede ser: 1 - conservador, 2 - moderado, 3 - agresivo. " +
                "Cualquier otro numero ingresado sera ignorado y se le pedira que ingrese un numero nuevamente.");
        } while (num < 1 || num > 3);
        if (num == 1) { //valor toma 0, 1 o 2 porque luego esto servira como indice para acceder a un arreglo que contiene los 3 perfiles de inversor
            valor = 0;
        }
        else if (num == 2) {
            valor = 1;
        }
        else if (num == 3) {
            valor = 2;
        }
    }
    else { //en caso de que lo que pida no sea el perfil del inversor se ejecuta esta seccion de la funcion
        do {
            num = prompt("Puede ser: 1 - anual, 2 - dos veces al año, 3 - cada trimestre, 4 - cada mes. " +
                "Cualquier otro numero ingresado sera ignorado y se le pedira que ingrese un numero nuevamente.");
        } while (num < 1 || num > 4);
        if (num == 1) { //valor toma la cantidad de periodos seleccionados que hay en un año, por ejemplo si selecciono 3 - cada trimestre, hay 4 trimestres en un año, por lo tanto valor = 4
            valor = 1;
        }
        else if (num == 2) {
            valor = 2;
        }
        else if (num == 3) {
            valor = 4;
        }
        else if (num == 4) {
            valor = 12;
        }
    }
    return valor;
}

tasaInteres = tasaInteres / 100; //convierto la tasa de interes a un valor porcentual

balanceFinal = inversionInicial * Math.pow(1 + tasaInteres / frecuenciaTasaInteres, frecuenciaTasaInteres * cantidadAños) + aporte * frecuenciaAporte * (Math.pow(1 + tasaInteres / frecuenciaTasaInteres, frecuenciaTasaInteres * cantidadAños) - 1) / (tasaInteres / frecuenciaTasaInteres); //calculo el balance final teniendo en cuenta la formula de interes compuesto
balanceFinal = Math.round(balanceFinal); //redondeo el balance final

const separadorMiles = (number) => { //funcion que sirve para agregar un separador de miles a un numero
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1.';
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join('.') : arr[0];
}

alert("el balance final sera: " + separadorMiles(balanceFinal)); //muestro el balance final, redondeado y con separador de miles