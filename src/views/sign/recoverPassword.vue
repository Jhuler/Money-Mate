<template>
<main class="recoverPassword">
    <section class="form-recover mrg-top1">
        <div class="card">
            <img src="@/assets/img/logo4.png">

            <div v-if="pestana == 1">
                <div class="mrg-btm2">
                    <strong>Recuperación de la cuenta</strong>
    
                    <p>
                        <small class="mrg-btm2">Ingresa tu correo para continuar.</small>
                    </p>
                </div>
    
                <input type="email" placeholder="Correo" v-model="correo" class="mrg-btm05 input1">
                
                <div class="actions">
                    <jdButton color="1" text="Recuperar" :spin="spin1" @click="goto2()" style="width:100%"/>
                </div>
            </div>

            <div v-if="pestana == 2">
                <div class="mrg-btm2">
                    <strong>Código de confirmación</strong>
        
                    <p>
                        <small>Ingresa el código de confirmación que enviamos a {{correo}}</small>
                    </p>
                </div>
    
                <input type="text" maxlength="6" v-model="confirmacion" class="input1">
    
                <div class="actions">
                    <jdButton
                        color="1" text="Confirmar" :spin="spin2" @click="verifyCodigo()"
                        :disabled="confirmacion.length < 6"
                        style="width:100%"
                    />
        
                    <jdButton text="Volver" @click="goto1()" style="width:100%"/>
                </div>
            </div>
    
            <div v-if="pestana==3">
                <div class="mrg-btm2">
                    <strong>Actualización de contraseña</strong>
        
                    <p>
                        <small>Rellena ambos campos</small>
                    </p>
                </div>
    
                <div>
                    <inputPassword placeholder="Contraseña" v-model="contrasena1" class="mrg-btm05"/>
                    <inputPassword placeholder="Validar contraseña" v-model="contrasena2"/>
                </div>
    
                <div class="actions">
                    <jdButton
                        color="1" text="Confirmar" :spin="spin3" @click="cambiarContrasena()"
                        :disabled="contrasena1 == '' || contrasena2 == ''"
                        style="width:100%"
                    />
                </div>
            </div>
    
            <div v-if="pestana==4">
                <div class="mrg-btm2">
                    <strong>Actualización exitosa</strong>
        
                    <p>
                        <small>Tu contraseña ha sido reestablecida</small>
                    </p>
                </div>
    
                <jdButton
                    color="1" text="Regresar a inicio de sesión" :spin="spin3" @click="gotoInicio()"
                    style="width:100%"
                />
            </div>
        </div>

        <div class="card" v-if="pestana != 4">
            <small>
                ¿Ya recuperaste tu contraseña?
                <router-link :to="{name:'signin'}">Inicia sesión</router-link>
            </small>
        </div>
    </section>
</main>
</template>

<script>
import jdButton from '@/components/jdButton.vue'
import inputPassword from '@/components/inputPassword.vue'

import { post, urls } from '@/store/meCrud'
import { isEmail, swal } from '@/store/meUtil'

export default {
    components: {
        jdButton,
        inputPassword
    },
    data: () => ({
        pestana:1,
        correo:'',
        confirmacion:'',
        contrasena1:'',
        contrasena2:'',
        spin1:false,
        spin2:false,
        spin3:false,
    }),
    methods: {
        async goto2(){
            if (this.spin1 == true) return
            
            if (this.correo == '' || isEmail(this.correo) == false) return swal('warning', 'Ingrese un correo válido')

            this.spin1 = true
            const data = await post(urls.signup+'/send-codigo', {correo:this.correo}, false)
            this.spin1 = false

            if (data.code != 0) return

            this.pestana = 2
        },
        async verifyCodigo(){
            if (this.spin2 == true) return

            if (this.confirmacion.length < 6) return

            this.spin2 = true
            const data = await post(urls.signup + '/verify-codigo', {correo:this.correo, codigo:this.confirmacion}, 'Verificación exitosa')
            this.spin2 = false

            if (data.code != 0) return

            this.pestana = 3
        },
        goto1(){
            this.correo = ''
            this.confirmacion = ''
            this.pestana = 1
        },
        async cambiarContrasena(){
            if (this.spin3 == true) return

            if (this.contrasena1 == '' || this.contrasena2 == '') return swal('warning', 'Ingrese ambos campos')
            if (this.contrasena1 != this.contrasena2) return swal('warning', 'Las contraseñas no coinciden')
            if (this.correo == '') return this.pestana = 1

            this.spin3 = true
            const data = await post(urls.signup + '/cambiar-contrasena', {correo:this.correo, contrasena:this.contrasena1}, false)
            this.spin3 = false

            if (data.code != 0) return

            this.pestana = 4
        },
        gotoInicio(){
            this.$router.replace({name:'signin'})
        }
    },
}
</script>

<style lang="scss" scoped>
.recoverPassword{
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--bg-color);
    overflow-y: auto;

    section{
        .card {
            padding: 1.5rem 2rem;
            border-radius: 0.5rem;
            text-align: center;

            img{
                width: 6rem;
                margin-bottom: 2rem;
            }

            button {
                width: 100%;
            }

            .actions{
                margin-top: 2rem;
                display: flex;
                flex-direction: column;
                gap: 0.2rem;
            }

            a{
                color: var(--primary-color);
            }
        }
    }
}

@media (min-width: 600px) {
    .recoverPassword{
        .card{
            border: var(--border);
            margin-bottom: 1rem;
        }
    }
}
</style>