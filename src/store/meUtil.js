import Swal from 'sweetalert2'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

function swal(icon, title) {
    Swal.fire({icon, title, toast:true, position:'top-end', showConfirmButton:false, timer:2000, timerProgressBar:true})
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function ordenarArray(array, prop='nombre', orden='asc') {
    return array.sort((a, b) => {
        // if (orden === 'asc') {
        //     return a[prop] > b[prop] ? 1 : -1
        // }
        // else if (orden === 'desc') {
        //     return a[prop] < b[prop] ? 1 : -1
        // }

        let propA = a[prop].toString().toLowerCase()
        let propB = b[prop].toString().toLowerCase()

        // if (orden === 'asc') {
        //     return propA > propB ? 1 : (propA < propB ? -1 : 0)
        // }
        // else if (orden === 'desc') {
        //     return propA < propB ? 1 : (propA > propB ? -1 : 0)
        // }

        if (orden === 'asc') {
            return propA.localeCompare(propB)
        }
        else if (orden === 'desc') {
            return propB.localeCompare(propA)
        }

        return 0
    })
}

function incompleteData (a, p) {
    // p = solo propiedades a evaluar
    if (p === undefined) {
        for(let prop in a){
            if (a[prop] === "" || a[prop] === null || a[prop] === undefined) {
                console.log(prop)
                return true
            }
        }
    } else {
        for(let prop in a){
            if (p.includes(prop) && (a[prop] === "" || a[prop] === null || a[prop] === undefined)) {
                console.log(prop)
                return true
            }
        }
    }

    return false
}

function isEmail(texto) {
    if (texto == '') return true

    const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return patron.test(texto)
}

function isNumber(texto) {
    if (texto == '' || texto == null) return true

    const patron = /^[+-]?\d+(\.\d+)?$/;
    return patron.test(texto)
}

function formatoNum(num,dec,trunc) {
    dec == undefined ? dec = 2 : ''

    try {
        let asd = num.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec})

        if (dec!=undefined && trunc) {
            if (asd.slice(-2) == '00') asd = asd.slice(0,-3)
        }
    
        return asd
    }
    catch (error) {
        return num
    }
}

function capitalizarPalabras(texto) {
    if (texto == undefined) return ''
    
    const palabras = texto.toLowerCase().split(' ')

    const palabrasCapitalizadas = palabras.map(palabra => {
        return palabra.charAt(0).toUpperCase() + palabra.slice(1)
    })
  
    return palabrasCapitalizadas.join(' ');
}

function mayusc(texto){
    if (!texto) return ''
    texto = texto.toString()
    return texto.toUpperCase()
}

const generarId = (array, prop) => {
    if (prop == undefined) prop = 'id'
    let id

    if (array.length == 0) {
        id = 1
    }
    else {
        const masAlto = array.reduce((max, objeto) => {
            if (objeto[prop] > max) return objeto[prop]
            return max
        }, 0)
        id = masAlto + 1
    }
    
    return id
}

const scrollToBottom = (element) => {
    setTimeout(() => {
        try {element.scrollTop = element.scrollHeight} catch (error) {error}
    }, 0)
}

function isLinkValid(uri) {
    return /^(ftp|http|https):\/\/[^ "]+$/.test(uri)
}

function openLink(link){
    window.open(link, '_blank')
}

function loadToB64(event) {
    const file = event.target.files[0]
    const reader = new FileReader()

    if (!file) return Promise.resolve('')

    return new Promise((resolve, reject) => {
        reader.onload = async () => {
            try {
                const response = reader.result
                resolve(response)
            } catch (error) {
                reject(error)
            }
        }
        reader.readAsDataURL(file)
    })
}

async function generateExcel (headers,rows,nombre) {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Hoja1')
    const columns = headers.map(name => ({name}))

    worksheet.addTable({
        name: 'Tabla1',
        ref: 'A1',
        headerRow: true,
        style: {
            theme: 'TableStyleLight8',
            showRowStripes: true,
        },
        columns: columns,
        rows: rows
    })

    worksheet.columns.forEach((column) => {
        let maxLength = 0
        column.eachCell({ includeEmpty: true }, (cell) => {
            const columnWidth = cell.value ? cell.value.toString().length : 0
            maxLength = Math.max(maxLength, columnWidth)
        })
        column.width = maxLength + 2
    })

    const excelBuffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(blob, nombre)
}

async function myip() {
    // const uri = 'http://ip-api.com/json/?fields=66846719'
    const uri = 'https://api4.my-ip.io/v2/ip.json'

    try {
        const response = await fetch(uri)
        const data = await response.json()
        return data
    }
    catch (error) {
        console.error('Error al obtener la IP pública:', error)
        return false
    }


    // await fetch(uri)
    // .then(response => response.json())
    // .then(data => {
    //     // console.log('IP pública del usuario:', data)
    //     console.log(1)
    //     console.log(data)
    //     return data
    // })
    // .catch(error => {
    //     console.error('Error al obtener la IP pública:', error)
    //     return false
    // })
}

function detectDevice(userAgent) {
    const ua = userAgent || navigator.userAgent
    
    // Detección de móviles
    if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        // Detección de tabletas
        if (/Tablet|iPad/i.test(ua)) {
            return 'tablet'
        }
        else {
            return 'mobile'
        }
    }

    // Detección de escritorio
    return 'desktop'
}

export {
    swal, deepCopy, ordenarArray, incompleteData, isEmail, isNumber, formatoNum, capitalizarPalabras, generarId, scrollToBottom,
    isLinkValid, openLink, loadToB64, mayusc, generateExcel,
    myip, detectDevice
}