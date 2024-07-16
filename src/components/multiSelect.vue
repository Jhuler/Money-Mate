<template>
    <modalBack
        modal="multiSelect"
        :buttons="buttons"
        @jdmodal-buttons-click="actions"
    >
        <input type="search" class="input1 mrg-btm1" v-model="txtbuscar" @input="filtrar()" placeholder="Buscar ...">

        <formCheckBox text="Seleccionar todo" v-model="todo" class="mrg-btm05" @change="changeTodo()"/>

        <ul class="container-lista">
            <li v-for="(a, i) in lista" :key="i" class="mrg-btm05">
                <formCheckBox :text="a[prop2]" v-model="a.selected" @change="changeUno()"/>
            </li>
        </ul>
    </modalBack>
</template>

<script>
import modalBack from '@/layouts/modalBack.vue'
import formCheckBox from '@/components/formCheckBox.vue'

import { useModals } from '@/store/modals.js'

export default {
    components: {
        modalBack,
        formCheckBox,
    },
    props: {
        data: Array,
        prop1: {type:String, default:'id'},
        prop2: {type:String, default:'nombre'},
    },
    data: () => ({
        txtbuscar: '',
        lista: [],
        todo: false,

        buttons:[
            {text:'Listo', spin:false, action:'agregar', show:true, color:'1'},
        ],

        useModals:useModals(),
    }),
    created() {
        this.filtrar()
    },
    methods: {
        filtrar() {
            this.lista = this.data.filter(a => a[this.prop2].toLowerCase().includes(this.txtbuscar.toLowerCase()))

            this.changeUno()
        },
        changeTodo(){
            if (this.todo) {
                for (const a of this.lista) {
                    a.selected = true
                }
            } else {
                for (const a of this.lista) {
                    a.selected = false
                }
            }
        },
        changeUno(){
            for (const a of this.lista) {
                if (a.selected) {
                    this.todo = true
                }
                else {
                    this.todo = false
                    return
                }
            }
        },
        agregar(){
            this.$emit('agregar', this.lista)
            this.useModals.multiSelect.show = false
        },
        actions(action){
            this[action]()
        },
    },
}
</script>

<style lang="scss" scoped>
.container-lista{
    max-height: 15rem;
    overflow-y: auto;
}
</style>