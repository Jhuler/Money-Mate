<template>
    <modalBack
        modal="prestamo"
        :buttons="buttons"
        @jdmodal-buttons-click="actions"
    >
        <ul class="tipo-prestamo" v-if="useModals.prestamo.mode == 1">
            <li @click="useData.prestamo.tipo=1" :class="{'pestana-activa':useData.prestamo.tipo==1}">A mí</li>
            <li @click="useData.prestamo.tipo=2" :class="{'pestana-activa':useData.prestamo.tipo==2}">A otros</li>
        </ul>

        <h3 class="mrg-btm1" v-else>Préstamo {{ useData.prestamo.tipo == 1 ? 'a mí' : 'a otros' }}</h3>
        
        <formInput label="Nombre de la persona" v-model="useData.prestamo.persona"/>
        <formInput label="Motivo" v-model="useData.prestamo.motivo"/>

        <movimientosAgregarDetalle v-if="useModals.prestamo.mode == 1"/>
    </modalBack>
</template>

<script>
import modalBack from '@/layouts/modalBack.vue'
import formInput from '@/components/formInput.vue'
import movimientosAgregarDetalle from '@/views/u/movimientos/movimientosAgregarDetalle.vue'

import { useData } from '@/store/data.js'
import { useModals } from '@/store/modals.js'

import { deepCopy, incompleteData, swal } from '@/store/meUtil'

export default {
    components: {
        modalBack,
        formInput,
        movimientosAgregarDetalle,
    },
    emits: ['ordenar'],
    data: () => ({
        buttons:[
            {text:'Crear', spin:false, action:'crear', show:false, color:'1'},
            {text:'Eliminar', spin:false, action:'eliminar', show:false},
            {text:'Modificar', spin:false, action:'modificar', show:false, color:'1'},
        ],

        useData:useData(),
        useModals:useModals(),
    }),
    async created() {
        this.initButtons()
    },
    methods: {
        initButtons(){
            if (this.useModals.prestamo.mode == 1) {
                this.buttons[0].show = true
            }
            else {
                this.buttons[1].show = true
                this.buttons[2].show = true
            }
        },
        checkDatos(){
            const item = deepCopy(this.useData.prestamo)
            
            if (incompleteData(item, 'persona', 'motivo')) {
                swal('warning', 'Ingrese los datos necesarios')
                return true
            }

            return false
        },
        checkDatos1(){
            const item = deepCopy(this.useData.movimiento)
            
            if (incompleteData(item, ['fecha', 'cuenta'])) {
                swal('warning', 'Ingrese los datos necesarios')
                return true
            }

            if (item.monto == 0) {
                swal('warning', 'Ingrese un monto mayor a cero')
                return true
            }

            return false
        },
        async crear(){
            if (this.checkDatos()) return
            if (this.checkDatos1()) return

            this.useData.movimiento.tipo = this.useData.prestamo.tipo

            this.useData.prestamo.movimiento = deepCopy(this.useData.movimiento)

            this.buttons[0].spin = true
            const result = await this.useData.createData('prestamos','prestamo','prestamos')
            this.buttons[0].spin = false

            if (!result) return

            // this.$emit('ordenar', 1, this.useData.prestamo)
            
            this.useModals.prestamo.show = false
        },
        async modificar(){
            if (this.checkDatos()) return

            this.buttons[2].spin = true
            const result = await this.useData.updateData('prestamos','prestamo','prestamos')
            this.buttons[2].spin = false

            if (!result) return

            // this.$emit('ordenar', 2, this.useData.prestamo)
            
            this.useModals.prestamo.show = false
        },
        async eliminar(){
            if (this.useData.prestamo.movements.length > 0) return swal('error', 'No se puede borrar un prestamo con movimientos')

            this.buttons[1].spin = true
            const result = await this.useData.deleteData('prestamos','prestamo','prestamos')
            this.buttons[1].spin = false

            if (!result) return

            // this.$emit('ordenar', 3, this.useData.prestamo)
            
            this.useModals.prestamo.show = false
        },
        actions(action){
            this[action]()
        },
    },
}
</script>

<style lang="scss" scoped>
.tipo-prestamo{
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 1rem;

    li{
        padding: 0.5rem;
        text-align: center;
        border-radius: 0.3rem;
        cursor: pointer;
    }

    .pestana-activa{
        background-color: var(--primary-color);
        color: var(--text-color3);
    }
}
</style>