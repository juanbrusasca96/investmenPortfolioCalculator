//cuenta la cantidad de numeros pares entre un numero n (incluido) y un numero m (excluido)

let n = prompt("ingrese un numero");
let m = 0;
let cantPares = 0;
do {
    m = prompt("ingrese un numero, debe ser mayor que el anterior");
} while (n >= m);

for (let i = n; i < m; i++) {
    if (i % 2 == 0) {
        cantPares++;
    }
}

alert("la cantidad de numeros pares entre " + n + " y " + m + " es " + cantPares);