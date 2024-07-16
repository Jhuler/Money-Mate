import { useAuth } from "@/store/auth"

function conn() {
    return new Promise((resolve, reject) => {
        const conexion = indexedDB.open('jd', 1)
    
        conexion.onsuccess = (event) => {
            useAuth().db = event.target.result
            resolve({code:0, msg:'Base de datos abierta con éxito:'+useAuth().db.name})
        }

        conexion.onerror = (event) => {
            reject({code:-1, msg:'Error al abrir la base de datos: '+event.target.errorCode})
        }

        conexion.onupgradeneeded = (event) => {
            const db = event.target.result

            db.createObjectStore('cuentas', {keyPath:'id', autoIncrement:true})
            db.createObjectStore('categorias', {keyPath:'id', autoIncrement:true})
            db.createObjectStore('movimientos', {keyPath:'id', autoIncrement:true})
            db.createObjectStore('prestamos', {keyPath:'id', autoIncrement:true})
        }
    })
}

function createMany(db, table, data) {
    console.log(db)

    const transaction = db.transaction([table], 'readwrite')
    const objectStore = transaction.objectStore(table)

    for (const a of data) {
        objectStore.add(a)
        
        // request.onsuccess = function(event) {
        //     console.log('Datos agregados con éxito:', event.target.result);
        // };

        // request.onerror = function(event) {
        //     console.error('Error al agregar datos:', event.target.errorCode);
        // };
    }
}

// async function find(db, table) {
//     const transaction = db.transaction([table], 'readonly')
//     const objectStore = transaction.objectStore(table)
//     const request = objectStore.openCursor()
//     const resultados = []

//     return new Promise((resolve, reject) => {
//         request.onsuccess = (event) => {
//             const cursor = event.target.result;
//             if (cursor) {
//                 resultados.push(cursor.value);
//                 cursor.continue()
//             }
//             else {
//                 resolve({code:0, data:resultados})
//             }
//         }

//         request.onerror = (event) => {
//             reject({code:-1, msg:'Error al obtener todos los datos: ' + event.target.errorCode})
//         }
//     })
// }

// async function getById(db, table, id) {
//     return new Promise((resolve, reject) => {
//         const transaction = db.transaction([table], 'readonly')
//         const objectStore = transaction.objectStore(table)
//         const request = objectStore.get(id)

//         request.onsuccess = function(event) {
//             resolve(event.target.result)
//         }

//         request.onerror = function(event) {
//             reject('Error al obtener el dato: ' + event.target.errorCode);
//         }
//     })
// }

// async function create(db, table, data) {
//     return new Promise((resolve, reject) => {
//         try {
//             const item = JSON.parse(JSON.stringify(data))

//             const transaction = db.transaction([table], 'readwrite')
//             const objectStore = transaction.objectStore(table)
//             const request = objectStore.add(item)

//             request.onsuccess = async function(event) {
//                 const id = event.target.result
//                 try {
//                     const newData = await getById(db, table, id)
//                     resolve({code:0, data:newData})
//                 }
//                 catch (error) {
//                     reject({ code:-1, msg:'Error al obtener el dato guardado: ' + error })
//                 }
//             }

//             request.onerror = function(event) {
//                 reject({ code:-1, msg:'Error al agregar datos: '+event.target.errorCode})
//             }
//         }
//         catch (error) {
//             reject({code:-1, msg:'Error al agregar datos: '+error.message})
//         }
//     })
// }

// function update() {

// }

// function delet () {

// }

const meIdxDb = {
    conn,
    createMany,
    // find, create, update, delet
}

export default meIdxDb