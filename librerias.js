const colorLetraGrafico = 'rgb(246, 246, 234)';//constante que guarda del color de letra de los graficos

//grafico de la cartera de david swensen
const cartera = document.getElementById('carteraDavidSwensen');
const graficoCartera = new Chart(cartera, {
    type: 'doughnut',
    data: {
        labels: [//activos dentro de la cartera
            'Acciones estadounidenses',
            'Bienes raices',
            'Acciones de mercados desarrollados',
            'Acciones de mercados emergentes',
            'Bonos protegidos contra la inflacion',
            'Bonos del tesoro de estados unidos a largo plazo'
        ],
        datasets: [{
            data: [30, 20, 15, 5, 15, 15],//porcentajes de la cartera
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
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: colorLetraGrafico,
                    font: {
                        size: 20
                    }
                }
            }
        }
    }
});

//grafico del rendimiento de la cartera de david swensen comparado con el sp500
const rendimiento = document.getElementById('rendimientoCarteraDavidSwensen');
let labels = ["Dec 31, 2000"]
for (let i = 2001; i < 2022; i++) {//años donde vizualizamos el rendimiento
    labels.push(i.toString());
}
const graficoRendimiento = new Chart(rendimiento, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'David Swensen Yale Endowment',
                data: [10000, 9753, 9436, 11966, 13948, 15230, 17881, 18792, 14207, 17385, 20037, 21147, 24030, 26487, 30008, 29776, 31928, 36561, 34290, 42037, 47071, 55351],//rendimiento de la cartera de david swensen
                fill: false,
                borderColor: 'rgb(51, 51, 255)',
                backgroundColor: 'rgb(51, 51, 255)',
                tension: 0.1
            },
            {
                label: 'S&P 500 Index',
                data: [10000, 8798, 6849, 8802, 9747, 10212, 11810, 12446, 7838, 9914, 11393, 11617, 13455, 17785, 20187, 20439, 22854, 27806, 26548, 34865, 41227, 52990],//rendimiento del sp500
                fill: false,
                borderColor: 'rgb(255, 51, 51)',
                backgroundColor: 'rgb(255, 51, 51)',
                tension: 0.1
            }
        ]
    },
    options: {
        scales: {
            x: {
                ticks: {
                    color: colorLetraGrafico,
                }
            },
            y: {
                ticks: {

                    color: colorLetraGrafico,
                }
            },

        },

        plugins: {
            legend: {
                labels: {
                    color: colorLetraGrafico,
                    font: {
                        size: 15,
                    }
                }
            }
        }
    }
});