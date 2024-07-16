<template>
    <modalBack
        modal="personalInfo"
        :buttons="buttons"
        @jdmodal-buttons-click="actions"
    >
        <div>
            <label>Nombres</label>
            <formInput v-model="user.nombres"/>

            <label>Apellidos</label>
            <formInput v-model="user.apellidos"/>
        </div>
    </modalBack>
</template>

<script>
import modalBack from '@/layouts/modalBack.vue'
import formInput from '@/components/formInput.vue'

import { useAuth } from '@/store/auth'
import { useModals } from '@/store/modals'

import { deepCopy } from '@/store/meUtil'
import { urls, patch } from '@/store/meCrud'

export default {
    components: {
        modalBack,
        formInput
    },
    data: () => ({
        user:{},
        buttons: [
            {text:'Modificar', spin:false, action:'modificar', show:true, color:'1'},
        ],

        useAuth:useAuth(),
        useModals:useModals(),
    }),
    created() {
        this.user = deepCopy(this.useAuth.usuario)
    },
    methods: {
        async modificar(){
            const send = {
                id: this.user.id,
                nombres: this.user.nombres,
                apellidos: this.user.apellidos,
            }

            this.buttons[0].spin = true
            const result = await patch(urls.usuarios, send)
            this.buttons[0].spin = false

            if (result.code != 0) return

            this.useAuth.usuario = deepCopy(result.data)
            this.useModals.personalInfo.show = false
        },
        actions(action){
            this[action]()
        },
    }
}
</script>

<style lang="scss" scoped>
    
</style>