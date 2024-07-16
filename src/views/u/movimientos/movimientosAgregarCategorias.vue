<template>
    <ul>
        <loadingSpin v-if="useData.categoriasLd" position="initial" style="grid-column:1/5"/>

        <li v-for="a in lista" :key="a.id"
            @click="this.useData.movimiento.categoria = a.id"
            :class="{'categoria-activa':useData.movimiento.categoria == a.id}"
            v-show="useData.categorias.length > 0"
        >
            <img :src="a.icon">
            <small class="max-2lines"> {{ a.nombre }} </small>
        </li>

        <li>
            <jdButton @click="reload()" v-if="!useData.categoriasLd">
                <i class="fa-solid fa-rotate-right"></i>
            </jdButton>
        </li>
    </ul>
</template>

<script>
import loadingSpin from '@/components/loadingSpin.vue'
import jdButton from '@/components/jdButton.vue'

import { useData } from '@/store/data.js'
import { ordenarArray } from '@/store/meUtil'

export default {
    components:{
        loadingSpin,
        jdButton,
    },
    data: () => ({
        lista:[],

        useData:useData(),
    }),
    async created(){
        await this.loadCategorias()
        this.filtrar()
    },
    methods: {
        async loadCategorias(){
            if (!this.useData.categoriasLd) return

            await this.useData.loadData('categorias', 'categorias', 'categoriasLd')
        },
        filtrar(){
            this.lista = this.useData.categorias.filter(a => a.tipo == this.useData.movimiento.tipo)
            
            ordenarArray(this.lista)
        },
        async reload(){
            this.useData.categorias.length = 0
            this.lista.length = 0
            this.useData.categoriasLd = true
            await this.loadCategorias()
            this.filtrar()
        }
    },
}
</script>

<style lang="scss" scoped>
ul{
    width: 100%;
    // padding: 0.5rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: max-content;
    // gap: 0.5rem;
    height: 13rem;
    overflow-x: hidden;
    overflow-y: auto;
    margin-bottom: 1rem;
    // max-width: 24rem;

    li{
        overflow: hidden;
        text-align: center;
        width: 100%;
        padding: 0.5rem;
        border-radius: 0.3rem;

        img{
            width: 2.5rem;
            height: 2.5rem;
            background-color: var(--bg-color2);
            border-radius: 50%;
            margin-bottom: 0.3rem;
        }
    }

    .categoria-activa{
        background-color: var(--bg-color2);

        *{
            color: var(--primary-color);
        }
    }
}
</style>