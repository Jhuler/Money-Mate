<template>
    <section>
        <div class="section-head">
            <h2>Dispositivos conectados</h2>
        </div>

        <div class="section-body">
            <loadingSpin position="initial" v-if="spin"/>

            <ul v-if="lista.length > 0">
                <li v-for="(a,i) in lista" :key="a.id">
                    <div class="icons">
                        <i class="fa-solid fa-tablet-screen-button"
                            v-if="a.deviceType == 'tablet'"
                            :class="{deviceActual:a.deviceActual}"
                        ></i>

                        <i class="fa-solid fa-mobile-screen-button"
                            v-if="a.deviceType == 'mobile'"
                            :class="{deviceActual:a.deviceActual}"
                        ></i>

                        <i class="fa-solid fa-desktop"
                            v-if="a.deviceType == 'desktop'"
                            :class="{deviceActual:a.deviceActual}"
                        ></i>
                    </div>

                    <div>
                        <p>
                            <strong>Fecha:</strong>
                            {{ moment(a.createdAt).format('DD MMMM YYYY') }}
                        </p>
                        <p>
                            <strong>Hora:</strong>
                            {{ moment(a.createdAt).format('HH:MM') }}
                        </p>
                        <p>
                            <strong>Navegador:</strong>
                            {{ a.device1.name }}
                        </p>
                        <p>
                            <strong>Sistema operativo:</strong>
                            {{ a.device1.os.family }} {{ a.device1.os.version }}
                        </p>
                    </div>

                    <div class="cerrar">
                        <small v-if="a.deviceActual">Dispositivo actual</small>

                        <jdButton text="Cerrar" :spin="a.spin" @click="cerrarSesion(a,i)" v-else/>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import jdButton from '@/components/jdButton.vue'
import loadingSpin from '@/components/loadingSpin.vue'

import { useAuth } from '@/store/auth'
import { get, post, urls } from '@/store/meCrud'

import { deepCopy, detectDevice } from '@/store/meUtil'

import moment from 'moment'
import 'moment/locale/es'
import platform from 'platform'

export default {
    components: {
        jdButton,
        loadingSpin
    },
    data: () => ({
        spin:false,
        lista:[],
        useAuth:useAuth(),
        
        detectDevice,
        platform,
        moment,
    }),
    created() {
        this.loadDevices()
    },
    methods: {
        async loadDevices(){
            this.spin = true
            const result = await get(urls.usuarios+'/dispositivos-conectados')

            if (result.code != 0) return this.spin = false

            this.detectDeviceDetails(result.data)
            this.spin = false
        },
        detectDeviceDetails(array) {
            for (const a of array) {
                const b = platform.parse(a.device)
                a.device1 = deepCopy(b)
                a.deviceType = detectDevice(a.device)
                a.deviceActual = navigator.userAgent==a.device
            }

            this.lista = deepCopy(array)
        },
        async cerrarSesion(a, i){
            a.spin = true
            const result = await post(urls.usuarios+'/logout', {token:a.token}, false)
            a.spin = false

            if (result.code != 0) return

            this.lista.splice(i, 1)
        }
    },
}
</script>

<style lang="scss" scoped>
.section-body{
    overflow-y: auto;

    ul{
        li{
            margin-bottom: 1.5rem;
            display: grid;
            grid-template-columns: 2rem auto 4.5rem;
            gap: 1rem;
            align-items: center;

            .icons{
                text-align: center;

                i{
                    font-size: 2rem;
                    color: var(--text-color2);
                }

                .deviceActual{
                    color: var(--primary-color) !important;
                }
            }

            .cerrar{
                text-align: center;
            }
        }
    }
}
</style>