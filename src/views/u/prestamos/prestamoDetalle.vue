<template>
    <section>
        <div class="section-head">
            <div class="top">
                <img src="@/assets/img/logo1.png" alt="">
            </div>

            <div class="container-prestamo" v-if="useData.prestamo.id">
                <p class="mrg-btm05">
                    <small v-if="useData.prestamo.tipo==1">Prestado de:</small>
                    <small v-else>Prestado a:</small>
                    {{ useData.prestamo.persona }}
                </p>
                
                <p>
                    <small>Motivo:</small>
                    {{ useData.prestamo.motivo }}
                </p>

                <!-- <div class="botones">
                    <button class="btn1" @click="editar()">
                        <i class="fa-solid fa-pen-to-square"></i>
                        Editar
                    </button>
                </div> -->
            </div>
        </div>

        <div class="section-body">
            <loadingSpin v-if="spin" position="initial"/>

            <prestamoDetalleMovimientos ref="detalleMovimientos" v-if="useData.prestamo.id"/>
        </div>
    </section>

    <prestamosAgregar v-if="useModals.prestamo.show"/>
</template>

<script>
import loadingSpin from '@/components/loadingSpin.vue'
import prestamoDetalleMovimientos from './prestamoDetalleMovimientos.vue'
import prestamosAgregar from './prestamosAgregar.vue'

import { useData } from '@/store/data'
import { useModals } from '@/store/modals'
import { get, urls } from '@/store/meCrud'
import { formatoNum } from '@/store/meUtil'

export default {
    components:{
        loadingSpin,
        prestamoDetalleMovimientos,
        prestamosAgregar,
    },
    data: () => ({
        lista:[],
        valor:0,
        spin:false,

        useData:useData(),
        useModals:useModals(),
        formatoNum,
    }),
    async created(){
        this.useData.prestamo = {}
        await this.loadPrestamo()
    },
    methods: {
        async loadPrestamo(){
            this.spin = true
            const result = await get(urls.prestamos+`?id=${this.$route.params.id}`)
            this.spin = false

            if (result.code != 0 || result.data == null) {
                this.$router.replace({name:'prestamos'})
                return
            }

            this.useData.prestamo = result.data
        },
        // editar(){
        //     this.useModals.setModal('prestamo', 'Editar', true, 2)
        // }
    }
}
</script>

<style lang="scss" scoped>
.section-body{
    overflow-y: auto;
}
</style>