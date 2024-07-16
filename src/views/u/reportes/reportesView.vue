<template>
    <section>
        <div class="section-head">
            <div class="top">
                <h2>Reportes</h2>
            </div>

            <div class="filtros">
                <div class="fechas">
                    <formInput label="Fecha inicio" tipo="date" v-model="filtros.f1"/>
                    <formInput label="Fecha inicio" tipo="date" v-model="filtros.f2"/>
                    <formInput label="Nota" tipo="search" v-model="filtros.detalle"/>
                    <formInput label="Monto" tipo="number" v-model="filtros.monto"/>
                </div>

                <div class="filtro">
                    <p>Tipo:</p>
                    <ul>
                        <li v-if="filtros.tipo.length == 0">Todo</li>
                        <li v-for="a in filtros.tipo" :key="a.id">{{ a.nombre }}</li>
                        <button class="btn1" @click="openMultiSelect('tipo', useData.tipos)">+</button>
                    </ul>
                </div>

                <div class="filtro">
                    <p>Cuenta:</p>

                    <button @click="reloadCuentas()" v-if="!useData.cuentasLd"><i class="fa-solid fa-rotate-right"></i></button>
                    <loadingSpin position="initial" width="fit-content" scale="0.5" v-if="useData.cuentasLd"/>

                    <ul v-if="useData.cuentas.length > 0">
                        <li v-if="filtros.cuenta.length == 0">Todo</li>
                        <li v-for="a in filtros.cuenta" :key="a.id">{{ a.nombre }}</li>
                        <button class="btn1" @click="openMultiSelect('cuenta', useData.cuentas)">+</button>
                    </ul>
                </div>

                <div class="filtro">
                    <p>Categoría:</p>

                    <button @click="reloadCategorias()" v-if="!useData.categoriasLd"><i class="fa-solid fa-rotate-right"></i></button>
                    <loadingSpin position="initial" width="fit-content" scale="0.5" v-if="useData.categoriasLd"/>

                    <ul v-if="useData.categorias.length > 0">
                        <li v-if="filtros.categoria.length == 0">Todo</li>
                        <li v-for="a in filtros.categoria" :key="a.id">{{ a.nombre }}</li>
                        <button class="btn1" @click="openMultiSelect('categoria', useData.categorias)">+</button>
                    </ul>
                </div>

                <div class="botones">
                    <jdButton text="Excel" @click="exportar()" v-if="this.useData.reporte.length > 0">
                        <i class="fa-solid fa-file-arrow-down"></i>
                    </jdButton>

                    <jdButton text="Limpiar" @click="limpiar()"/>

                    <jdButton text="Buscar" @click="buscar()" :spin="useData.reporteLd" color="1"/>
                </div>
            </div>
        </div>

        <div class="section-body">
            <movimientosAgrupadoDia :datos="lista" @editar="editar" v-if="lista.length > 0"/>
        </div>
    </section>

    <multiSelect :data="dataMultiSelect" v-if="useModals.multiSelect.show" @agregar="agregarItems"/>
    <movimientosAgregar v-if="useModals.movimiento.show" @ordenar="actualizarMovimientos"/>
</template>

<script>
import formInput from '@/components/formInput.vue'
import multiSelect from '@/components/multiSelect.vue'
import jdButton from '@/components/jdButton.vue'
import movimientosAgrupadoDia from '../movimientos/movimientosAgrupadoDia.vue'
import loadingSpin from '@/components/loadingSpin.vue'
import movimientosAgregar from '../movimientos/movimientosAgregar.vue'

import { useAuth } from '@/store/auth.js'
import { useData } from '@/store/data.js'
import { useModals } from '@/store/modals.js'

import { deepCopy, swal, generateExcel } from '@/store/meUtil'

import moment from 'moment'
import 'moment/locale/es'

export default {
    components: {
        formInput,
        multiSelect,
        jdButton,
        movimientosAgrupadoDia,
        loadingSpin,
        movimientosAgregar,
    },
    data: () => ({
        dataMultiSelect:[],
        propMultiSelect:'',

        filtros: {},

        lista:[],

        useAuth:useAuth(),
        useData:useData(),
        useModals:useModals(),
    }),
    async created(){
        this.initFiltros()
        this.setFiltros()

        await this.loadCuentas()
        this.setFiltroCuenta()

        await this.loadCategorias()
        this.setFiltroCategoria()

        this.agruparPorDia()
    },
    methods: {
        async loadCuentas(){
            if (!this.useData.cuentasLd) return
            
            await this.useData.loadData('cuentas', 'cuentas', 'cuentasLd')
        },
        async reloadCuentas(){
            this.useData.cuentas.length = 0
            this.useData.cuentasLd = true
            await this.loadCuentas()
            this.setFiltroCuenta()
        },
        async loadCategorias(){
            if (!this.useData.categoriasLd) return

            await this.useData.loadData('categorias', 'categorias', 'categoriasLd')
        },
        async reloadCategorias(){
            this.useData.categorias.length = 0
            this.useData.categoriasLd = true
            await this.loadCategorias()
            this.setFiltroCategoria()
        },
        initFiltros(){
            this.filtros = {
                f1:null,
                f2:null,
                tipo: [],
                cuenta: [],
                categoria: [],
                detalle: '',
                monto: null,
            }
        },
        setFiltros(){
            this.filtros.f1 = this.useData.reporteFiltros.f1 || null
            this.filtros.f2 = this.useData.reporteFiltros.f2 || null
            this.filtros.detalle = this.useData.reporteFiltros.detalle || ''
            this.filtros.monto = this.useData.reporteFiltros.monto || null

            if (this.useData.reporteFiltros.tipo && this.useData.reporteFiltros.tipo.length > 0) {
                for (const a of this.useData.reporteFiltros.tipo) {
                    const i = this.useData.tipos.find(b => b.id == a)
                    this.filtros.tipo.push({...i})
                }
            }
        },
        setFiltroCuenta(){
            if (this.useData.reporteFiltros.cuenta && this.useData.reporteFiltros.cuenta.length > 0) {
                for (const a of this.useData.reporteFiltros.cuenta) {
                    const i = this.useData.cuentas.find(b => b.id == a)
                    this.filtros.cuenta.push({...i})
                }
            }
        },
        setFiltroCategoria(){
            if (this.useData.reporteFiltros.categoria && this.useData.reporteFiltros.categoria.length > 0) {
                for (const a of this.useData.reporteFiltros.categoria) {
                    const i = this.useData.categorias.find(b => b.id == a)
                    this.filtros.categoria.push({...i})
                }
            }
        },
        
        openMultiSelect(key, array){
            this.propMultiSelect = key
            this.dataMultiSelect = deepCopy(array)

            for (const a of this.filtros[key]) {
                const i = this.dataMultiSelect.findIndex(b => b.id == a.id)
                this.dataMultiSelect[i].selected = true
            }

            this.useModals.setModal('multiSelect','Seleccionar',true)
        },
        agregarItems(lista){
            this.filtros[this.propMultiSelect].length = 0

            for (const a of lista) {
                if (a.selected) {
                    this.filtros[this.propMultiSelect].push(a)
                }
            }
        },
        checkDatos(){
            if (this.filtros.f1 != null && this.filtros.f2 == null) {
                return swal('warning', 'Elige también la fecha final')
            }

            if (this.filtros.f2 != null && this.filtros.f1 == null) {
                return swal('warning', 'Elige también la fecha inicial')
            }

            if (this.filtros.f1 > this.filtros.f2) {
                return swal('warning', 'La fecha inicial no puede ser mayor a la fecha final')
            }
        },
        arreglar(){
            this.useData.reporteFiltros = {
                f1:this.filtros.f1,
                f2:this.filtros.f2,
                tipo: [],
                cuenta: [],
                categoria: [],
                detalle: this.filtros.detalle,
                monto: this.filtros.monto,
            }

            for (const a of this.filtros.tipo) {
                this.useData.reporteFiltros.tipo.push(a.id)
            }

            for (const a of this.filtros.cuenta) {
                this.useData.reporteFiltros.cuenta.push(a.id)
            }

            for (const a of this.filtros.categoria) {
                this.useData.reporteFiltros.categoria.push(a.id)
            }
        },
        async buscar(){
            if (this.useData.reporteLd == true) return

            this.arreglar()

            this.useData.reporteLd = true
            await this.useData.loadData('movimientos', 'reporte', 'reporteLd', `/filter?filtros=${JSON.stringify(this.useData.reporteFiltros)}`)

            this.agruparPorDia()
        },
        agruparPorDia() {
            let agrupado = {}

            this.useData.reporte.forEach( objeto => {
                var fecha = objeto.fecha

                if (!agrupado[fecha]) {
                    agrupado[fecha] = {
                        ingreso: 0,
                        egreso: 0,
                        datos: []
                    }
                }

                if (objeto.tipo === 1) {
                    agrupado[fecha].ingreso += objeto.monto
                }
                else if (objeto.tipo === 2) {
                    agrupado[fecha].egreso += objeto.monto
                }

                agrupado[fecha].datos.push(objeto)
            })

            this.lista = Object.keys(agrupado).map( fecha => {
                return { 
                    fecha: fecha, 
                    ingreso: agrupado[fecha].ingreso,
                    egreso: agrupado[fecha].egreso,
                    datos: agrupado[fecha].datos 
                }
            })

            this.lista.sort(function(a, b) {
                let fechaA = new Date(a.fecha)
                let fechaB = new Date(b.fecha)

                return fechaB - fechaA
            })
        },
        exportar(){
            // const headers = []
            const cols = ['fecha','tipo','cuenta','cuentab','categoria','prestamo','detalle','monto']
            const rows = this.useData.reporte.map(a => cols.map(b => a[b]))

            generateExcel(cols, rows, 'Reporte Money Mate.xlsx')
        },
        limpiar(){
            this.initFiltros()
            this.useData.reporteFiltros = {}
            this.lista.length = 0
            this.useData.reporte.length = 0
        },
        editar(a){
            this.useData.movimiento = deepCopy(a)
            // console.log(this.useData.movimiento)
            this.useData.movimiento.fecha = moment(this.useData.movimiento.fecha.slice(0,10)).format('YYYY-MM-DD')
            this.useData.movimiento.fecha1 = this.useData.movimiento.fecha
            this.useModals.setModal('movimiento','Editar',true,2)
        },
        actualizarMovimientos(item, key){
            const i = this.useData.reporte.findIndex(a => a.id == item.id)

            if (key == 2) {
                this.useData.reporte.splice(i, 1, item)

                // const f1 = moment(this.useData.reporteFiltros.f1)
                // const f2 = moment(this.useData.reporteFiltros.f2)
                // const fecha = moment(item.fecha.slice(0,10))

                // if (f1 != null || f2 != null) {
                //     if (f1 != null && f2 != null) {
                //         if (fecha.isBetween(f1, f2, null, '[]') == false) {
                //             this.useData.reporte.splice(i, 1)
                //         }
                //         else {
                //             this.useData.reporte.splice(i, 1, item)
                //         }
                //     }
                    
                //     if (f1 == null && f2 != null) {
                //         if (fecha.isSameOrAfter(f1) == false) {
                //             this.useData.reporte.splice(i, 1)
                //         }
                //         else {
                //             this.useData.reporte.splice(i, 1, item)
                //         }
                //     }

                //     if (f1 != null && f2 == null) {
                //         if (fecha.isSameOrBefore(f2) == false) {
                //             this.useData.reporte.splice(i, 1)
                //         }
                //         else {
                //             this.useData.reporte.splice(i, 1, item)
                //         }
                //     }
                // }
                // else {
                //     this.useData.reporte.splice(i, 1, item)
                // }
            }

            if (key == 3) this.useData.reporte.splice(i, 1)

            this.agruparPorDia()
        }
    },
}
</script>

<style lang="scss" scoped>
.filtro{
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    align-items: center;

    ul{
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        overflow-x: auto;

        li{
            padding: 0.25rem 0.5rem;
            background-color: var(--bg-color2);
            border-radius: 0.8rem;
            font-size: 0.8rem;
            text-wrap: nowrap;
        }
    }
}

.section-body{
    overflow-y: auto;
}
</style>