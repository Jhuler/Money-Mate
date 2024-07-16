<template>
    <section>
        <div class="section-head">
            <div class="user-card" v-if="useAuth.local">
                <div class="left">
                    <i class="fa-solid fa-user"></i>
                </div>
                
                <div class="right" @click="goLink('signup')">
                    <strong>Iniciar sesión</strong>
                    <p>
                        <small>Sincroniza con todos tus dispositivos</small>
                    </p>
                </div>
            </div>

            <div class="user-card" v-else>
                <div class="left">
                    <img src="" v-if="useAuth.usuario.foto">
                    <i class="fa-solid fa-user" v-else></i>
                </div>

                <div class="right" v-if="useAuth.usuario.id">
                    <strong>{{ useAuth.usuario.nombres }} {{ useAuth.usuario.apellidos }}</strong>
                    <p>
                        <small>{{ useAuth.usuario.correo }}</small>
                    </p>
                </div>

                <loadingSpin position="initial" width="fit-content" v-else/>
            </div>
        </div>

        <div class="section-body">
            <!-- <div class="premium mrg-btm1">
                <i class="fa-solid fa-crown"></i>
                <strong>Miembro Premium</strong>
            </div> -->

            <div class="premium mrg-btm2" @click="instalar()" v-if="useAuth.showPwa">
                <i class="fa-regular fa-circle-down"></i>
                <strong>Instalar</strong>
            </div>

            <ul class="ajustes">
                <li @click="goLink('reportes')">Reporte de movimientos</li>
                <li @click="goLink('dispositivosConectados')">Dispositivos conectados</li>
                <li @click="openModal('cambiarContrasena', 'Cambiar contraseña')" v-if="useAuth.usuario.id">Cambiar contraseña</li>
                <li @click="openModal('cambiarCorreo', 'Cambiar correo')" v-if="useAuth.usuario.id">Cambiar correo</li>
                <li @click="openModal('personalInfo', 'Datos personales')">Actualizar datos personales</li>
                <li @click="eliminarCuenta()" v-if="useAuth.usuario.id">Eliminar cuenta</li>
                <li @click="logout()" v-if="useAuth.usuario.id">Cerrar sesión</li>
            </ul>

            <!-- <video id="videoPlayer" controls height="200px"></video> -->
        </div>

        <loadingSpin v-show="spin.show" :state="spin.state" :dark="true"/>
    </section>

    <cambiarContrasena v-if="useModals.cambiarContrasena.show"/>
    <cambiarCorreo v-if="useModals.cambiarCorreo.show"/>
    <personalInfo v-if="useModals.personalInfo.show"/>
</template>

<script>
import loadingSpin from '@/components/loadingSpin.vue'
import cambiarContrasena from './cambiarContrasena.vue'
import cambiarCorreo from './cambiarCorreo.vue'
import personalInfo from './personalInfo.vue'

import { useAuth } from '@/store/auth'
import { useModals } from '@/store/modals'
import { post, urls } from '@/store/meCrud'
import jalt from '@/utils/jalt'

// import dashjs from 'dashjs'

export default {
    components:{
        loadingSpin,
        cambiarContrasena,
        cambiarCorreo,
        personalInfo
    },
    data: () => ({
        spin:{show:false},

        useAuth:useAuth(),
        useModals:useModals(),
    }),
    mounted(){
        // this.reproducir()
    },
    methods: {
        // reproducir(){
        //     const url = 'https://dash.akamaized.net/dash264/TestCasesUHD/2b/11/MultiRate.mpd'
        //     const videoPlayer = dashjs.MediaPlayer().create();
        //     videoPlayer.initialize(document.querySelector('#videoPlayer'), url, true);
        // },
        goLink(uri){
            this.$router.push({name:uri})
        },
        async logout(){
            this.spin = {show:true, state:'Cerrando sesión'}
            const result = await post(urls.usuarios+'/logout', {token:this.useAuth.token}, false)
            this.spin.show = false

            if (result.code != 0) return

            await this.useAuth.logout()
            this.$router.replace({name:'signin'})
        },
        async eliminarCuenta(){
            jalt.qst('¿Estas seguro?', 'Esto no es reversible').then( async (a) => {
                if (a.isConfirmed) {
                    this.spin = {show:true, state:'Eliminando cuenta'}
                    const result = await post(urls.usuarios+'/eliminar-cuenta', this.useAuth.usuario, 'Cuenta eliminada con éxito')
                    this.spin.show = false

                    if (result.code != 0) return

                    this.logout()
                }
            })
        },
        openModal(modal, title){
            this.useModals.setModal(modal, title, true)
        },
        instalar(){
            this.useAuth.installPwa.prompt()
            this.useAuth.installPwa.userChoice.then( choice => {
                this.useAuth.showPwa = false

                if (choice.outcome === 'accepted') {
                // Do something additional if the user chose to install
                } else {
                // Do something additional if the user declined
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.user-card{
    display: grid;
    grid-template-columns: max-content auto;
    gap: 1rem;
    align-items: center;
    .left{
        height: 3.5rem;
        width: 3.5rem;
        background-color: var(--bg-color2);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        i{
            font-size: 2rem;
        }

        img{
            width: 100%;
            height: 100%;
        }
    }
}

.premium{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background-color: var(--primary-color);
    border-radius: 0.3rem;
    cursor: pointer;

    *{
        color: var(--text-color3);
    }
}

.ajustes{
    border-top: var(--border);

    li{
        padding: 1rem 0;
        border-bottom: var(--border);
        cursor: pointer;
    }
}

.section-body{
    overflow-y: auto;
}
</style>