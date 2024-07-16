import { useAuth } from "@/store/auth"
import movimientos from './movimientos'
import { swal } from '@/store/meUtil'

const table = 'categorias'

function get() {
    return new Promise((resolve, reject) => {
        const db = useAuth().db
        const resultados = []

        const transaction = db.transaction([table], 'readonly')
        const objectStore = transaction.objectStore(table)
        const request = objectStore.openCursor()
        
        request.onsuccess = async (event) => {
            const cursor = event.target.result

            if (cursor) {
                resultados.push(cursor.value)
                cursor.continue()
            }
            else {
                resolve({code:0, data:resultados})
            }
        }

        request.onerror = (event) => {
            reject({code:-1, msg:'Error al obtener todos los datos: ' + event.target.errorCode})
        }
    })
}

function getById(id) {
    return new Promise((resolve, reject) => {
        const db = useAuth().db

        const transaction = db.transaction([table], 'readonly')
        const objectStore = transaction.objectStore(table)
        const request = objectStore.get(id)

        request.onsuccess = async function(event) {
            resolve(event.target.result)
        }

        request.onerror = function(event) {
            reject('Error al obtener el dato: ' + event.target.errorCode);
        }
    })
}

function filter(query) {
    return new Promise((resolve, reject) => {
        const db = useAuth().db
        const resultados = []
        
        const transaction = db.transaction([table], 'readonly')
        const objectStore = transaction.objectStore(table)
        const request = objectStore.openCursor()
        
        request.onsuccess = async (event) => {
            const cursor = event.target.result

            if (cursor) {
                resultados.push(cursor.value)
                cursor.continue()
            }
            else {
                const movements = await movimientos.filter(query)
                
                for (const a of resultados) {
                    a.movements = movements.data.filter(b => b.categoria == a.id)
                }

                resolve({code:0, data:resultados})
            }
        }

        request.onerror = (event) => {
            reject({code:-1, msg:'Error al obtener todos los datos: ' + event.target.errorCode})
        }
    })
}

function post(data) {
    return new Promise((resolve, reject) => {
        const db = useAuth().db
        const item = JSON.parse(JSON.stringify(data))

        const transaction = db.transaction([table], 'readwrite')
        const objectStore = transaction.objectStore(table)
        const request = objectStore.add(item)

        request.onsuccess = async (event) => {
            const id = event.target.result

            try {
                const newData = await getById(id)
                resolve({code:0, data:newData})
            }
            catch (error) {
                reject({ code:-1, msg:'Error al obtener el dato guardado: ' + error })
            }
        }

        request.onerror = (event) => {
            reject({ code:-1, msg:'Error al agregar datos: '+event.target.errorCode})
        }
    })
}

function patch(data) {
    return new Promise((resolve, reject) => {
        const db = useAuth().db
        const item = JSON.parse(JSON.stringify(data))

        const transaction = db.transaction([table], 'readwrite')
        const objectStore = transaction.objectStore(table)
        const request = objectStore.put(item)

        request.onsuccess = async (event) => {
            const id = event.target.result

            try {
                const newData = await getById(id)
                resolve({code:0, data:newData})
            }
            catch (error) {
                reject({ code:-1, msg:'Error al obtener el dato guardado: ' + error })
            }
        }

        request.onerror = function(event) {
            reject({ code:-1, msg:'Error al actualizar datos: '+event.target.errorCode})
        }
    })
}

async function delet(data) {
    const trymovimientos = await movimientos.find()

    if (trymovimientos.data.some(a => a.categoria == data.id)) {
        swal('error', 'La categoria tiene registros')
        return {code:1, msg:'La categoria tiene registros'}
    }

    return new Promise((resolve, reject) => {
        const db = useAuth().db

        const transaction = db.transaction([table], 'readwrite')
        const objectStore = transaction.objectStore(table)
        const request = objectStore.delete(data.id)

        request.onsuccess = async () => {
            resolve({code:0})
        }

        request.onerror = function(event) {
            reject({ code:-1, msg:'Error al actualizar datos: '+event.target.errorCode})
        }
    })
}

const categorias = {
    get,
    getById,
    filter,
    post,
    patch,
    delet
}

export default categorias