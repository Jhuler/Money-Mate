<template>
<main class="signup">
    <section class="form-signup mrg-top1">
        <div class="card">
            <img src="@/assets/img/logo4.png">

            <div v-if="pestana == 1">
                <div class="mrg-btm2">
                    <strong>Creación de cuenta</strong>
                    
                    <p>
                        <small class="mrg-btm2">Registrate para tener un excelente control de tus ingresos y egresos.</small>
                    </p>
                </div>
    
                <div class="datos">
                    <input type="text" placeholder="Nombres" v-model="useData.usuario.nombres" class="mrg-btm05 input1">
                    <input type="text" placeholder="Apellidos" v-model="useData.usuario.apellidos" class="mrg-btm05 input1">
                    <input type="email" placeholder="Correo" v-model="useData.usuario.correo" class="mrg-btm05 input1">
    
                    <inputPassword placeholder="Contraseña" v-model="useData.usuario.contrasena" class="mrg-btm05"/>
                    <inputPassword placeholder="Contraseña" v-model="useData.usuario.contrasena1"/>
                </div>
                
                <div class="actions">
                    <jdButton color="1" text="Registrarte" :spin="spin1" @click="goto2()" style="width:100%"/>
                </div>
            </div>

            <div v-if="pestana == 2">
                <div class="info mrg-btm2">
                    <strong>Código de confirmación</strong>
        
                    <p>Ingresa el código de confirmación que enviamos a {{useData.usuario.correo}}</p>
                </div>
    
                <input type="text" maxlength="6" v-model="useData.usuario.confirmacion" class="input1">
    
                <div class="actions">
                    <jdButton
                        color="1" text="Confirmar" :spin="spin2" @click="verifyCodigo()"
                        :disabled="useData.usuario.confirmacion.length < 6"
                        style="width:100%"
                    />
        
                    <jdButton text="Volver" @click="goto1()" style="width:100%"/>
                </div>
            </div>

            <div v-if="pestana==3">
                <loadingSpin :state="spinState3" v-if="spinState3 != ''"/>
            </div>
        </div>

        <div class="card" v-if="pestana != 3">
            <small>
                ¿Tienes una cuenta?
                <router-link :to="{name:'signin'}">Inicia sesión</router-link>
            </small>
        </div>
    </section>
</main>
</template>

<script>
import inputPassword from '@/components/inputPassword.vue'
import jdButton from '@/components/jdButton.vue'
import loadingSpin from '@/components/loadingSpin.vue'

import { useAuth } from '@/store/auth'
import { useData } from '@/store/data'
import { urls, post } from '@/store/meCrud'
import { deepCopy, incompleteData, swal, isEmail } from '@/store/meUtil'
import meIdxDb from '@/db/meIdxDb'

import dataCuentas from '@/data/cuentas.json'
import dataCategorias from '@/data/categorias.json'

import cuentas from '@/db/cuentas'
import categorias from '@/db/categorias'
import movimientos from '@/db/movimientos'
import prestamos from '@/db/prestamos'

export default {
    components: {
        inputPassword,
        jdButton,
        loadingSpin,
    },
    data: () => ({
        pestana: 1,
        spin1: false,
        spin2: false,
        spinState3: '',

        useAuth:useAuth(),
        useData:useData(),
    }),
    created() {
        this.useAuth.logout()

        this.useData.initUsuario()
    },
    methods: {
        async goto2(){
            if (this.spin1 == true) return

            this.useAuth.signUp = true

            const item = deepCopy(this.useData.usuario)
            let llenos = ['nombres','apellidos','correo','contrasena']

            if (incompleteData(item, llenos)) {
                swal('warning', 'Llene los datos necesarios')
                return
            }

            if (isEmail(item.correo) == false) {
                swal('warning', 'Ingrese un correo válido')
                return
            }

            if (this.useData.usuario.contrasena != this.useData.usuario.contrasena1) return swal('warning','Las contraseñas no coinciden')

            const existe = await this.correoExiste()
            if (existe.code != 0) return

            const envio = await this.sendCodigo()
            if (envio.code != 0) return

            this.pestana = 2
        },
        async correoExiste(){
            this.spin1 = true
            const result = await post(urls.signup+'/correo-existe', {correo:this.useData.usuario.correo}, false)
            this.spin1 = false

            return result
        },
        async sendCodigo(){
            this.spin1 = true
            const result = await post(urls.signup+'/send-codigo', {correo:this.useData.usuario.correo}, false)
            this.spin1 = false

            return result
        },
        async verifyCodigo(){
            if (this.spin2 == true) return

            if (this.useData.usuario.confirmacion.length < 6) return

            this.spin2 = true
            const data = await post(urls.signup + '/verify-codigo', {correo:this.useData.usuario.correo, codigo:this.useData.usuario.confirmacion}, 'Verificación exitosa')
            this.spin2 = false

            if (data.code != 0) return

            this.pestana = 3
            this.crearUsuario()
        },
        async crearUsuario(){
            this.spinState3 = 'Creando usuario'

            this.useData.usuario.usuario = this.useData.usuario.correo
            const result = await post(urls.signup + '/crear-usuario', this.useData.usuario, false)

            if (result.code != 0) {
                swal('error', 'No se pudo crear el usuario')
                this.goto1()
                return
            }

            this.useAuth.usuario = deepCopy(result.data)

            this.syncData()
        },
        async syncData(){
            const tablas = {
                cuentas: [],
                categorias: [],
                movimientos: [],
                prestamos: [],
            }

            if (this.useAuth.local) {
                this.spinState3 = 'Sincronizando datos a la nube'

                await meIdxDb.conn()

                tablas.cuentas = (await cuentas.get()).data
                tablas.categorias = (await categorias.get()).data
                tablas.movimientos = (await movimientos.find()).data
                tablas.prestamos = (await prestamos.get()).data

                for (const a of tablas.cuentas) {
                    a.id2 = a.id
                    a.id = this.useAuth.usuario.id + a.id
                }

                for (const a of tablas.categorias) {
                    a.id2 = a.id
                    a.id = this.useAuth.usuario.id + a.id
                }

                for (const a of tablas.prestamos) {
                    a.id2 = a.id
                    a.id = this.useAuth.usuario.id + a.id
                }

                for (const a of tablas.movimientos) {
                    a.id = this.useAuth.usuario.id + a.id

                    a.cuenta = a.cuenta == null ? null : (tablas.cuentas.find(b => b.id2 == a.cuenta)).id
                    a.cuentab = a.cuentab == null ? null : (tablas.cuentas.find(b => b.id2 == a.cuentab)).id
                    a.categoria = a.categoria == null ? null : (tablas.categorias.find(b => b.id2 == a.categoria)).id
                    a.prestamo = a.prestamo == null ? null : (tablas.prestamos.find(b => b.id2 == a.prestamo)).id
                }
            }
            else {
                this.spinState3 = 'Creando otros datos necesarios'
                
                tablas.cuentas = dataCuentas
                tablas.categorias = dataCategorias
            }

            for (const a of tablas.cuentas) a.createdBy = this.useAuth.usuario.id
            for (const a of tablas.categorias) a.createdBy = this.useAuth.usuario.id
            for (const a of tablas.movimientos) a.createdBy = this.useAuth.usuario.id
            for (const a of tablas.prestamos) a.createdBy = this.useAuth.usuario.id

            const result = await post(urls.signup + '/add-datos', tablas, false)

            if (result.code != 0) return swal('error', 'No se pudo sincronizar los datos')

            this.signIn()
        },
        async signIn(){
            this.useAuth.local = false
            this.useAuth.signUp = true

            this.spinState3 = 'Iniciando sesión'

            const auth = {
                correo: this.useData.usuario.correo,
                contrasena: this.useData.usuario.contrasena,
            }

            const data = await post(urls.signin, auth, 'Acceso correcto')

            if (data.code != 0) return

            this.useAuth.token = data.token
            this.$router.replace({name:'user'})
        },
        goto1(){
            this.useData.usuario.contrasena = ''
            this.useData.usuario.confirmacion = ''
            this.pestana = 1
        }
    },
}
</script>

<style lang="scss" scoped>
.signup {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--bg-color);
    overflow-y: auto;

    .form-signup{
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

        .datos{
            display: flex;
            flex-direction: column;
        }
    }
}

@media (min-width: 600px) {
    .signup{
        .card{
            border: var(--border);
            margin-bottom: 1rem;
        }
    }
}
</style>