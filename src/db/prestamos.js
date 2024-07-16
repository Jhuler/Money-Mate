import { useAuth } from "@/store/auth"
import movimientos from './movimientos'

const table = 'prestamos'

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
                const movements = await movimientos.find()
                
                for (const a of resultados) {
                    a.movements = movements.data.filter(b => b.prestamo == a.id)
                }

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
        
        request.onsuccess = async (event) => {
            const data = event.target.result
            
            const movements = await movimientos.find()
            data.movements = movements.data.filter(a => a.prestamo == data.id)

            resolve(data)
        }

        request.onerror = (event) => {
            reject('Error al obtener el dato: ' + event.target.errorCode)
        }
    })
}

function post(data) {
    return new Promise((resolve, reject) => {
        const db = useAuth().db
        const item = JSON.parse(JSON.stringify(data))
        const movimiento = JSON.parse(JSON.stringify(item.movimiento))
        delete item.movimiento

        const transaction = db.transaction([table], 'readwrite')
        const objectStore = transaction.objectStore(table)
        const request = objectStore.add(item)

        request.onsuccess = async (event) => {
            const id = event.target.result
            movimiento.prestamo = id

            const result = await movimientos.post(movimiento)

            if (result.code != 0) {
                reject({ code:-1, msg:'Error al guardar 1er movimiento'})
            }
            else{
                try {
                    const newData = await getById(id)
                    resolve({code:0, data:newData})
                }
                catch (error) {
                    reject({ code:-1, msg:'Error al obtener el dato guardado: ' + error })
                }
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

function delet(data) {
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

const prestamos = {
    getById,
    get,
    post,
    patch,
    delet
}

export default prestamos