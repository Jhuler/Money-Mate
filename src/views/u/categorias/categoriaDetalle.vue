<template>
    <section>
        <div class="section-head">
            <div class="top">
                <img src="@/assets/img/logo1.png" alt="">
            </div>

            <filtroFechas
                pestana="categorias"
                :loading="spin"
                @change-fecha="changeFecha"
            />

            <div class="container-categoria" v-if="categoria.id">
                <p>
                    <strong>{{ categoria.nombre }}</strong>
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
        categoria:{},
        lista:[],
        valor:0,
        spin:false,

        useData:useData(),
        useModals:useModals(),
        formatoNum,
    }),
    async created(){
    },
    methods: {
        async changeFecha(){
            this.valor = 0
            this.lista.length = 0

            await this.loadCategoria()
        },
        async loadCategoria(){
            const fechas = JSON.parse(localStorage.getItem('categorias-fechas'))
            
            this.spin = true
            const result = await get(urls.categorias+`/movimientos?id=${this.$route.params.id}&f1=${fechas.f1}&f2=${fechas.f2}`)
            this.spin = false

            if (result.code != 0 || result.data == null) {
                this.$router.replace({name:'categorias'})
                return
            }

            this.categoria = deepCopy(result.data)
            this.agruparPorDia()
        },
        agruparPorDia(){
            this.valor = 0
            let agrupado = {}
            
            this.categoria.movements.forEach(a => {
                var fecha = a.fecha

                if (!agrupado[fecha]) {
                    agrupado[fecha] = {
                        datos: [],
                        ingreso: 0,
                        egreso: 0,
                    }
                }

                agrupado[fecha].datos.push(a)

                if (a.tipo === 1) {
                    agrupado[fecha].ingreso += a.monto
                }
                else if (a.tipo === 2) {
                    agrupado[fecha].egreso += a.monto
                }

                this.valor += a.monto
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
            const i = this.categoria.movements.findIndex(a => a.id == item.id)

            if (key == 2) {
                if (item.categoria != this.$route.params.id) {
                    this.categoria.movements.splice(i, 1)
                }
                else {
                    const fechas = JSON.parse(localStorage.getItem('categorias-fechas'))
                    const f1 = moment(fechas.f1)
                    const f2 = moment(fechas.f2)
                    const fecha = moment(item.fecha.slice(0,10))
                    
                    if (fecha.isBetween(f1, f2, null, '[]') == false) {
                        this.categoria.movements.splice(i, 1)
                    }
                    else {
                        this.categoria.movements.splice(i, 1, item)
                    }
                }
            }

            if (key == 3) this.categoria.movements.splice(i, 1)

            this.agruparPorDia()
        }
    },
}
</script>

<style lang="scss" scoped>
.section-head{
    .container-categoria{
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