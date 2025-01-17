import { indicadores } from './data/indicadores.js'

const inputMontoClp = document.querySelector('#monto-clp-input')
const optionSelectIndicador = document.querySelector('#indicadores-select')
const btnBuscar = document.querySelector('#btn-buscar')
const spanResultado = document.querySelector('.resultado')
const canvasChatValoresIndicador = document.querySelector('#indicador-chart')

var chartHistorialIndicadores = null

inputMontoClp.addEventListener('keydown', (event) => {
    let ASCIICode = (event.which) ? event.which : event.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
        event.preventDefault()
    }
})

btnBuscar.addEventListener('click', () => {
    let montoClp = inputMontoClp.value
    let codigoIndicador = optionSelectIndicador.value

    if(montoClp == '') {
        alert('Debes ingresar un monto a convertir')
        return false
    } else if (codigoIndicador == 0) {
        alert('Debes seleccionar un indicador económico')
        return false
    }

    buscarValoresIndicador(montoClp, codigoIndicador)
})

const cargarIndicadores = (data) => {
    data.forEach(element => {
        let option = document.createElement('option')
        option.value = element.codigo
        option.text = element.nombre

        optionSelectIndicador.add(option)
    })
}

const buscarValoresIndicador = async (montoClp, tipoIndicador) => {
    let apiURL = `https://mindicador.cl/api/${tipoIndicador}`
    try {
        let res = await fetch(apiURL)
        let data =await res.json()

        let valorClpIndicador = data.serie[0].valor
        let monedaIndicador = indicadores.find(e => e.codigo == tipoIndicador).moneda
        spanResultado.innerHTML = `Resultado: ${convertirClp(montoClp, valorClpIndicador)} ${monedaIndicador}`

        renderGraficoUltimosValoresIndicador(data.serie)
    } catch (e) {
        alert(e.message)
    }
}

const convertirClp = (montoClp, valorClpIndicador) => {
    return (montoClp/valorClpIndicador).toFixed(2)
}

const renderGraficoUltimosValoresIndicador = (dataIndicador) => {
    let selectedIndicadorText = optionSelectIndicador.options[optionSelectIndicador.selectedIndex].text

    const labels = dataIndicador.map((element) => {
        return new Date(element.fecha).toLocaleDateString('es-CL')
    }).slice(0, 10).reverse()
    const valores = dataIndicador.map((element) => {
        return element.valor
    }).slice(0, 10).reverse()

    const data = {
        labels: labels,
        datasets: [{
            label: `Valor ${selectedIndicadorText}`,
            data: valores,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }

    const config = {
        type: 'line',
        data: data,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: `Historial Últimos 10 días ${selectedIndicadorText}`
                }
            }
        }
    }

    if (chartHistorialIndicadores) {
        chartHistorialIndicadores.destroy()
    }

    chartHistorialIndicadores = new Chart(canvasChatValoresIndicador, config)
}

cargarIndicadores(indicadores)