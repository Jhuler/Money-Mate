<template>
    <modalBack
        modal="cuenta"
        :buttons="buttons"
        @jdmodal-buttons-click="actions"
    >
        <formInput label="Nombre de la cuenta" v-model="useData.cuenta.nombre"/>

        <formSelect label="Moneda"
            v-model="useData.cuenta.moneda"
            :lista="currency"
            mostrar="name"
            val="code"
        />

        <formInput label="Comentarios" v-model="useData.cuenta.info"/>
    </modalBack>
</template>

<script>
import modalBack from '@/layouts/modalBack.vue'
import formInput from '@/components/formInput.vue'
import formSelect from '@/components/formSelect.vue'

import { useData } from '@/store/data.js'
import { useModals } from '@/store/modals.js'

import { deepCopy, incompleteData, swal } from '@/store/meUtil'

import currency from '@/data/currency.json'

export default {
    components: {
        modalBack,
        formInput,
        formSelect,
    },
    data: () => ({
        buttons:[
            {text:'Crear', spin:false, action:'crear', show:false, color:'1'},
            {text:'Eliminar', spin:false, action:'eliminar', show:false},
            {text:'Modificar', spin:false, action:'modificar', show:false, color:'1'},
        ],

        useData:useData(),
        useModals:useModals(),

        currency,
    }),
    async created() {
        if (this.useModals.cuenta.mode == 1) {
            this.buttons[0].show = true
        }
        else {
            this.buttons[1].show = true
            this.buttons[2].show = true
        }
    },
    methods: {
        checkDatos(){
            const item = deepCopy(this.useData.cuenta)
            
            if (incompleteData(item, ['nombre', 'moneda'])) {
                swal('warning', 'Ingrese los datos necesarios')
                return true
            }

            return false
        },
        async crear(){
            if (this.checkDatos()) return

            this.buttons[0].spin = true
            const result = await this.useData.createData('cuentas','cuenta','cuentas')
            this.buttons[0].spin = false

            if (!result) return

            this.useData.cuenta.movements = []
            this.$emit('ordenar', 1, this.useData.cuenta)
            
            this.useModals.cuenta.show = false
        },
        async modificar(){
            if (this.checkDatos()) return

            this.buttons[2].spin = true
            const result = await this.useData.updateData('cuentas','cuenta','cuentas')
            this.buttons[2].spin = false

            if (!result) return

            this.$emit('ordenar', 2, this.useData.cuenta)
            
            this.useModals.cuenta.show = false
        },
        async eliminar(){
            this.buttons[1].spin = true
            const result = await this.useData.deleteData('cuentas','cuenta','cuentas')
            this.buttons[1].spin = false

            if (!result) return

            this.$emit('ordenar', 3, this.useData.cuenta)
            
            this.useModals.cuenta.show = false
        },
        actions(action){
            this[action]()
        },
    }
}
</script>