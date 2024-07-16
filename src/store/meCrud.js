import { swal } from "@/store/meUtil"
import { useAuth } from "@/store/auth"
import routes from '@/db/routes'
// import { myip } from "@/store/meUtil"

const host = process.env.VUE_APP_HOSTBACKEND
const urls = {
    signin: `${host}/signin`,
    signup: `${host}/signup`,
    usuarios: `${host}/api/usuarios`,
    cuentas: `${host}/api/cuentas`,
    categorias: `${host}/api/categorias`,
    movimientos: `${host}/api/movimientos`,
    prestamos: `${host}/api/prestamos`,
}

function obtenerUri(url) {
    const regex = /\/api\/([^/?]+)/
    const match = url.match(regex)
    if (match && match[1]) {
        return match[1]
    }
    return null
}

function obtenerQuery(url) {
    const index = url.indexOf('?')
    if (index !== -1) {
        return url.substring(index)
    }
    return null
}

// async function setPlace() {
//     const ip = await myip()

//     if (ip == false) {
//         swal('error', 'Api de ip no funciona')
//         return false
//     }
//     else {
//         // return `${ip.continent} --- ${ip.country} --- ${ip.regionName} --- ${ip.city}`
//         return `${ip.country.name} --- ${ip.region} --- ${ip.city}`
//     }
// }

async function get(url){
    let response, data
    
    if (useAuth().local == true && useAuth().signUp == false) {
        const uri = obtenerUri(url)
        const query = obtenerQuery(url)

        if (query) {
            data = await routes[uri].filter(query)
        }
        else {
            data = await routes[uri].get()
        }
    }
    else {
        try {
            // const place = await setPlace()
            // if (place == false) return {code:-3}

            response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${useAuth().token}`,
                    // 'Place': place
                }
            })
        }
        catch (error) {
            console.log(error)
            swal('error', error)
            return {code:-2}
        }

        data = await response.json()
    }

    if (data.code == -1) {
        console.log(data)
        swal('error', 'Algo salió mal')
    }

    if (data.code > 0) swal('error', data.msg)

    return data
}

async function post(url, item, ms){
    let response, data

    if (useAuth().local == true && useAuth().signUp == false) {
        const uri = obtenerUri(url)
        data = await routes[uri].post(item)
    }
    else {
        try {
            // const place = await setPlace()
            // if (place == false) return {code:-3}

            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${useAuth().token}`,
                    // 'Place': place
                },
                body: JSON.stringify(item)
            })
        }
        catch (error) {
            console.log(error)
            swal('error', error)
            return {code:-2}
        }
        
        data = await response.json()
    }

    if (data.code == -1) {
        console.log(data)
        swal('error', 'Algo salió mal')
    }

    if (data.code > 0) swal('error', data.msg)

    if (data.code == 0) {
        if (ms != false) {
            swal('success', ms == undefined ? 'Creado con éxito' : ms)
        }
    }

    return data
}

async function patch(url, item, ms){
    let response, data
    
    if (useAuth().local == true) {
        const uri = obtenerUri(url)
        data = await routes[uri].patch(item)
    }
    else {
        try{
            // const place = await setPlace()
            // if (place == false) return {code:-3}

            response = await fetch(`${url}/${item.id}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${useAuth().token}`,
                    // 'Place': place
                },
                body: JSON.stringify(item)
            })
        }
        catch (error) {
            console.log(error)
            swal('error', error)
            return {code:-2}
        }
    
        data = await response.json()
    }

    if (data.code == -1) {
        console.log(data.msg)
        swal('error', 'Algo salió mal')
    }

    if (data.code > 0) swal('error', data.msg)

    if (data.code == 0) {
        if (ms != false) {
            swal('success', ms == undefined ? 'Actualizado con éxito' : ms)
        }
    }

    return data
}

async function delet(url, item, ms){
    let response, data
    
    if (useAuth().local == true) {
        const uri = obtenerUri(url)
        data = await routes[uri].delet(item)
    }
    else {
        try {
            // const place = await setPlace()
            // if (place == false) return {code:-3}

            response = await fetch(`${url}/${item.id}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${useAuth().token}`,
                    // 'Place': place
                },
                body: JSON.stringify(item)
            })
        }
        catch (error) {
            console.log(error)
            swal('error', error)
            return {code:-2}
        }
    
        data = await response.json()
    }

    if (data.code == -1) {
        console.log(data.msg)
        swal('error', 'Algo salió mal')
    }

    if (data.code > 0) swal('error', data.msg)

    if (data.code == 0) {
        if (ms != false) {
            swal('success', ms == undefined ? 'Eliminado con éxito' : ms)
        }
    }

    return data
}

export {urls, get, post, patch, delet}