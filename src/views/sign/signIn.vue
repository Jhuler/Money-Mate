<template>
<main class="signin">
    <section class="form-signin">
        <div class="card mrg-top1">
            <img src="@/assets/img/logo4.png">

            <!-- <div>
                <strong>Iniciar sesión</strong>
            </div> -->

            <input type="email" placeholder="Correo electrónico" required v-model="usuario" class="mrg-btm1 input1">

            <inputPassword placeholder="Contraseña" v-model="contrasena" class="mrg-btm1"/>

            <p>
                <router-link :to="{name:'recoverPassword'}">¿Haz olvidado tu contraseña?</router-link>
            </p>

            <jdButton color="1" text="INGRESAR" @click="signin()" :spin="spinBtnSignIn"/>
        </div>

        <div class="card">
            <small>
                ¿No tienes una cuenta?
                <router-link :to="{name:'signup'}">Registrate</router-link>
            </small>

            <jdButton text="Continuar sin cuenta" @click="sinCuenta()" class="mrg-top2"/>

            <jdButton color="1" text="Instalar" @click="instalar()" class="mrg-top2" v-if="useAuth.showPwa">
                <i class="fa-regular fa-circle-down"></i>
            </jdButton>
        </div>
    </section>
</main>
</template>
  
<script>
import inputPassword from '@/components/inputPassword.vue'
import jdButton from '@/components/jdButton.vue'

import { useAuth } from '@/store/auth'
import { urls, post } from '@/store/meCrud'
import { swal } from '@/store/meUtil'
import meIdxDb from '@/db/meIdxDb'

import cuentas from '@/data/cuentas.json'
import categorias from '@/data/categorias.json'

export default {
    components: {
        inputPassword,
        jdButton
    },
    data: () => ({
        spinBtnSignIn:false,
        useAuth:useAuth(),

        usuario: '', contrasena: '', token: '',
        shown: false,
    }),
    created() {
        if (this.useAuth.token != '') {
            this.$router.replace({name:'user'})
        }

        const remember = localStorage.getItem('user_remember')
        remember ? this.usuario = remember : ''
    },
    methods: {
        async signin() {
            if (this.spinBtnSignIn) return

            this.useAuth.local = false
            this.useAuth.signUp = true
            
            if (this.usuario == '' || this.contrasena == '') {
                return swal('warning', 'Ingrese correo y contraseña')
            }

            const auth = {
                correo: this.usuario,
                contrasena: this.contrasena,
            }

            this.spinBtnSignIn = true
            const data = await post(urls.signin, auth, 'Acceso correcto')
            this.spinBtnSignIn = false

            if (data.code != 0) return

            localStorage.setItem('user_remember', this.usuario)
            this.useAuth.token = data.token

            this.$router.replace({name:'user'})
        },

        async sinCuenta(){
            this.useAuth.local = true

            if (this.useAuth.dbInit == false) {
                this.useAuth.dbInit = true

                await meIdxDb.conn()

                meIdxDb.createMany(this.useAuth.db, 'cuentas', cuentas)
                meIdxDb.createMany(this.useAuth.db, 'categorias', categorias)
            }

            this.$router.push({name:'user'})
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

<style lang="scss">
.signin {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--bg-color);
    overflow-y: auto;

    .form-signin{
        .card {
            padding: 1.5rem 2rem;
            border-radius: 0.5rem;
            text-align: center;

            img{
                width: 6rem;
                // height: 5rem;
                margin-bottom: 2rem;
            }

            input[type=email], input[type=text], input[type=password] {
                width: 100%;
                padding: 1rem;
            }

            >p{
                font-size: 0.8rem;
                text-align: right;
                margin-bottom: 1.5rem;
            }

            a{
                color: var(--primary-color);
            }

            .jd-button{
                width: 100%;

                .btn{
                    width: 100% !important;
                    padding: 1rem 0.5rem;
                }
            }
        }
    }
}

@media (min-width: 600px) {
    .signin{
        .card{
            border: var(--border);
            margin-bottom: 1rem;
        }
    }
}
</style>