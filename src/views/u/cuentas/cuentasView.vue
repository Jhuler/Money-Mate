<template>
    <section v-if="$route.name == 'cuentas'">
        <div class="section-head">
            <div class="top">
                <img src="@/assets/img/logo1.png" alt="">
            </div>

            <filtroFechas
                pestana="cuentas"
                :loading="useData.resumenCuentasLd"
                @change-fecha="changeFecha"
            />
        </div>

        <div class="section-body">
            <loadingSpin v-if="useData.resumenCuentasLd" position="initial"/>
    
            <small v-if="!useData.resumenCuentasLd && lista.length == 0">No se encuentran registros</small>

            <ul v-if="lista.length > 0">
                <li v-for="(a, i) in lista" :key="i" class="gruped">
                    <div class="top">
                        <strong>{{ setMonedaNombre(a.moneda) }}</strong>
                        <strong>{{ formatoNum(a.total) }}</strong>
                    </div>
    
                    <ul>
                        <li v-for="b in a.cuentas" :key="b.id">
                            <div class="nombre-edit">
                                <div>
                                    <button class="btn3" @click="editar(b)">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>

                                    <button class="btn4" @click="ver(b)">
                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    </button>
                                </div>
                                <p class="max-1line">{{ b.nombre }}</p>
                            </div>

                            <p class="to-right">{{ formatoNum(b.valor) }}</p>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </section>
    
    <router-view v-else/>
    
    <buttonAdd @click="nuevo()" v-if="$route.name == 'cuentas'"/>
    <cuentasAgregar v-if="useModals.cuenta.show" @ordenar="actualizar"/>
</template>

<script>
import filtroFechas from '@/components/filtroFechas.vue'
import loadingSpin from '@/components/loadingSpin.vue'
import cuentasAgregar from './cuentasAgregar.vue'
import buttonAdd from '@/components/buttonAdd.vue'

import { useAuth } from '@/store/auth.js'
import { useData } from '@/store/data'
import { useModals } from '@/store/modals'

import { deepCopy, formatoNum, ordenarArray } from '@/store/meUtil'

import currency from '@/data/currency.json'

import moment from 'moment'

export default {
    components:{
        filtroFechas,
        loadingSpin,
        cuentasAgregar,
        buttonAdd,
    },
    data: () => ({
        lista:[],

        useAuth:useAuth(),
        useData:useData(),
        useModals:useModals(),

        formatoNum,
        moment,
    }),
    methods: {
        async changeFecha(){
            this.lista.length = 0
            this.useData.resumenCuentas.length = 0
            this.useData.resumenCuentasLd = true

            await this.loadCuentas()
            this.agruparPorCuenta()
        },
        async loadCuentas(){
            if (!this.useData.resumenCuentasLd) return

            const fechas = JSON.parse(localStorage.getItem('cuentas-fechas'))
            
            await this.useData.loadData('cuentas', 'resumenCuentas', 'resumenCuentasLd', `?f1=${fechas.f1}&f2=${fechas.f2}`)
        },
        agruparPorCuenta(){
            for (const a of this.useData.resumenCuentas) {
                a.valor = 0

                for (const b of a.movements) {
                    if (b.tipo == 1) {
                        a.valor += b.monto
                    }
                    else if (b.tipo == 2) {
                        a.valor += b.monto*-1
                    }
                }
            }

            for (const a of this.useData.resumenCuentas) {
                for (const b of a.movements) {
                    if (b.tipo == 3) {
                        a.valor -= b.monto
                        
                        const i = this.useData.resumenCuentas.find(c => c.id == b.cuentab)
                        i.valor += b.monto
                    }
                }
            }

            this.agruparPorMoneda()
        },
        agruparPorMoneda(){
            this.lista.length = 0

            for (const a of this.useData.resumenCuentas) {
                const i = this.lista.findIndex(b => b.moneda == a.moneda)

                if (i === -1) {
                    this.lista.push({
                        moneda: a.moneda,
                        total: a.valor,
                        cuentas: [{...a}]
                    })
                }
                else {
                    this.lista[i].total += a.valor
                    this.lista[i].cuentas.push({...a})
                }
            }
        },
        nuevo(){
            this.useData.initCuenta()
            this.useModals.setModal('cuenta','Agregar',true,1)
        },
        ver(a){
            this.$router.push({name:'cuentaDetalle', params:{id:a.id}})
        },
        editar(a){
            this.useData.cuenta = deepCopy(a)
            this.useModals.setModal('cuenta','Editar',true,2)
        },
        actualizar(key, item){
            if (key == 1) {
                this.useData.resumenCuentas.push(item)
            }
            else {
                const i = this.useData.resumenCuentas.findIndex(a => a.id == item.id)
                const movs = deepCopy(this.useData.resumenCuentas[i].movements)
                item.movements = deepCopy(movs)
    
                if (key == 2) this.useData.resumenCuentas.splice(i, 1, item)
                if (key == 3) this.useData.resumenCuentas.splice(i, 1)
            }

            ordenarArray(this.useData.resumenCuentas)
            this.agruparPorCuenta()
        },

        setMonedaNombre(a){
            return currency[a].name
        }
    },
}
</script>

<style lang="scss" scoped>
.section-body{
    overflow-y: auto;
}

.gruped{
    li{
        grid-template-columns: auto 5rem;
        margin-bottom: 0.7rem !important;

        .nombre-edit{
            display: grid;
            grid-template-columns: 0 auto;
            align-items: center;
            transition: all 0.3s ease;
        
            div{
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

                div{
                    transform: translateX(0);
                }
            }
        }
    }
}

</style>