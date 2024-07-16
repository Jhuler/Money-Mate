<template>
    <div class="prestamo-detalle-movimientos">
        <div class="mrg-btm2">
            <div class="mrg-btm05">
                <p class="mrg-btm05 cabecera">
                    <strong>Saldo:</strong>
                    <strong>{{ formatoNum(saldo) }}</strong>
                </p>
            </div>
        </div>

        <div class="mrg-btm2">
            <div class="mrg-btm05">
                <p class="mrg-btm05 cabecera">
                    <strong>Prestado:</strong>
                    <strong>{{ formatoNum(pedido) }}</strong>
                </p>

                <button class="mrg-btm05 btn2" @click="addPago(1)">
                    <i class="fa-solid fa-plus"></i>
                    Agregar
                </button>
            </div>

            <ul>
                <li v-for="a in pedidos" :key="a.id" @click="editPago(a)" class="gruped">
                    <div>
                        <p>{{ moment(a.fecha).format('DD/MM/YYYY') }}</p>
                        <small>{{ a.detalle }}</small>
                    </div>
    
                    <div class="to-right">
                        <p>{{ formatoNum(a.monto) }}</p>
                        <p><small>{{ a.cuenta1.nombre }}</small></p>
                    </div>
                </li>
            </ul>
        </div>

        <div>
            <div class="mrg-btm05">
                <p class="mrg-btm05 cabecera">
                    <strong>Pagos:</strong>
                    <strong>{{ formatoNum(pago) }}</strong>
                </p>
                <button class="mrg-btm05" @click="addPago(2)">
                    <i class="fa-solid fa-plus"></i>
                    Agregar
                </button>
            </div>

            <ul>
                <li v-for="a in pagos" :key="a.id" @click="editPago(a)" class="gruped">
                    <div>
                        <p>{{ moment(a.fecha).format('DD/MM/YYYY') }}</p>
                        <small>{{ a.detalle }}</small>
                    </div>
    
                    <div class="to-right">
                        <p>{{ formatoNum(a.monto) }}</p>
                        <p><small>{{ a.cuenta1.nombre }}</small></p>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <movimientosAgregar v-if="useModals.movimiento.show" @ordenar="actualizarMovimientos"/>
</template>

<script>
import movimientosAgregar from '@/views/u/movimientos/movimientosAgregar.vue'

import { useData } from '@/store/data'
import { useModals } from '@/store/modals'
import { formatoNum, deepCopy } from '@/store/meUtil'

import moment from 'moment'

export default {
    components: {
        movimientosAgregar
    },
    props:{
        movimientos: Array
    },
    data: () => ({
        pedidos:[],
        pagos:[],

        pedido:0,
        pago:0,
        saldo:0,

        useData:useData(),
        useModals:useModals(),
        formatoNum,

        moment,
    }),
    created() {
        this.agrupar()
    },
    methods: {
        agrupar(){
            this.pedidos = []
            this.pagos = []
            this.pedido = 0
            this.pago = 0
            this.saldo = 0

            for (const b of this.useData.prestamo.movements) {
                if (this.useData.prestamo.tipo == 1) {
                    if (b.tipo == 1) {
                        this.pedido += b.monto
                        this.pedidos.push({...b})
                    }
                    else {
                        this.pago += b.monto
                        this.pagos.push({...b})
                    }
                }
                else {
                    if (b.tipo == 2) {
                        this.pedido += b.monto
                        this.pedidos.push({...b})
                    }
                    else {
                        this.pago += b.monto
                        this.pagos.push({...b})
                    }
                }
            }

            this.saldo = this.pedido - this.pago
        },
        addPago(key){
            this.useData.initMovimiento()

            if (this.useData.prestamo.tipo == 1) {
                this.useData.movimiento.tipo = key
            }
            else {
                this.useData.movimiento.tipo = key == 1 ? 2 : 1
            }

            this.useData.movimiento.prestamo = this.$route.params.id

            this.useModals.setModal('movimiento', 'Agregar', true, 1)
        },
        editPago(a){
            this.useData.movimiento = deepCopy(a)
            this.useData.movimiento.fecha = moment(this.useData.movimiento.fecha.slice(0,10)).format('YYYY-MM-DD')
            this.useData.movimiento.fecha1 = this.useData.movimiento.fecha

            this.useModals.setModal('movimiento', 'Editar', true, 2)
        },
        actualizarMovimientos(item, key){
            if (key == 1) {
                this.useData.prestamo.movements.push(item)
            }
            else {
                const i = this.useData.prestamo.movements.findIndex(a => a.id == item.id)

                if (key == 2) this.useData.prestamo.movements.splice(i, 1, item)
                if (key == 3) this.useData.prestamo.movements.splice(i, 1)
            }

            this.agrupar()
        }
    }
}
</script>

<style lang="scss" scoped>
.prestamo-detalle-movimientos{
    .cabecera{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 0.5rem;
        border-bottom: var(--border);
    }

    .gruped{
        display: grid;
        grid-template-columns: auto 8rem !important;
        margin-bottom: 1rem;
    }
}
</style>