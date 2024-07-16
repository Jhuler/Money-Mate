<template>
    <modalBack
        modal="cambiarContrasena"
        :buttons="buttons"
        @jdmodal-buttons-click="actions"
    >
        <div v-if="pestana==0">
            <strong>No puede cambiar su contraseña</strong>

            <p class="mrg-top1">
                <small>Tiene que pasar un periodo de 30 días desde la última modificación</small>
                <i>
                    <small> ({{ moment(useAuth.usuario.lastUpdatePassword).format('DD/MM/YYYY') }})</small>
                </i>
            </p>
        </div>

        <div v-if="pestana==1">
            <p class="mrg-btm1">Para continuar ingrese su contraseña actual</p>
            <inputPassword placeholder="Contraseña" v-model="contrasena" class="mrg-btm05"/>
        </div>

        <div v-if="pestana==2">
            <p class="mrg-btm1">Rellene ambos campos</p>
            <inputPassword placeholder="Contraseña" v-model="contrasena1" class="mrg-btm05"/>
            <inputPassword placeholder="Contraseña" v-model="contrasena2" class="mrg-btm05"/>
        </div>

        <div class="mrg-top1 info" v-if="pestana != 0">
            <small>
                <i class="fa-solid fa-triangle-exclamation"></i>
                No podrás volver a cambiar tu contraseña después de 30 días
            </small>
        </div>
    </modalBack>
</template>

<script>
import modalBack from '@/layouts/modalBack.vue'
import inputPassword from '@/components/inputPassword.vue'

import { useAuth } from '@/store/auth'
import { useModals } from '@/store/modals'
import { post, urls } from '@/store/meCrud'
import { deepCopy, swal } from '@/store/meUtil'
import moment from 'moment'

export default {
    components: {
        modalBack,
        inputPassword
    },
    data: () => ({
        pestana:0,
        contrasena:'',
        contrasena1:'',
        contrasena2:'',
        buttons: [
            {text:'Validar', spin:false, action:'validarContrasena', show:false, color:'1'},
            {text:'Modificar', spin:false, action:'modificarContrasena', show:false, color:'1'},
        ],

        useAuth:useAuth(),
        useModals:useModals(),

        moment,
    }),
    created(){
        if (moment().diff(moment(this.useAuth.usuario.lastUpdatePassword), 'days') >= 30 || this.useAuth.usuario.lastUpdatePassword==null) {
            this.buttons[0].show = true
            this.pestana = 1
        }
    },
    methods: {
        async validarContrasena(){
            if (this.contrasena == '') return swal('warning', 'Ingrese su contraseña')

            this.buttons[0].spin = true
            const result = await post(urls.usuarios+'/validar-contrasena', {contrasena:this.contrasena}, 'Validación correcta')
            this.buttons[0].spin = false

            if (result.code != 0) return

            this.pestana = 2
            this.buttons[0].show = false
            this.buttons[1].show = true
        },
        async modificarContrasena(){
            if (this.contrasena1 == '' || this.contrasena2 == '') return swal('warning', 'Ingrese ambos campos')
            if (this.contrasena1 != this.contrasena2) return swal('warning', 'Las contraseñas no coinciden')

            this.buttons[1].spin = true
            const result = await post(urls.usuarios+'/cambiar-contrasena', {contrasena:this.contrasena1}, 'Contraseña actualizada con éxito')
            this.buttons[1].spin = false

            if (result.code != 0) return

            this.useAuth.usuario = deepCopy(result.data)
            this.useModals.cambiarContrasena.show = false
        },
        actions(action){
            this[action]()
        },
    },
}
</script>

<style lang="scss" scoped>
.info{
    i{
        color: var(--text-color2);
    }
}
</style>