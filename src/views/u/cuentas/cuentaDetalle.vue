<template>
    <section>
        <div class="section-head">
            <div class="top">
                <img src="@/assets/img/logo1.png" alt="">
            </div>

            <filtroFechas
                pestana="cuentas"
                :loading="spin"
                @change-fecha="changeFecha"
            />

            <div class="container-cuenta" v-if="cuenta.id">
                <p>
                    <strong>{{ cuenta.nombre }}</strong>
                </p>

                <p>
                    <strong>{{ formatoNum(valor) }}</strong>
                </p>
            </div>
        </div>

        <div class="section-body">
            <loadingSpin v-if="spin" position="initial"/>

            <movimientosAgrupadoDia :datos="lista" @editar="editarMovimiento" v-if="lista.length > 0"/>
        </div>
    </section>

    <movimientosAgregar v-if="useModals.movimiento.show" @ordenar="actualizarMovimientos"/>
</template>

<script>
import filtroFechas from '@/components/filtroFechas.vue'
import loadingSpin from '@/components/loadingSpin.vue'
import movimientosAgrupadoDia from '../movimientos/movimientosAgrupadoDia.vue'
import movimientosAgregar from '../movimientos/movimientosAgregar.vue'

import { useData } from '@/store/data'
import { useModals } from '@/store/modals'
import { get, urls } from '@/store/meCrud'
import { formatoNum, deepCopy } from '@/store/meUtil'

import moment from 'moment'
import 'moment/locale/es'

export default {
    components: {
        filtroFechas,
        loadingSpin,
        movimientosAgrupadoDia,
        movimientosAgregar
    },
    data: () => ({
        cuenta:{},
        lista:[],
        valor:0,
        spin:false,

        useData:useData(),
        useModals:useModals(),
        formatoNum,
    }),
    methods: {
        async changeFecha(){
            this.valor = 0
            this.lista.length = 0

            await this.loadCuenta()
        },
        async loadCuenta(){
            const fechas = JSON.parse(localStorage.getItem('cuentas-fechas'))
            
            this.spin = true
            const result = await get(urls.cuentas+`/detalle?id=${this.$route.params.id}&f1=${fechas.f1}&f2=${fechas.f2}`)
            this.spin = false

            if (result.code != 0 || result.data == null) {
                this.$router.replace({name:'cuentas'})
                return
            }

            this.cuenta = deepCopy(result.data)
            // console.log(this.cuenta)
            this.agruparPorDia()
        },
        agruparPorDia(){
            this.valor = 0
            let agrupado = {}
            
            this.cuenta.movements.forEach(a => {
                var fecha = a.fecha

                if (!agrupado[fecha]) {
                    agrupado[fecha] = {
                        datos: [],
                        ingreso: 0,
                        egreso: 0,
                    }
                }

                agrupado[fecha].datos.push(a)

                if (a.tipo == 1) {
                    agrupado[fecha].ingreso += a.monto

                    this.valor += a.monto
                }
                else if (a.tipo === 2) {
                    agrupado[fecha].egreso += a.monto

                    this.valor += a.monto*-1
                }
                else if (a.tipo === 3) {
                    this.valor += a.monto*(a.cuenta == this.$route.params.id ? -1 : 1)
                }
            })

            this.lista = Object.keys(agrupado).map( fecha => {
                return { 
                    fecha: fecha, 
                    ingreso: agrupado[fecha].ingreso,
                    egreso: agrupado[fecha].egreso,
                    datos: agrupado[fecha].datos 
                }
            })

            this.lista.sort((a, b) => {
                let fechaA = new Date(a.fecha)
                let fechaB = new Date(b.fecha)

                return fechaB - fechaA
            })
        },
        editarMovimiento(a){
            this.useData.movimiento = deepCopy(a)
            
            this.useData.movimiento.fecha = moment(this.useData.movimiento.fecha.slice(0,10)).format('YYYY-MM-DD')
            this.useData.movimiento.fecha1 = this.useData.movimiento.fecha
            this.useModals.setModal('movimiento','Editar',true,2)
        },
        actualizarMovimientos(item, key){
            const i = this.cuenta.movements.findIndex(a => a.id == item.id)

            if (key == 2) {
                if (item.cuenta != this.$route.params.id && item.cuentab != this.$route.params.id) {
                    this.cuenta.movements.splice(i, 1)
                }
                else {
                    const fechas = JSON.parse(localStorage.getItem('categorias-fechas'))
                    const f1 = moment(fechas.f1)
                    const f2 = moment(fechas.f2)
                    const fecha = moment(item.fecha.slice(0,10))
                    
                    if (fecha.isBetween(f1, f2, null, '[]') == false) {
                        this.cuenta.movements.splice(i, 1)
                    }
                    else {
                        this.cuenta.movements.splice(i, 1, item)
                    }
                }
            }

            if (key == 3) this.cuenta.movements.splice(i, 1)

            this.agruparPorDia()
        }
    },
}
</script>

<style lang="scss" scoped>
.section-head{
    .container-cuenta{
        display: flex;
        justify-content: space-between;
        align-items: center;

        i{
            cursor: pointer;
            margin-right: 0.5rem;
        }
    }
}

.section-body{
    overflow-y: auto;
}
</style>