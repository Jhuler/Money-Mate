<template>
    <modalBack
        modal="cambiarCorreo"
        :buttons="buttons"
        @jdmodal-buttons-click="actions"
    >
        <div v-if="pestana==0">
            <strong>No puede cambiar su correo</strong>
            
            <p class="mrg-top1">
                <small>Tiene que pasar un periodo de 30 días desde la última modificación.</small>
                <i>
                    <small> ({{ moment(useAuth.usuario.lastUpdateCorreo).format('DD/MM/YYYY') }})</small>
                </i>
            </p>
            <p>
            </p>
        </div>

        <div v-if="pestana==1">
            <p class="mrg-btm1">Para continuar ingrese su contraseña actual</p>
            <inputPassword placeholder="Contraseña" v-model="contrasena"/>
        </div>

        <div v-if="pestana==2">
            <p class="mrg-btm1">Ingrese el nuevo correo</p>
            <input type="email" placeholder="Correo" v-model="correo" class="input1">
        </div>

        <div v-if="pestana==3">
            <p class="mrg-btm1">Ingresa el código de confirmación que enviamos a <strong>{{correo}}</strong></p>
            <input type="text" maxlength="6" v-model="codigo" class="input1">
        </div>

        <div class="mrg-top1 info" v-if="pestana != 0">
            <small>
                <i class="fa-solid fa-triangle-exclamation"></i>
                No podrás volver a cambiar tu correo después de 30 días
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
import { deepCopy, swal, isEmail } from '@/store/meUtil'
import moment from 'moment'

export default {
    components: {
        modalBack,
        inputPassword
    },
    data: () => ({
        pestana:0,
        contrasena:'',
        correo:'',
        codigo:'',
        buttons: [
            {text:'Validar', spin:false, action:'validarContrasena', show:false, color:'1'},
            {text:'Validar correo', spin:false, action:'correoExiste', show:false, color:'1'},
            {text:'Validar codigo', spin:false, action:'verifyCodigo', show:false, color:'1'},
        ],

        useAuth:useAuth(),
        useModals:useModals(),

        moment,
    }),
    created(){
        if (moment().diff(moment(this.useAuth.usuario.lastUpdateCorreo), 'days') >= 30 || this.useAuth.usuario.lastUpdateCorreo==null) {
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
        async correoExiste(){
            if (this.correo == '') return

            if (isEmail(this.correo) == false) return swal('warning', 'Ingrese un correo válido')

            this.buttons[1].spin = true
            const result = await post(urls.signup+'/correo-existe', {correo:this.correo}, false)
            this.buttons[1].spin = false

            if (result.code != 0) return

            this.sendCodigo()
        },
        async sendCodigo(){
            this.buttons[1].spin = true
            const result = await post(urls.signup+'/send-codigo', {correo:this.correo}, false)
            this.buttons[1].spin = false

            if (result.code != 0) return
            
            this.pestana = 3
            this.buttons[1].show = false
            this.buttons[2].show = true
        },
        async verifyCodigo(){
            if (this.codigo.length < 6) return

            this.buttons[2].spin = true
            const data = await post(urls.signup+'/verify-codigo', {correo:this.correo, codigo:this.codigo}, 'Validación exitosa')
            this.buttons[2].spin = false

            if (data.code != 0) return

            this.modificarCorreo()
        },
        async modificarCorreo(){
            this.buttons[2].spin = true
            const result = await post(urls.usuarios+'/cambiar-correo', {correo:this.correo}, 'Correo actualizado con éxito')
            this.buttons[2].spin = false

            if (result.code != 0) return

            this.useAuth.usuario = deepCopy(result.data)
            this.useModals.cambiarCorreo.show = false
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