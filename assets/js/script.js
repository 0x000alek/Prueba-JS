import { indicadores } from './data/indicadores.js'

const inputMontoClp = document.querySelector('#monto-clp-input')
const optionSelectIndicador = document.querySelector('#indicadores-select')
const btnBuscar = document.querySelector('#btn-buscar')
const spanResultado = document.querySelector('.resultado')

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
        spanResultado.innerHTML = `Resultado: ${convertirClp(montoClp, valorClpIndicador)}`
    } catch (e) {
        alert(e.message)
    }
}

const convertirClp = (montoClp, valorClpIndicador) => {
    return (montoClp/valorClpIndicador).toFixed(2)
}

cargarIndicadores(indicadores)