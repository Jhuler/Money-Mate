<template>
    <div class="detalle">
        <div class="label-input">
            <i class="fa-regular fa-calendar-days"></i>
            <input type="date" class="input1" placeholder="Introduce una nota ..." v-model="useData.movimiento.fecha">

            <i class="fa-regular fa-credit-card"></i>
            <div style="display:flex">
                <select class="input1" v-model="useData.movimiento.cuenta" v-if="useData.cuentas.length > 0">
                    <option v-for="a in useData.cuentas" :key="a.id" :value="a.id">{{ a.nombre }}</option>
                </select>
                <button @click="reload()" v-if="!useData.cuentasLd"><i class="fa-solid fa-rotate-right"></i></button>
                <loadingSpin position="initial" width="fit-content" scale="0.5" v-if="useData.cuentasLd"/>
            </div>

            <i class="fa-regular fa-credit-card" v-if="useData.movimiento.tipo==3"></i>
            <select class="input1" v-model="useData.movimiento.cuentab" v-if="useData.movimiento.tipo==3">
                <option v-for="a in useData.cuentas" :key="a.id" :value="a.id">{{ a.nombre }}</option>
            </select>

            <i class="fa-solid fa-note-sticky"></i>
            <input type="text" class="input1" placeholder="Introduce una nota ..." v-model="useData.movimiento.detalle">
        </div>

        <div class="monto">
            <strong>{{ formatoNum(useData.movimiento.monto) }}</strong>
            <small> {{ txtCalculo }} </small>
        </div>

        <ul>
            <li v-for="(a,i) in teclas" :key="i" @click="ejecutar(a.action, a.label)">
                <template v-if="a.class">
                    <i :class="a.class"></i>
                </template>

                <template v-else>
                    {{ a.label }}
                </template>
            </li>
        </ul>
    </div>
</template>

<script>
import loadingSpin from '@/components/loadingSpin.vue'

import { useData } from '@/store/data.js'
import { formatoNum } from '@/store/meUtil'

export default {
    components: {
        loadingSpin
    },
    data: () => ({
        txtCalculo:'',
        teclas:[
            {label:7, action:'addNumber'},
            {label:8, action:'addNumber'},
            {label:9, action:'addNumber'},
            {label:'÷', action:'addOperador', class:'fa-solid fa-divide'},
            {label:4, action:'addNumber'},
            {label:5, action:'addNumber'},
            {label:6, action:'addNumber'},
            {label:'x', action:'addOperador', class:'fa-solid fa-xmark'},
            {label:1, action:'addNumber'},
            {label:2, action:'addNumber'},
            {label:3, action:'addNumber'},
            {label:'-', action:'addOperador', class:'fa-solid fa-minus'},
            {label:'.', action:'addNumber'},
            {label:0, action:'addNumber'},
            {label:'del', action:'borrar', class:'fa-solid fa-delete-left'},
            {label:'+', action:'addOperador', class:'fa-solid fa-plus'},
        ],

        useData:useData(),

        formatoNum,
    }),
    created(){
        this.loadCuentas()
    },
    methods:{
        async loadCuentas(){
            if (!this.useData.cuentasLd) return
            
            await this.useData.loadData('cuentas', 'cuentas', 'cuentasLd')
        },
        reload(){
            this.useData.cuentas.length = 0
            this.useData.cuentasLd = true
            this.loadCuentas()
        },
        addOperador(key){
            if (this.txtCalculo == '') return

            let last = this.txtCalculo.charAt(this.txtCalculo.length - 1)

            if (last == '+' || last == '-' || last == 'x' || last == '÷') {
                this.txtCalculo = this.txtCalculo.slice(0,-1)
            }

            this.txtCalculo += key
        },
        addNumber(key){
            if (key == '.' && this.txtCalculo.includes('.')) return

            this.txtCalculo += key

            this.calcular(this.txtCalculo)
        },
        borrar(){
            this.txtCalculo = this.txtCalculo.slice(0,-1)

            if (this.txtCalculo == '') return this.useData.movimiento.monto = 0

            let last = this.txtCalculo.charAt(this.txtCalculo.length - 1)

            if (last == '+' || last == '-' || last == 'x' || last == '÷') {
                this.calcular(this.txtCalculo.slice(0,-1))
            }
            else {
                this.calcular(this.txtCalculo)
            }
        },
        calcular(expresion){
            try {
                const num = eval(expresion.replace('x','*').replace('÷','/'))
                this.useData.movimiento.monto = parseFloat(num.toFixed(2))
            }
            catch (error) {
                console.log(error)    
            }
        },
        ejecutar(action, key){
            this[action](key)
        }
    }
}
</script>

<style lang="scss" scoped>
.detalle{
    background-color: var(--bg-color2);
    padding: 0.5rem;

    .label-input{
        display: grid;
        grid-template-columns: 1rem auto;
        gap: 0.5rem;
        align-items: center;
    }

    input, select{
        border: initial;
    }

    .monto{
        height: 3rem;
        display: flex;
        flex-direction: column;
        margin: 1rem;
        text-align: right;

        strong{
            font-size: 2rem;
        }

        small{
            font-size: 0.9rem;
        }
    }

    ul{
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.3rem;

        li{
            background-color: var(--bg-color);
            padding: 0.5rem;
            text-align: center;
        }
    }
}
</style>