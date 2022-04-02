//calcula el interest compuesto segun los datos ingresados

let a = 0;
let p = prompt("ingrese la inversion inicial (solo valido enteros sin separador de miles)");
let r = prompt("ingrese la tasa de interes (en %)");
alert("ingrese la frecuencia con la cual se aplicara este interes. ");
let n = pedirValor();
let t = prompt("ingrese la cantidad de años");
let q = prompt("ingrese el aporte que va a realizar (solo valido enteros sin separador de miles)");
alert("ingrese la frecuencia con la cual se realizaran estos aportes. ");
let s = pedirValor();

function pedirValor() {
    let num = 0;
    do {
        num = prompt("Puede ser: 1 - anual, 2 - dos veces al año, 3 - cada trimestre, 4 - cada mes. " +
            "Cualquier otro numero ingresado sera ignorado y se le pedira que ingrese un numero nuevamente.");
        switch (num) {
            case 1:
                num = 1;
            case 2:
                num = 2;
            case 3:
                num = 4;
            case 4:
                num = 12;
            default:
                num = num;
        }
    } while (num < 1 || num > 4);
    return num;
}

r = r / 100;

a = p * Math.pow(1 + r / n, n * t) + q * s * (Math.pow(1 + r / n, n * t) - 1) / (r / n);
a = Math.round(a);

const separadorMiles = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1.';
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp,rep);
    return arr[1] ? arr.join('.'): arr[0];
  }

alert("el balance final sera: " + separadorMiles(a));