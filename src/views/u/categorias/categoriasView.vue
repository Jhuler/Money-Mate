<template>
    <section v-if="$route.name == 'categorias'">
        <div class="section-head">
            <div class="top">
                <img src="@/assets/img/logo1.png" alt="">
            </div>

            <filtroFechas
                pestana="categorias"
                :loading="useData.resumenCategoriasLd"
                @change-fecha="changeFecha"
            />
        </div>

        <div class="section-body">
            <loadingSpin v-if="useData.resumenCategoriasLd" position="initial"/>
    
            <small v-if="!useData.resumenCategoriasLd && lista.length == 0">No se encuentran registros</small>
            
            <ul v-if="lista.length > 0">
                <li v-for="(a, i) in lista" :key="i" class="gruped">
                    <div class="top">
                        <strong>{{ a.tiponombre }}</strong>
                        <strong>{{ formatoNum(a.total) }}</strong>
                    </div>

                    <ul>
                        <li v-for="b in a.categorias" :key="b.id">
                            <div class="nombre-edit">
                                <div class="uno">
                                    <button class="btn3" @click="editar(b)">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>

                                    <button class="btn4" @click="ver(b)">
                                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                    </button>
                                </div>
                                
                                <div>
                                    <p class="max-1line">{{ b.nombre }}</p>
                                    <p class="bar" :style="{width:`${b.valor != 0 ? formatoNum((b.valor/a.total)*100) : 0}%`}"></p>
                                </div>
                            </div>

                            <div class="to-right">
                                <p>{{ formatoNum(b.valor) }}</p>
                                <p><small>{{ b.valor != 0 ? formatoNum((b.valor/a.total)*100) : 0}}%</small></p>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </section>
    
    <router-view v-else/>
    
    <buttonAdd @click="nuevo()" v-if="$route.name == 'categorias'"/>
    <categoriasAgregar v-if="useModals.categoria.show" @ordenar="actualizar"/>
</template>

<script>
import filtroFechas from '@/components/filtroFechas.vue'
import loadingSpin from '@/components/loadingSpin.vue'
import categoriasAgregar from './categoriasAgregar.vue'
import buttonAdd from '@/components/buttonAdd.vue'

import { useAuth } from '@/store/auth.js'
import { useData } from '@/store/data'
import { useModals } from '@/store/modals'

import { formatoNum, ordenarArray, deepCopy } from '@/store/meUtil'

import moment from 'moment'

export default {
    components:{
        filtroFechas,
        loadingSpin,
        categoriasAgregar,
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
            this.useData.resumenCategorias.length = 0
            this.useData.resumenCategoriasLd = true

            await this.loadCategorias()
            this.agruparPorTipo()
        },
        async loadCategorias(){
            if (!this.useData.resumenCategoriasLd) return

            const fechas = JSON.parse(localStorage.getItem('categorias-fechas'))
            
            await this.useData.loadData('categorias', 'resumenCategorias', 'resumenCategoriasLd', `?f1=${fechas.f1}&f2=${fechas.f2}`)
        },
        calcValor(movs){
            let valor = 0

            for (const b of movs) valor += b.monto

            return valor
        },
        agruparPorTipo(){
            this.lista.length = 0

            for (const a of this.useData.resumenCategorias) {
                a.valor = this.calcValor(a.movements)

                const i = this.lista.findIndex(b => b.tipo == a.tipo)

                if (i === -1) {
                    this.lista.push({
                        tipo: a.tipo,
                        tiponombre: this.useData.tipos.find(b => b.id == a.tipo).nombre,
                        total: a.valor,
                        categorias: [{...a}]
                    })
                }
                else {
                    this.lista[i].total += a.valor
                    this.lista[i].categorias.push({...a})
                }
            }
        },
        nuevo(){
            this.useData.initCategoria()
            this.useModals.setModal('categoria','Agregar',true,1)
        },
        ver(a){
            this.$router.push({name:'categoriaDetalle', params:{id:a.id}})
        },
        editar(a){
            this.useData.categoria = deepCopy(a)
            this.useModals.setModal('categoria','Editar',true,2)
        },
        actualizar(key, item){
            if (key == 1) {
                this.useData.resumenCategorias.push(item)
            }
            else {
                const i = this.useData.resumenCategorias.findIndex(a => a.id == item.id)
                const movs = deepCopy(this.useData.resumenCategorias[i].movements)
                item.movements = deepCopy(movs)
    
                if (key == 2) this.useData.resumenCategorias.splice(i, 1, item)
                if (key == 3) this.useData.resumenCategorias.splice(i, 1)
            }

            ordenarArray(this.useData.resumenCategorias)
            this.agruparPorTipo()
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
        
            .bar{
                margin-top: 0.5rem;
                height: 0.5rem;
                background-color: var(--primary-color);
                border-radius: 0.25rem;
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