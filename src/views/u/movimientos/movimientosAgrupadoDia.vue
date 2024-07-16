<template>
<ul class="container-gruped">
    <li v-for="(a, i) in datos" :key="i" class="gruped">
        <div class="top">
            <small>{{ moment(a.fecha.slice(0,10)).format('DD MMM dddd') }}</small>
        </div>
    
        <ul>
            <li v-for="b in a.datos" :key="b.id" @click="editar(b)">
                <div class="left">
                    <template v-if="b.tipo==3">
                        <p class="max-1line">{{ b.detalle }}</p>
                        
                        <p class="categoria"
                            style="background-color:var(--bg-color2)"
                        >
                            Transferencia
                        </p>
                    </template>

                    <template v-else-if="b.prestamo!=null">
                        <p class="max-1line">
                            {{ b.prestamo1.persona }}
                            <small class="max-1line">{{ b.detalle }}</small>
                        </p>
        
                        <p class="categoria"
                            style="background-color:var(--bg-color2)"
                        >
                            Préstamo
                        </p>
                    </template>
        
                    <template v-else>
                        <p class="max-1line">{{ b.detalle }}</p>
        
                        <p class="categoria"
                            :style="{'background-color':b.categoria1.color==''||b.categoria1.color==null?'var(--bg-color2)':b.categoria1.color}"
                        >
                            {{ b.categoria1.nombre }}
                        </p>
                    </template>
                </div>
            
                <div class="to-right">
                    <p>{{ formatoNum(b.tipo==1 || b.tipo==3 ? b.monto : b.monto*-1) }}</p>
                    
                    <template v-if="b.tipo==3">
                        <p class="max-1line">
                            <small>{{ b.cuenta1.nombre }}</small>
                            <i class="fa-solid fa-arrow-right-long"></i>
                            <small v-if="b.tipo==3">{{ b.cuentab1.nombre }}</small>
                        </p>
                    </template>

                    <template v-else>
                        <small>{{ b.cuenta1.nombre }}</small>
                    </template>
                </div>
            </li>
        </ul>
    </li>
</ul>
</template>

<script>
import { formatoNum } from '@/store/meUtil'

import moment from 'moment'

export default {
    props:{
        datos: Array,
    },
    emits: [
        'editar'
    ],
    data: () => ({
        formatoNum,
        moment,
    }),
    methods: {
        editar(a){
            this.$emit('editar', a)
        }
    },
}
</script>

<style lang="scss" scoped>
.gruped{
    ul{
        li{
            grid-template-columns: auto 8rem !important;
            .left{
                .categoria{
                    width: fit-content;
                    padding: 0.3rem 0.5rem;
                    border-radius: 0.7rem;
                    font-size: 0.8rem;
                }
            }

            .to-right{
                i{
                    font-size: 0.8rem;
                    margin: 0 0.3rem;
                }
            }
        }
    }
}
</style>