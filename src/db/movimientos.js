import { useAuth } from '@/store/auth'
import cuentas from './cuentas'
import categorias from './categorias'
import prestamos from './prestamos'

const table = 'movimientos'

function find() {
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
                for (const a of resultados) {
                    a.cuenta1 = a.cuenta == null ? null : await cuentas.getById(a.cuenta)
                    a.cuentab1 = a.cuentab == null ? null : await cuentas.getById(a.cuentab)
                    a.categoria1 = a.categoria == null ? null : await categorias.getById(a.categoria)
                    // a.prestamo1 = a.prestamo == null ? null : await prestamos.getById(a.prestamo)
                }

                resolve({code:0, data:resultados})
            }
        }

        request.onerror = (event) => {
            reject({code:-1, msg:'Error al obtener todos los datos: ' + event.target.errorCode})
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
                let newResultados = []
                
                const i = query.indexOf('filtros')

                if (i !== -1) {
                    const filtros = JSON.parse(query.substring(i).replace('filtros=',''))

                    newResultados = resultados.filter(item => {
                        let match = true

                        if (filtros.f1 && filtros.f2) {
                            // const fecha = new Date(item.fecha);
                            // const f1 = new Date(filtros.f1);
                            // const f2 = new Date(filtros.f2);
                            const fecha = item.fecha
                            const f1 = filtros.f1
                            const f2 = filtros.f2
                            if (!(fecha >= f1 && fecha <= f2)) match = false
                        }

                        if (filtros.tipo.length > 0) {
                            if (!filtros.tipo.includes(item.tipo)) match = false
                        }

                        if (filtros.cuenta.length > 0) {
                            if (!filtros.cuenta.includes(item.cuenta)) match = false
                        }
        
                        if (filtros.categoria.length > 0) {
                            if (!filtros.categoria.includes(item.categoria)) match = false
                        }
        
                        if (filtros.detalle.trim() !== '') {
                            if (!item.detalle.includes(filtros.detalle)) match = false
                        }
        
                        if (filtros.monto !== null) {
                            if (item.monto !== filtros.monto) match = false
                        }
        
                        return match
                    })
                    // console.log(filtros)
                }
                else {
                    const f1 = query.slice(4,14)
                    const f2 = query.slice(18,28)
    
                    newResultados = resultados.filter(a => {
                        const fecha = a.fecha
                        return fecha >= f1 && fecha <= f2
                    })
                }

                for (const a of newResultados) {
                    a.cuenta1 = a.cuenta == null ? null : await cuentas.getById(a.cuenta)
                    a.cuentab1 = a.cuentab == null ? null : await cuentas.getById(a.cuentab)
                    a.categoria1 = a.categoria == null ? null : await categorias.getById(a.categoria)
                    
                    a.prestamo1 = a.prestamo == null ? null : await prestamos.getById(a.prestamo)
                }

                resolve({code:0, data:newResultados})
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
            
            data.cuenta1 = data.cuenta==null ? null : await cuentas.getById(data.cuenta)
            data.cuentab1 = data.cuentab==null ? null : await cuentas.getById(data.cuentab)
            data.categoria1 = data.categoria==null ? null : await categorias.getById(data.categoria)
            data.prestamo1 = data.prestamo == null ? null : await prestamos.getById(data.prestamo)

            resolve(data)
        }

        request.onerror = (event) => {
            reject('Error al obtener el dato: ' + event.target.errorCode);
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
                const newData = await movimientos.getById(id)
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
                const newData = await movimientos.getById(id)
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

const movimientos = {
    find,
    getById,
    filter,
    post,
    patch,
    delet
}

export default movimientos