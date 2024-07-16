<template>
    <section class="prestamos" v-if="$route.name == 'prestamos'">
        <div class="section-head">
            <div class="top">
                <img src="@/assets/img/logo1.png" alt="">

                <jdButton
                    @click="reload()"
                    v-if="!useData.prestamosLd"
                >
                    <i class="fa-solid fa-rotate-right"></i>
                </jdButton>
            </div>

            <div class="filtros">
                <select class="input1" v-model="estado" @change="filtrar()">
                    <option :value="false">Pendientes</option>
                    <option :value="true">Cerrados</option>
                </select>
            </div>
        </div>

        <div class="section-body">
            <loadingSpin v-if="useData.prestamosLd" position="initial"/>

            <small v-if="!useData.prestamosLd && lista.length == 0">No se encuentran registros</small>

            <ul v-if="lista.length > 0" class="container-lista">
                <li v-for="a in lista" :key="a.i">
                    <div class="nombre-edit">
                        <div class="uno">
                            <button class="btn3" @click="editar(a)">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>

                            <button class="btn4" @click="ver(a)">
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </button>
                        </div>
                        <div>
                            <p>{{ a.persona }}</p>
                            <p><small>{{ a.motivo }}</small></p>
                        </div>
                    </div>

                    <div class="to-right">
                        <p>{{ formatoNum(a.valor) }}</p>
                        <p><small>{{ formatoNum(a.saldo) }}</small></p>
                    </div>
                </li>
            </ul>
        </div>
    </section>

    <router-view v-else/>

    <buttonAdd @click="nuevo()" v-if="$route.name == 'prestamos'"/>
    <prestamosAgregar v-if="useModals.prestamo.show"/>
</template>

<script>
import jdButton from '@/components/jdButton.vue'
import loadingSpin from '@/components/loadingSpin.vue'
import buttonAdd from '@/components/buttonAdd.vue'
import prestamosAgregar from './prestamosAgregar.vue'

import { useAuth } from '@/store/auth.js'
import { useData } from '@/store/data.js'
import { useModals } from '@/store/modals.js'
import { formatoNum, deepCopy } from '@/store/meUtil'

import moment from 'moment'
import 'moment/locale/es'

export default {
    components: {
        jdButton,
        loadingSpin,
        buttonAdd,
        prestamosAgregar,
    },
    data: () => ({
        lista:[],
        estado:null,

        useAuth:useAuth(),
        useData:useData(),
        useModals:useModals(),

        formatoNum,
        moment,
    }),
    async created() {
        this.initFiltros()
        await this.loadPrestamos()
        this.agrupar()
    },
    methods: {
        initFiltros(){
            const filtros = localStorage.getItem('prestamos-estado')

            if (filtros) {
                this.estado = filtros == 'true' ? true : false 
            }
            else {
                this.estado = false
            }
        },
        async reload(){
            this.lista.length = 0
            this.useData.prestamos.length = 0
            this.useData.prestamosLd = true
            
            await this.loadPrestamos()
            this.agrupar()
        },
        async loadPrestamos(){
            if (!this.useData.prestamosLd) return
            // this.useData.prestamosLd = true
            
            await this.useData.loadData('prestamos', 'prestamos', 'prestamosLd')
        },
        agrupar(){
            for (const a of this.useData.prestamos) {
                a.valor = 0
                a.pago = 0

                a.pedidos = []
                a.pagos = []

                for (const b of a.movements) {
                    if (a.tipo == 1) {
                        if (b.tipo == 1) {
                            a.valor += b.monto
                            a.pedidos.push({...b})
                        }
                        else {
                            a.pago += b.monto
                            a.pagos.push({...b})
                        }
                    }
                    else {
                        if (b.tipo == 2) {
                            a.valor += b.monto
                            a.pedidos.push({...b})
                        }
                        else {
                            a.pago += b.monto
                            a.pagos.push({...b})
                        }
                    }
                }

                a.estado = a.valor <= a.pago ? true : false
                a.saldo = a.valor - a.pago
            }

            this.filtrar()
        },
        filtrar(){
            localStorage.setItem('prestamos-estado', this.estado)

            this.lista = this.useData.prestamos.filter(a => a.estado == this.estado)
        },
        nuevo(){
            this.useData.initPrestamo()
            this.useData.initMovimiento()
            this.useModals.setModal('prestamo', 'Agregar', true, 1)
        },
        ver(a){
            this.$router.push({name:'prestamoDetalle', params:{id:a.id}})
        },
        editar(a){
            this.useData.prestamo = deepCopy(a)
            this.useModals.setModal('prestamo', 'Editar', true, 2)
        },
        // actualizar(key, item){
        //     if (key == 1) {
        //         this.useData.prestamos.push(item)
        //     }
        //     else {
        //         const i = this.useData.prestamos.findIndex(a => a.id == item.id)
    
        //         if (key == 2) this.useData.prestamos.splice(i, 1, item)
        //         if (key == 3) this.useData.prestamos.splice(i, 1)
        //     }

        //     this.agrupar()
        // }
    }
}
</script>

<style lang="scss" scoped>
.section-head{
    .filtros{
        display: flex;
        gap: 1rem;
    }
}
.section-body{
    overflow-y: auto;
}

.container-lista{
    li{
        margin-bottom: 1rem;
        display: grid;
        grid-template-columns: auto 5rem;

        .nombre-edit{
            display: grid;
            grid-template-columns: 0 auto;
            align-items: center;
            transition: all 0.3s ease;
        
            .uno{
                display: flex;
                gap: 0.3rem;
                margin-right: 0.5rem;
        
                transform: translateX(-7rem);
                transform-origin: left;
                transition: all 0.3s ease;
            }
        }

        &:hover{
            .nombre-edit{
                grid-template-columns: max-content auto;

                .uno{
                    transform: translateX(0);
                }
            }
        }
    }
}
</style>