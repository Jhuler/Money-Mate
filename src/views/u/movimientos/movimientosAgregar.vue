<template>
    <modalBack
        modal="movimiento"
        :buttons="buttons"
        @jdmodal-buttons-click="actions"
    >
        <ul class="tipo-move" v-if="useModals.movimiento.mode == 1 && useData.movimiento.prestamo == null">
            <li @click="changeTipo(1)" :class="{'pestana-activa':useData.movimiento.tipo==1}">Ingreso</li>
            <li @click="changeTipo(2)" :class="{'pestana-activa':useData.movimiento.tipo==2}">Egreso</li>
            <li @click="changeTipo(3)" :class="{'pestana-activa':useData.movimiento.tipo==3}">Transferencia</li>
        </ul>

        <p class="mrg-btm1" v-else>
            <strong v-if="useData.movimiento.tipo == 1"> Ingreso </strong>
            <strong v-if="useData.movimiento.tipo == 2"> Egreso </strong>
        </p>

        <movimientosAgregarCategorias
            ref="categorias"
            v-if="useData.movimiento.tipo!=3 && useData.movimiento.prestamo==null"
        />

        <movimientosAgregarDetalle/>
    </modalBack>
</template>

<script>
import modalBack from '@/layouts/modalBack.vue'
import movimientosAgregarCategorias from './movimientosAgregarCategorias.vue'
import movimientosAgregarDetalle from './movimientosAgregarDetalle.vue'

import { useData } from '@/store/data.js'
import { useModals } from '@/store/modals.js'

import { deepCopy, incompleteData, swal } from '@/store/meUtil'

import moment from 'moment'

export default {
    components: {
        modalBack,
        movimientosAgregarCategorias,
        movimientosAgregarDetalle,
    },
    emits: ['ordenar'],
    data: () => ({
        buttons:[
            {text:'Grabar', spin:false, action:'grabar', show:false, color:'1'},
            {text:'Eliminar', spin:false, action:'eliminar', show:false},
            {text:'Modificar', spin:false, action:'modificar', show:false, color:'1'},
        ],

        useData:useData(),
        useModals:useModals(),

        moment,
    }),
    async created() {
        this.initButtons()
    },
    methods:{
        changeTipo(key){
            this.useData.movimiento.tipo = key

            try {
                this.$refs.categorias.filtrar()
            }
            catch (error) {
                error
            }
        },
        checkDatos(){
            const item = deepCopy(this.useData.movimiento)
            
            if (incompleteData(item, ['fecha', 'cuenta'])) {
                swal('warning', 'Ingrese los datos necesarios')
                return true
            }

            if (item.tipo != 3 && item.prestamo==null) {
                if (incompleteData(item, ['categoria'])) {
                    swal('warning', 'Elija una categoria')
                    return true
                }
            }

            if (item.tipo == 3) {
                if (item.cuentab == null) {
                    swal('warning', 'Elija la cuenta de destino')
                    return true
                }

                if (item.cuentab == item.cuenta) {
                    swal('warning', 'La cuenta de origen y destino deben ser diferentes')
                    return true
                }
            }

            if (item.monto == 0) {
                swal('warning', 'Ingrese un monto mayor a cero')
                return true
            }

            return false
        },
        async grabar(){
            if (this.checkDatos()) return

            this.buttons[0].spin = true
            const result = await this.useData.createData('movimientos','movimiento','movimientos')
            this.buttons[0].spin = false

            if (!result) return

            this.$emit('ordenar', this.useData.movimiento, 1)
            
            this.useModals.movimiento.show = false
        },
        async modificar(){
            if (this.checkDatos()) return

            this.buttons[2].spin = true
            const result = await this.useData.updateData('movimientos','movimiento','movimientos')
            this.buttons[2].spin = false

            if (!result) return

            this.$emit('ordenar', this.useData.movimiento, 2)
            
            this.useModals.movimiento.show = false
        },
        async eliminar(){
            this.buttons[1].spin = true
            const result = await this.useData.deleteData('movimientos','movimiento','movimientos')
            this.buttons[1].spin = false

            if (!result) return

            this.$emit('ordenar', this.useData.movimiento, 3)
            
            this.useModals.movimiento.show = false
        },

        initButtons(){
            if (this.useModals.movimiento.mode == 1) {
                this.buttons[0].show = true
            }
            else {
                this.buttons[1].show = true
                this.buttons[2].show = true
            }
        },
        actions(action){
            this[action]()
        },
    }
}
</script>

<style lang="scss" scoped>
.tipo-move{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: 1rem;

    li{
        padding: 0.5rem;
        text-align: center;
        border-radius: 0.3rem;
        cursor: pointer;

        // &:hover{
        //     background-color: var(--bg-color-hover);
        // }
    }

    .pestana-activa{
        background-color: var(--primary-color);
        color: var(--text-color3);
    }
}
</style>