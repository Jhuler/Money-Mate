<template>
    <modalBack
        modal="categoria"
        :buttons="buttons"
        @jdmodal-buttons-click="actions"
    >
        <formSelect label="Tipo"
            v-model="useData.categoria.tipo"
            :lista="useData.tipos.filter(a => a.id != 3)"
        />
        <formInput label="Nombre de la categoria" v-model="useData.categoria.nombre"/>
        <formInput tipo="color" label="Color" v-model="useData.categoria.color"/>
    </modalBack>
</template>

<script>
import modalBack from '@/layouts/modalBack.vue'
import formInput from '@/components/formInput.vue'
import formSelect from '@/components/formSelect.vue'

import { useData } from '@/store/data.js'
import { useModals } from '@/store/modals.js'

import { deepCopy, incompleteData, swal } from '@/store/meUtil'

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
    }),
    async created() {
        this.initButtons()
    },
    methods: {
        initButtons(){
            if (this.useModals.categoria.mode == 1) {
                this.buttons[0].show = true
            }
            else {
                this.buttons[1].show = true
                this.buttons[2].show = true
            }
        },
        checkDatos(){
            const item = deepCopy(this.useData.categoria)
            
            if (incompleteData(item, ['nombre', 'tipo'])) {
                swal('warning', 'Ingrese los datos necesarios')
                return true
            }

            return false
        },
        async crear(){
            if (this.checkDatos()) return

            this.buttons[0].spin = true
            const result = await this.useData.createData('categorias','categoria','categorias')
            this.buttons[0].spin = false

            if (!result) return

            this.useData.categoria.movements = []
            this.$emit('ordenar', 1, this.useData.categoria)
            
            this.useModals.categoria.show = false
        },
        async modificar(){
            if (this.checkDatos()) return

            this.buttons[2].spin = true
            const result = await this.useData.updateData('categorias','categoria','categorias')
            this.buttons[2].spin = false

            if (!result) return

            this.$emit('ordenar', 2, this.useData.categoria)
            
            this.useModals.categoria.show = false
        },
        async eliminar(){
            this.buttons[1].spin = true
            const result = await this.useData.deleteData('categorias','categoria','categorias')
            this.buttons[1].spin = false

            if (!result) return

            this.$emit('ordenar', 3, this.useData.categoria)

            this.useModals.categoria.show = false
        },
        actions(action){
            this[action]()
        },
    }
}
</script>