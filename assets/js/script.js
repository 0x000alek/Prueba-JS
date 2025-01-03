import { indicadores } from './data/indicadores.js'

const cargarIndicadores = (data) => {
    data.forEach(element => {
        let option = document.createElement('option')
        option.value = element.codigo
        option.text = element.nombre

        document.querySelector('#indicadores-select').add(option)
    })
}

cargarIndicadores(indicadores)