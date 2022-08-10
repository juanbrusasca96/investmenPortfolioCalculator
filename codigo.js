//calcula la asignacion de activos para una cartera de inversion segun la edad y el perfil del inversor

const colorLetraGraficos = 'rgb(246, 246, 234)';//constante que guarda del color de letra de los graficos

class Persona {
    constructor(edad, perfil) {
        this.edad = edad;
        this.perfil = perfil;
        if (perfil === "Conservador") { //asigna la regla correspondiente segun el perfil del inversor
            this.regla = 100;
        }
        else if (perfil === "Moderado") {
            this.regla = 110;
        }
        else if (perfil === "Agresivo") {
            this.regla = 120;
        }
        this.edad > this.regla ? this.edad = this.regla : 0;//si la edad es mayor que la regla, la edad es la regla.
        this.edad < this.regla - 100 ? this.edad = this.regla - 100 : 0;//caso similar al de arriba. si por ejemplo pongo que tengo 15 años y utilizo la regla del 120, voy a obtener porcebtajes negativos en algunos activos por lo tanto el minimo de edad para este caso deberia ser 20, el cual con esta configuracion ya esta en el tope de cartera agresiva por lo tanto aunque la persona sea mas chica la cartera no puede ser mas agresiva de lo que ya es
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
            edadFicticia < this.regla ? edadFicticia++ : 0;//mientras la edad sea menos que la regla, se incrementa. en caso de que la edad alcance a la regla (por ej: que esta edad ficticia llegue a 100) la edad deja de incrementarse porque llegamos al tope y la cartera no puede ser mas conservadora
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


//inicializo todos los etyf (en objetos) posibles
const spy = new ETF("SPY", 0, 10.66);
const vnq = new ETF("VNQ", 0, 8.95);
const vea = new ETF("VEA", 0, 3.49);
const vwo = new ETF("VWO", 0, 5.73);
const tip = new ETF("TIP", 0, 4.42);
const tlt = new ETF("TLT", 0, 6.26);
const ivv = new ETF("IVV", 0, 8.38);
const voo = new ETF("VOO", 0, 15.1);
const xlre = new ETF("XLRE", 0, 12.64);
const iyr = new ETF("IYR", 0, 9.88);
const idev = new ETF("IDEV", 0, 6.67);
const schf = new ETF("SCHF", 0, 6.21);
const eem = new ETF("EEM", 0, 7.62);
const sche = new ETF("SCHE", 0, 2.78);
const ivol = new ETF("IVOL", 0, 6.39);
const ief = new ETF("IEF", 0, 4.48);
const iusb = new ETF("IUSB", 0, 3.28);
let etfs = [spy, vnq, vea, vwo, tip, tlt, ivv, voo, xlre, iyr, idev, schf, eem, sche, ivol, ief, iusb];//creo un array que almacenara todos los etfs posibles

let carteraDavidSwensen = [spy, vnq, vea, vwo, tip, tlt]; //cargo los etf que conformaran la cartera de swensen por defecto. dichos etf todavia no tienen un porcentaje asignado dentro de la cartera

function redondearADosDecimales(num) { //redondea los numeros a dos decimales
    return +(Math.round(num + "e+2") + "e-2");
}

function obtenerNumeroFrecuencia(string) { //funcion que devuelve la cantidad de periodos que entran en un año. por ej: hay 4 trimestres en un año
    if (string === "Anual") {
        string = 1;
    }
    else if (string === "Dos veces al año") {
        string = 2;
    }
    else if (string === "Cada trimestre") {
        string = 4;
    }
    else if (string === "Cada mes") {
        string = 12;
    }
    return string;
}

const separadorMiles = (number) => { //funcion que sirve para agregar un separador de miles a un numero
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1.';
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join('.') : arr[0];
}

let divInflacion = document.getElementById("inflacion");
let textoInflacion = document.createElement("p");

//pido el dato de inflacion mediante una API
const pedirInflacion = async () => {
    const resp = await fetch(`https://www.alphavantage.co/query?function=INFLATION&apikey=VBPH2DQHCXK2HN3H`);
    const data = await resp.json();
    textoInflacion.innerText = `Teniendo en cuenta que la inflación supone una erosión del ahorro, quizá la más significativa en lo que respecta a la inversión es que, independientemente de nuestro perfil, el verdadero riesgo es no estar invertido. Tan solo en el año ${data.data[0].date.slice(0, 4) - 1} la inflacion en dolares fue de un ${String(redondearADosDecimales(data.data[0].value)).replace(".", ",")}%. Aceptar la inflación es aceptar una pérdida de poder adquisitivo segura cada año.`;
    divInflacion.append(textoInflacion);
}

pedirInflacion();

const porcentajesCarteraDavidSwensen = [30, 20, 15, 5, 15, 15]; //guarda por defecto los pesos porcentuales de la cartera original de swensen

let formularioCartera = document.getElementById("formularioCartera"); //selecciono el nodo del div de la parte del formulario correspondiente a la composicion de cartera
let mensaje = document.createElement("div");//creo un parrafo que luego me servira para mostrar el resultado de la composicion de la cartera
let grafico = document.createElement("div");//creo el div que luego mostrara el grafico de la composicion de la cartera

let formularioInteres = document.getElementById("formularioInteres"); //selecciono el nodo del div de la parte del formulario correspondiente a la calculadora de interes compuesto
let formulario = document.createElement("form"); //creo un form que luego sera el formulario de la calculadora de interes compuesto

let botonCartera = document.getElementById("botonCartera"); //selecciono el nodo del boton que calculara la composicion de cartera

let carritoETF = document.getElementById("futuro-carrito-etf");//selecciono el nodo div que va a contener el carrito de etfs
let carritoETFHTML = document.createElement("div");//creo el div que luego sera el carrito de etfs

//creo una variable que sera el html del carrito, hago esto para no repetir codigo mas adelante
let html = `<div class="carrito-etf"> 
<h4>ETF de acciones estadounidenses (S&P500)</h4>
<div class="carrito-etf-accionesusa carrito-etf-gen">
    <div class="form-check">
        <input class="form-check-input" type="radio" id="SPY" name="accionesusa" />
        <label class="form-check-label" for="SPY"><img src="../investmenPortfolioCalculator/fotos/spy.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" id="IVV" name="accionesusa" />
        <label class="form-check-label" for="IVV"><img src="../investmenPortfolioCalculator/fotos/ivv.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" id="VOO" name="accionesusa" />
        <label class="form-check-label" for="VOO"><img src="../investmenPortfolioCalculator/fotos/voo.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
</div>
<h4>ETF de acciones de empresas que invierten en bienes raices</h4>
<div class="carrito-etf-bienesraices carrito-etf-gen">
    <div class="form-check">
        <input class="form-check-input" type="radio" id="XLRE" name="bienesraices" />
        <label class="form-check-label" for="XLRE"><img src="../investmenPortfolioCalculator/fotos/xlre.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" id="IYR" name="bienesraices" />
        <label class="form-check-label" for="IYR"><img src="../investmenPortfolioCalculator/fotos/iyr.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" id="VNQ" name="bienesraices" />
        <label class="form-check-label" for="VNQ"><img src="../investmenPortfolioCalculator/fotos/vnq.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
</div>
<h4>ETF de acciones de empresas de mercados desarrollados</h4>
<div class="carrito-etf-mercadosdesarrollados carrito-etf-gen">
    <div class="form-check">
        <input class="form-check-input" type="radio" id="VEA" name="mercadosdesarrollados" />
        <label class="form-check-label" for="VEA"><img src="../investmenPortfolioCalculator/fotos/vea.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" id="IDEV" name="mercadosdesarrollados" />
        <label class="form-check-label" for="IDEV"><img src="../investmenPortfolioCalculator/fotos/idev.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" id="SCHF" name="mercadosdesarrollados" />
        <label class="form-check-label" for="SCHF"><img src="../investmenPortfolioCalculator/fotos/schf.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
</div>
<h4>ETF de acciones de empresas de mercados emergentes</h4>
<div class="carrito-etf-mercadosdesemergentes carrito-etf-gen">
    <div class="form-check">
        <input class="form-check-input" type="radio" id="VWO" name="mercadosemergentes" />
        <label class="form-check-label" for="VWO"><img src="../investmenPortfolioCalculator/fotos/vwo.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" id="EEM" name="mercadosemergentes" />
        <label class="form-check-label" for="EEM"><img src="../investmenPortfolioCalculator/fotos/eem.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" id="SCHE" name="mercadosemergentes" />
        <label class="form-check-label" for="SCHE"><img src="../investmenPortfolioCalculator/fotos/sche.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
</div>
<h4>ETF de bonos protegidos contra la inflacion (en USD)</h4>
<div class="carrito-etf-bonosinflacion carrito-etf-gen">
    <div class="form-check">
        <input class="form-check-input" type="radio" id="IVOL" name="bonosinflacion" />
        <label class="form-check-label" for="IVOL"><img src="../investmenPortfolioCalculator/fotos/ivol.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" id="TIP" name="bonosinflacion" />
        <label class="form-check-label" for="TIP"><img src="../investmenPortfolioCalculator/fotos/tip.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="completa">
    </div>
</div>
<h4>ETF de bonos del tesoro de estados unidos a largo plazo</h4>
<div class="carrito-etf-bonosinflacion carrito-etf-gen">
    <div class="form-check">
        <input class="form-check-input" type="radio" id="TLT" name="bonoslargoplazo" />
        <label class="form-check-label" for="TLT"><img src="../investmenPortfolioCalculator/fotos/tlt.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" id="IEF" name="bonoslargoplazo" />
        <label class="form-check-label" for="IEF"><img src="../investmenPortfolioCalculator/fotos/ief.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
    <div class="form-check">
        <input class="form-check-input" type="radio" id="IUSB" name="bonoslargoplazo" />
        <label class="form-check-label" for="IUSB"><img src="../investmenPortfolioCalculator/fotos/iusb.jpg"
                class="img-fluid imagen-etf" /></label>
    </div>
</div>
</div>`;

if (localStorage.getItem("listaEtfs") === null) {//si el usuario entra por primera vez a la pagina no tendra un carrito cargado, por lo tanto se ejecuta lo siguiente
    //cargo el html de la cartera recomendada
    carritoETFHTML.innerHTML = `<div class="carrito-etf-existente">
    <p class="fw-bold">Nuestra cartera recomendada esta conformada por los siguientes ETFS:</p>`
    let listaEtfs = JSON.parse(localStorage.getItem("listaEtfs"));
    carritoETFHTML.innerHTML += `<p> SPY: ETF de acciones estadounidenses (S&P500) </p>`;
    carritoETFHTML.innerHTML += `<p> VNQ: ETF de acciones de empresas que invierten en bienes raices </p>`;
    carritoETFHTML.innerHTML += `<p> VEA: ETF de acciones de empresas de mercados desarrollados </p>`;
    carritoETFHTML.innerHTML += `<p> VWO: ETF de acciones de empresas de mercados emergentes </p>`;
    carritoETFHTML.innerHTML += `<p> TIP: ETF de bonos protegidos contra la inflacion (en USD) </p>`;
    carritoETFHTML.innerHTML += `<p> TLT: ETF de bonos del tesoro de estados unidos a largo plazo </p>`;
    carritoETFHTML.innerHTML += `<p class="fw-bold">¿Desea conformar una cartera usted mismo?</p>
    <label class="switch">
        <input type="checkbox" id="switcher">
        <span class="slider"></span>
    </label>
    </div>`
    carritoETF.append(carritoETFHTML);

    let switcher = document.getElementById("switcher");//switch que sirve para que el usuario elija si quiere crear una cartera el mismo o usar la recomendada
    let switcherCarritoETFHTML = document.createElement("div");//div que luego contendra el carrito de etf

    switcher.addEventListener("click", () => {//cuando se clickea el switch se ejecuta lo siguiente
        if (!!switcher.checked) {
            switcherCarritoETFHTML.innerHTML = html;//se carga el carrito de etfs
            carritoETF.append(switcherCarritoETFHTML);
        }
        else {
            switcherCarritoETFHTML.innerHTML = ``;//cuando se clickea nuevamente se borra el carrito de etfs
            carritoETF.append(switcherCarritoETFHTML);
        }
    });
}
else {//si el usuario ya habia ingresado y cargado su cartera personalizada antes, esta se recupera del local storage y se le avisa al usuario que tiene una cartera previamente cargada
    //html que describe la cartera previamente cargada
    carritoETFHTML.innerHTML = `<div class="carrito-etf-existente">
    <p class="fw-bold">Usted ya tiene una cartera conformada por los siguientes ETFS:</p>`
    let listaEtfs = JSON.parse(localStorage.getItem("listaEtfs"));
    carritoETFHTML.innerHTML += `<p>` + listaEtfs[0].nombre + `: ETF de acciones estadounidenses (S&P500) </p>`;
    carritoETFHTML.innerHTML += `<p>` + listaEtfs[1].nombre + `: ETF de acciones de empresas que invierten en bienes raices </p>`;
    carritoETFHTML.innerHTML += `<p>` + listaEtfs[2].nombre + `: ETF de acciones de empresas de mercados desarrollados </p>`;
    carritoETFHTML.innerHTML += `<p>` + listaEtfs[3].nombre + `: ETF de acciones de empresas de mercados emergentes </p>`;
    carritoETFHTML.innerHTML += `<p>` + listaEtfs[4].nombre + `: ETF de bonos protegidos contra la inflacion (en USD) </p>`;
    carritoETFHTML.innerHTML += `<p>` + listaEtfs[5].nombre + `: ETF de bonos del tesoro de estados unidos a largo plazo </p>`;
    carritoETFHTML.innerHTML += `<p class="fw-bold">¿Desea conformar nuevamente una cartera?</p>
    <label class="switch">
        <input type="checkbox" id="switcher">
        <span class="slider"></span>
    </label>
    </div>`
    carritoETF.append(carritoETFHTML);

    carteraDavidSwensen = listaEtfs;//se reemplaza la cartera recomendada por esta previamente cargada

    let switcher = document.getElementById("switcher");//switch que permite al usuario elegir entre su cartera previamente cargada o armar una nueva
    let switcherCarritoETFHTML = document.createElement("div");//div que contengra el carrito de etfs

    switcher.addEventListener("click", () => {//cuando se clickea el switch se ejecuta lo siguiente
        if (!!switcher.checked) {
            switcherCarritoETFHTML.innerHTML = html;//se carga el html del carrito de etfs
            carritoETF.append(switcherCarritoETFHTML);
        }
        else {
            switcherCarritoETFHTML.innerHTML = ``;//cuando se vuelve a clickear el switch se borra el carrito de etfs
            carritoETF.append(switcherCarritoETFHTML);
        }
    });
}

botonCartera.addEventListener("click", () => { //cuando se hace click en el boton de calcular en la seccion de composicion de cartera se ejecurara lo siguiente
    let edad = document.getElementById("edadCartera").value; //obtengo el valor de la edad
    let perfilInversor = document.getElementById("selectCartera").value; //obtengo el perfil del inversor

    const persona = new Persona(edad, perfilInversor); //creo un objeto persona con los datos de edad y perfil antes obtenidos del formulario
    let nuevaCarteraDavidSwensen = [];//creo un nuevo array que contendra la cartera personalizada del usuario
    let carritoCartera = document.getElementsByClassName("form-check-input")//obtengo los nodos de los inputs (etfs) seleccionables
    for (let i = 0; i < carritoCartera.length; i++) {
        if (!!carritoCartera[i].checked) {//si el input esta seleccionado se ejecuta lo siguiente
            for (let j = 0; j < etfs.length; j++) {//recorro el array que contiene todos los etfs posibles
                etfs[j].nombre === carritoCartera[i].id ? nuevaCarteraDavidSwensen.push(etfs[j]) : 0;//si el id del input seleccionado (que es el nombre del etf) coincide con el nombre de alguno de los etfs del arreglo, este etf se agrega a un nuevo array que tiene los etfs que conformaran la cartera
            }
        }
    }

    nuevaCarteraDavidSwensen.length === 6 ? localStorage.setItem("listaEtfs", JSON.stringify(nuevaCarteraDavidSwensen)) : 0;//si y solo si se seleccionaron los 6 etfs que conformaran la cartera esta se guarda en local storage

    nuevaCarteraDavidSwensen.length === 6 ? carteraDavidSwensen = nuevaCarteraDavidSwensen : 0;//si y solo si se seleccionaron los 6 etfs que conformaran la cartera, esta reemplaza a la cartera recomendada

    persona.conformarCartera(carteraDavidSwensen, persona.cartera, persona.acciones, persona.bonos); //asigno el porcentaje de cada etf dentro de la cartera, teniendo en cuenta la parte de acciones y la de bonos, las cuales se calculan teniendo en cuenta la regla y la edad (esto ultimo se hace en el constructor de la clase persona)

    //html que contiene el grafico de la composicion de cartera
    grafico.innerHTML = `<div class="chart-container"> 
                            <div class="chart-container-composicion-tamaño">
                                <canvas id="composicionCartera" width="400" height="400"></canvas>
                            </div>
                        </div>`;

    formularioCartera.append(grafico);

    //grafico de la composicion de cartera usando chart js
    const composicionCartera = document.getElementById('composicionCartera');
    const graficoComposicionCartera = new Chart(composicionCartera, {
        type: 'pie',
        data: {
            labels: persona.cartera.map((e) => e.nombre),//se cargan los nombres de los etfs que componen la cartera
            datasets: [{
                data: persona.cartera.map((e) => e.porcentaje),//se cargan los porcentajes de los etfs que componen la cartera
                backgroundColor: [
                    'rgb(50, 102, 204)',
                    'rgb(219, 56, 21)',
                    'rgb(253, 154, 1)',
                    'rgb(14, 149, 28)',
                    'rgb(0, 156, 195)',
                    'rgb(154, 0, 153)'
                ],
                hoverOffset: 4,
            }],
        },
        options: {
            layout: {
                padding: 30
            },
            plugins: {
                tooltip: {
                    enabled: false
                },
                datalabels: {
                    formatter: (value) => {
                        return `${value}%`;//se muestra el valor del pocentaje junto con el signo %
                    },
                    color: colorLetraGraficos
                },
                legend: {
                    position: 'right',
                    labels: {
                        color: colorLetraGraficos,
                        font: {
                            size: 15
                        }
                    }
                }
            }

        },
        plugins: [ChartDataLabels]
    });
    //------------------

    let composicion = "";

    for (let i = 0; i < persona.cartera.length; i++) {
        composicion += persona.cartera[i].nombre + ": " + persona.cartera[i].porcentaje + "% <br>"; //guardo los porcentajes de cada etf junto con su nombre para luego mostrarlos en el mensaje que sale por alert
    }
    //mensaje que aparece mostrando los resultados de la composicion de la cartera
    mensaje.innerHTML = `<p> ${composicion} <br>
        Esta cartera tiene un rendimiento promedio de  ${redondearADosDecimales(persona.calcularRendimientoCartera(persona.cartera))}
        %, teniendo en cuenta los rendimientos de todos los intrumentos
        (desde enero 2008, hasta diciembre 2021) y su peso porcentual dentro de la cartera.<br>
        A su vez esta cartera tiene un rendimiento promedio en los proximos 50 años de  ${redondearADosDecimales(persona.calcularRendimientoPromedio50Anos())}
        %, teniendo en cuenta que las posiciones de la cartera se van modificando en su valor porcentual año a año.<br>
        Puede usar alguno de estos valores (recomendamos el ultimo, ya que tiene en cuenta el cambio de las posiciones de la cartera a largo plazo)
        en nuestra calculadora de interes compuesto que se encuentra mas abajo.</p>`
    formularioCartera.append(mensaje);//agrego este mensaje a la parte final del div del formulario de la cartera

    //cuando se detecta un mouseup en el boton calcular se destruye el grafico para crear uno nuevo
    botonCartera.addEventListener("mouseup", () => {
        graficoComposicionCartera.destroy();
    })

    //creo el formulario de interes compuesto
    formulario.innerHTML = `<fieldset>
    <legend class="fw-bold">Calculadora de interes compuesto</legend>
    <div class="mb-3">
        <label for="disabledTextInput" class="form-label">Inversion inicial</label>
        <input type="text" id="inversionInicial" class="form-control"
            placeholder="ingresar enteros sin separador de miles">
    </div>
    <div class="mb-3">
        <label for="disabledTextInput" class="form-label">Tasa de interes</label>
        <input type="text" id="tasaInteres" class="form-control" placeholder="ingresar valor en %">
    </div>
    <div class="mb-3">
        <label for="disabledSelect" class="form-label">Frecuencia de la tasa de interes</label>
        <select id="selectInteresFrecuenciaTasa" class="form-select">
            <option selected disable hidden>Selecione aqui</option>
            <option>Anual</option>
            <option>Dos veces al año</option>
            <option>Cada trimestre</option>
            <option>Cada mes</option>
        </select>
    </div>
    <div class="mb-3">
        <label for="disabledTextInput" class="form-label">Cantidad de años</label>
        <input type="text" id="cantidadAnos" class="form-control">
    </div>
    <div class="mb-3">
        <label for="disabledTextInput" class="form-label">Aporte a realizar</label>
        <input type="text" id="aporte" class="form-control"
            placeholder="ingresar enteros sin separador de miles">
    </div>
    <div class="mb-3">
        <label for="disabledSelect" class="form-label">Frecuencia de los aportes</label>
        <select id="selectInteresFrecuenciaAporte" class="form-select">
            <option selected disable hidden>Selecione aqui</option>
            <option>Anual</option>
            <option>Dos veces al año</option>
            <option>Cada trimestre</option>
            <option>Cada mes</option>
        </select>
    </div>
    <button type="button" id="botonInteres" class="fw-bold">Calcular</button>
</fieldset>
<br>
<canvas id="interesCompuesto"></canvas>`;

    formularioInteres.append(formulario);//agrego el formulario de interes compuesto en la seccion (div) correspondiente

    //calcula el interes compuesto segun los datos ingresados

    let outputInteres = document.createElement("p"); //creo un parrafo que luego me servira para mostrar los resultador del calculo del interes compuesto

    let botonInteres = document.getElementById("botonInteres"); //obtengo el nodo correspondiente al boton de calcular de la parte del calculo de interes compuesto

    botonInteres.addEventListener("click", () => {//cuando hago click en el boton de calcular correspondiente a la seccion de interes compuesto se ejecuta lo siguiente
        let balanceFinal = 0;
        let inversionInicial = parseFloat(document.getElementById("inversionInicial").value);//obtengo el valor de la inversion inicial
        let tasaInteres = parseFloat(document.getElementById("tasaInteres").value);//obtengo el valor de la tasa de interes
        let frecuenciaTasaInteres = document.getElementById("selectInteresFrecuenciaTasa").value;//obtengo la frecuencia en las cual se aplicara la tasa de interes
        let cantidadAnos = parseFloat(document.getElementById("cantidadAnos").value);//obtengo del valor de la cantidad de años
        let aporte = parseFloat(document.getElementById("aporte").value);//obtengo el valor del aporte que se va a realizar
        let frecuenciaAporte = document.getElementById("selectInteresFrecuenciaAporte").value;//obtengo al frecuencia con la que se realizara el aporte

        frecuenciaTasaInteres = obtenerNumeroFrecuencia(frecuenciaTasaInteres);//transformo la frecuencia obtenida en cantidad de veces que dicha frecuencia ocurre en un año
        frecuenciaAporte = obtenerNumeroFrecuencia(frecuenciaAporte);//transformo la frecuencia obtenida en cantidad de veces que dicha frecuencia ocurre en un año

        tasaInteres = (tasaInteres / 100) + 1; //convierto la tasa de interes a un valor de unidad. por ej: una tasa del 10% sera de 1.1

        //calculo la cantidad de periodos teniendo en cuenta la frecuencia mas chica. por ej: si la frecuencia de aporte es 2 
        //(dos veces al año), y la de tasa de interes es 4 (cada trimestre) entonces la cantidad de periodos sera años*2. 
        //Esto se hace asi debido a que necesito trabajar con "periodos" mas que con años, al final de dichos periodos se 
        //calculara el interes y se sumara el aporte
        let cantidadPeriodos = cantidadAnos * Math.min(frecuenciaAporte, frecuenciaTasaInteres);

        //calculo las veces que entra la frecuencia mas grande dentro de la mas chica. por ej: si la frecuencia de aporte es 2 
        //(dos veces al año), y la de tasa de interes es 4 (cada trimestre), entonces sabemos que entran dos trimestres en cada semestre.
        //Cada semestre sera un periodo (en la cual luego calcularemos el interes y sumaremos los aportes) y en la linea anterior 
        //se calculo la cantidad de periodos totales
        let vecesQueEntra = Math.max(frecuenciaAporte, frecuenciaTasaInteres) / Math.min(frecuenciaAporte, frecuenciaTasaInteres);

        balanceFinal = inversionInicial; //seteo el primer valor del balance final que sera la inversion inicial

        let interesCompuesto = [];//array que contendra los datos del balance año a año que luego se cargara en el grafico de barras

        let contador = 0;

        for (let i = 0; i < cantidadPeriodos; i++) { //recorro todos los periodos
            if (frecuenciaTasaInteres < frecuenciaAporte) { //si la frecuencia de la tasa de interes es mas chica que la de aporte, quiere decir que el periodo me lo marca la tasa de interes
                for (let j = 0; j < vecesQueEntra; j++) { //recorro la cantidad de veces que entra la frecuencia mas chica (entre aporte y tasa de interes) dentro de cada periodo
                    balanceFinal += aporte; //al ser mas chica la frecuencia de tasa de interes (por ej: frecuenciaTasaInteres = 2 (dos veces al año), frecuenciaAporte = 4 (cada trimestre)) debo sumar primero los aportes que se realizan dentro del periodo
                }
                balanceFinal = balanceFinal * tasaInteres;//cuando el periodo esta por finalizar y ya se sumaron todos los aportes se calcula la tasa de interes sobre el valor obtenido
            }
            else if (frecuenciaAporte === frecuenciaTasaInteres) { //si ambas frecuencias son iguales simplemente sumo el aporte y calculo la tasa de interes en cada periodo
                balanceFinal += aporte;
                balanceFinal = balanceFinal * tasaInteres;
            }
            else { //si la frecuencia de aporte es mas chica que la de la tasa de interes, quiere decir que el periodo me lo marca el aporte
                balanceFinal += aporte; //al ser mas chica la frecuencia de tasa de interes (por ej: frecuenciaTasaInteres = 4 (cada trimestre), frecuenciaAporte = 2 (dos veces al año)) debo sumar el unico aporte que entra dentro del periodo
                for (let j = 0; j < vecesQueEntra; j++) { //recorro la cantidad de veces que entra la frecuencia mas chica (entre aporte y tasa de interes) dentro de cada periodo
                    balanceFinal = balanceFinal * tasaInteres;//calculo la tasa de interes sobre el balance. Esto se hace la cantidad de veces que la fecuencia de la tasa de interes se puede aplicar dentro del periodo
                }
            }
            balanceFinal = Math.round(balanceFinal); //redondeo el balance final
            //utilizo un contador para solo agregar el balance final al array al final de cada año
            contador < cantidadPeriodos / cantidadAnos ? contador++ : 0;

            if (contador == cantidadPeriodos / cantidadAnos) {//cuando termina el caño agrego el balance final al array y vuelvo el contador a cero
                interesCompuesto.push(balanceFinal);
                contador = 0;
            }
        }

        //grafico de barras que mostrara el balance final de cada año utilizando chart js
        const interes = document.getElementById('interesCompuesto');
        const graficoInteres = new Chart(interes, {
            type: 'bar',
            data: {
                labels: Array.from({ length: cantidadAnos }, (_, i) => i + 1),//array de cada año
                datasets: [{
                    label: 'Balance',
                    data: interesCompuesto,//array de balance final de cada año
                    backgroundColor: Array.from({ length: cantidadAnos }, (_, i) => 'rgb(255, 255, 66)'),
                    borderColor: Array.from({ length: cantidadAnos }, (_, i) => 'rgb(255, 255, 66)'),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            color: colorLetraGraficos,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: colorLetraGraficos,
                        },
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: colorLetraGraficos,
                            font: {
                                size: 20,
                            }
                        }
                    }
                }

            }
        });
        //------------------

        outputInteres.innerText = "El balance final sera: " + separadorMiles(balanceFinal); //muestro el balance final, redondeado y con separador de miles

        formularioInteres.append(outputInteres);//agrego el mensaje al final del div de la seccion de formulario de interes compuesto
        //cuando se detecta un mouseup en el boton calcular se destruye el grafico de barras para luego crear uno nuevo en el mismo lugar
        botonInteres.addEventListener("mouseup", () => {
            graficoInteres.destroy();
        })
    });
});