<template>
    <section>
        <div class="section-head">
            <div class="top">
                <img src="@/assets/img/logo1.png" alt="">
                <!-- <h2>Money Mate</h2> -->
            </div>

            <filtroFechas
                pestana="inicio"
                :loading="useData.movimientosLd"
                @change-fecha="changeFecha"
            />

            <div class="resumen">
                <div>
                    <small>Ingresos</small>
                    <p>{{ formatoNum(ingresos) }}</p>
                </div>

                <div>
                    <small>Egresos</small>
                    <p>{{ formatoNum(egresos) }}</p>
                </div>

                <div>
                    <small>Saldo</small>
                    <p>{{ formatoNum(ingresos - egresos) }}</p>
                </div>
            </div>
        </div>

        <div class="section-body">
            <loadingSpin position="initial" v-if="useData.movimientosLd"/>

            <small v-if="!useData.movimientosLd && lista.length == 0">No se encuentran registros</small>

            <movimientosAgrupadoDia :datos="lista" @editar="editar" v-if="lista.length > 0"/>
        </div>
    </section>

    <buttonAdd @click="nuevo()"/>
    <movimientosAgregar v-if="useModals.movimiento.show" @ordenar="actualizarMovimientos"/>
</template>

<script>
import filtroFechas from '@/components/filtroFechas.vue'
import loadingSpin from '@/components/loadingSpin.vue'
import buttonAdd from '@/components/buttonAdd.vue'
import movimientosAgregar from './movimientosAgregar.vue'
import movimientosAgrupadoDia from '../movimientos/movimientosAgrupadoDia.vue'

import { useAuth } from '@/store/auth.js'
import { useData } from '@/store/data.js'
import { useModals } from '@/store/modals.js'
import { deepCopy, formatoNum } from '@/store/meUtil'

import moment from 'moment'
import 'moment/locale/es'

export default {
    components: {
        filtroFechas,
        loadingSpin,
        movimientosAgregar,
        buttonAdd,
        movimientosAgrupadoDia,
    },
    data: () => ({
        ingresos:0,
        egresos:0,
        lista:[],

        useAuth:useAuth(),
        useData:useData(),
        useModals:useModals(),

        formatoNum,
        moment,
    }),
    methods:{
        async changeFecha(){
            this.ingresos = 0
            this.egresos = 0
            this.lista.length = 0
            this.useData.movimientos.length = 0
            this.useData.movimientosLd = true
            
            await this.loadMovimientos()
            this.agruparPorDia()
        },
        async loadMovimientos(){
            if (!this.useData.movimientosLd) return

            const fechas = JSON.parse(localStorage.getItem('inicio-fechas'))

            await this.useData.loadData('movimientos', 'movimientos', 'movimientosLd', `?f1=${fechas.f1}&f2=${fechas.f2}`)
        },
        agruparPorDia() {
            this.ingresos = 0
            this.egresos = 0
            
            let agrupado = {}
            
            this.useData.movimientos.forEach( objeto => {
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

                this.ingresos += objeto.tipo == 1 ? objeto.monto : 0
                this.egresos += objeto.tipo == 2 ? objeto.monto : 0
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
        nuevo(){
            this.useData.initMovimiento()
            this.useModals.setModal('movimiento','Agregar',true,1)
        },
        editar(a){
            this.useData.movimiento = deepCopy(a)
            
            this.useData.movimiento.fecha = moment(this.useData.movimiento.fecha.slice(0,10)).format('YYYY-MM-DD')
            this.useData.movimiento.fecha1 = this.useData.movimiento.fecha
            this.useModals.setModal('movimiento','Editar',true,2)
        },
        actualizarMovimientos(item, key){
            if (key == 2) {
                const fechas = JSON.parse(localStorage.getItem('inicio-fechas'))
                const f1 = moment(fechas.f1)
                const f2 = moment(fechas.f2)
                const fecha = moment(item.fecha.slice(0,10))

                if (fecha.isBetween(f1, f2, null, '[]') == false) {
                    const i = this.useData.movimientos.findIndex(a => a.id == item.id)
                    this.useData.movimientos.splice(i, 1)
                }
            }

            this.agruparPorDia()
        }
    }
}
</script>

<style lang="scss" scoped>
.section-head{
    .resumen{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;

        div{
            text-align: center;
        }
    }
}

.section-body{
    overflow-y: auto;
}
</style>