import { urls, get, post, patch, delet } from '@/store/meCrud'
import { deepCopy } from '@/store/meUtil'
import moment from 'moment'

import { defineStore } from 'pinia'

export const useData = defineStore('data', {
    state: () => ({
        usuario: null,
        usuarios: [],
        
        tipos: [
            {id:1, nombre:'Ingreso'},
            {id:2, nombre:'Egreso'},
            {id:3, nombre:'Transferencia'},
        ],

        cuenta: {},
        cuentas: [],
        cuentasLd: true,

        resumenCuentas: [],
        resumenCuentasLd: true,

        categoria: {},
        categorias: [],
        categoriasLd: true,

        resumenCategorias: [],
        resumenCategoriasLd: true,

        movimiento: null,
        movimientos: [],
        movimientosLd: true,
        
        prestamo: {},
        prestamos: [],
        prestamosLd: true,
        
        reporte: [],
        reporteLd: false,
        reporteFiltros: {},
    }),
    actions: {
        initAll(){
            // this.usuario = null
            // this.usuarios = []
            this.cuenta = null
            this.cuentas = []
            this.cuentasLd = true
            this.resumenCuentas = []
            this.resumenCuentasLd = true
            this.categoria = null
            this.categorias = []
            this.categoriasLd = true
            this.resumenCategorias = []
            this.resumenCategoriasLd = true
            this.movimiento = null
            this.movimientos = []
            this.movimientosLd = true
            this.prestamo = null
            this.prestamos = []
            this.prestamosLd = true
            this.reporte = []
            this.reporteLd = false
            this.reporteFiltros = {}
        },
        initUsuario(){
            this.usuario = {nombres:'', apellidos:'', correo:'', celular:'', usuario:'', contrasena:'', contrasena1:'', confirmacion:'', activo:true}
        },
        initMovimiento(){
            this.movimiento = {fecha:moment(new Date()).format('YYYY-MM-DD'), tipo:2, cuenta:null, categoria:null, prestamo:null, detalle:'', monto:0,
                cuentab:null,
            }
        },
        initCuenta(){
            this.cuenta = {nombre:'', moneda:'', icon:'', info:''}
        },
        initCategoria(){
            this.categoria = {nombre:'', tipo:'', icon:'', color:''}
        },
        initPrestamo(){
            this.prestamo = {tipo:2, persona:'', motivo:''}
        },
        


        async loadData(uri, array, ld, query){
            const link = urls[uri] + (query ? query : '')
            
            const result = await get(link)

            if (ld) this[ld] = false

            if (result.code != 0) return false

            if (array) this[array] = deepCopy(result.data)

            return result.data
        },
        async createData(uri, obj, array){
            const result = await post(urls[uri], this[obj])
            
            if (result.code != 0) return false
            
            this[obj] = deepCopy(result.data)
            
            if (array) this[array].push(result.data)

            return true
        },
        async updateData(uri, obj, array){
            const result = await patch(urls[uri], this[obj])

            if (result.code != 0) return false

            this[obj] = deepCopy(result.data)

            if (array) {
                const i = this[array].findIndex(a => a.id == this[obj].id)
                this[array].splice(i, 1, result.data)
            }

            return true
        },
        async deleteData(uri, obj, array){
            const result = await delet(urls[uri], this[obj])

            if (result.code != 0) return false

            if (array) {
                const i = this[array].findIndex(a => a.id == this[obj].id)
                this[array].splice(i, 1)
            }

            return true
        },
    },
    persist: {
        storage: localStorage,
        paths: ['reporteFiltros']
    }
})