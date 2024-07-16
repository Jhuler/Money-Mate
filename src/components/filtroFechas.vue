<template>
    <div class="filtro-fechas">
        <ul class="container-options">
            <li v-for="(a,i) in options" :key="i"
                :class="{actual:a.value == send.option}"
                @click="selectOption(a.value)"
            >
                {{ a.label }}
            </li>
        </ul>

        <div class="container-fechaMostrar"
            :class="{'no-select':loading || send.option==5}"
        >
            <i class="fa-solid fa-chevron-left"
                @click="sumarRestarFecha(1)"
                v-if="!loading && send.option!=5"
            ></i>

            <p @click="openCalendar()">{{ fechaMostrar }}</p>

            <i class="fa-solid fa-chevron-right"
                @click="sumarRestarFecha(2)"
                v-if="!loading && send.option!=5"
            ></i>
        </div>
    </div>

    <modalBack
        modal="filtroFechas"
        v-if="useModals.filtroFechas.show"
    >
        <!-- <div style="display:flex; gap:2rem; flex-wrap:wrap;"> -->
        <div>
            <jdCalendar
                :mode="send.option"
                :añoi="send.f1.split('-')[0]"
                :mesi="send.f1.split('-')[1]"
                :diai="send.f1.split('-')[2]"

                @dentroPeriodo="dentroPeriodo"
                ref="calendar1"
                class="mrg-btm1"
            />
    
            <jdCalendar
                :mode="send.option"
                :añoi="send.f2.split('-')[0]"
                :mesi="send.f2.split('-')[1]"
                :diai="send.f2.split('-')[2]"
   
                @dentroPeriodo="dentroPeriodo"
                ref="calendar2"
                v-if="send.option == 5"
            />
        </div>

        <div class="botones mrg-top1">
            <button class="btn btn1" @click="deCalendario">
                Ok
            </button>
        </div>
    </modalBack>
</template>

<script>
import modalBack from '@/layouts/modalBack.vue'
import jdCalendar from './jdCalendar.vue'
import { useModals } from '@/store/modals'
import { useData } from '@/store/data'

import moment from 'moment'
import 'moment/locale/es'
import { swal } from '@/store/meUtil'

moment.updateLocale('es', {
    week: {
        dow: 0,
    },
})

export default {
    components:{
        modalBack,
        jdCalendar
    },
    emits:['change-fecha'],
    props: {
        pestana: String,
        loading: Boolean,
    },
    data: () => ({
        options:[
            {label:'Día', value:4},
            {label:'Semana', value:3},
            {label:'Mes', value:2},
            {label:'Año', value:1},
            {label:'Periodo', value:5},
        ],
        fechaMostrar:'',
        send:{option:null},

        useModals:useModals(),
        useData:useData(),
    }),
    created(){
        if (localStorage.getItem(`${this.pestana}-fechas`) == null) {
            this.selectOption(4)
        }
        else {
            this.send = JSON.parse(localStorage.getItem(`${this.pestana}-fechas`))
            this.formatoFecha()

            this.changeFecha()
        }
    },
    methods: {
        selectOption(a){
            if (a == this.send.option) return

            this.send.option = a

            const date = moment()

            if (this.send.option == 4) {
                this.send.f1 = moment(date).format('YYYY-MM-DD')
                this.send.f2 = this.send.f1
            }

            if (this.send.option == 3) {
                this.send.f1 = moment(date).startOf('week').format('YYYY-MM-DD'),
                this.send.f2 = moment(date).endOf('week').format('YYYY-MM-DD')
            }

            if (this.send.option == 2) {
                this.send.f1 = moment(date).startOf('month').format('YYYY-MM-DD'),
                this.send.f2 = moment(date).endOf('month').format('YYYY-MM-DD')
            }

            if (this.send.option == 1) {
                this.send.f1 = moment(date).startOf('year').format('YYYY-MM-DD'),
                this.send.f2 = moment(date).endOf('year').format('YYYY-MM-DD')
            }

            if (this.send.option == 5) {
                this.fechaMostrar = 'Seleccione un periodo'
                this.openCalendar()
            }
            else {
                this.formatoFecha()
                this.changeFecha()
            }
        },
        sumarRestarFecha(key){
            if (key == 1) {
                if (this.send.option == 4) {
                    this.send.f1 = moment(this.send.f1).subtract(1, 'days').format('YYYY-MM-DD')
                    this.send.f2 = this.send.f1
                }

                if (this.send.option == 3) {
                    this.send.f1 = moment(this.send.f1).subtract(1, 'weeks').format('YYYY-MM-DD'),
                    this.send.f2 = moment(this.send.f2).subtract(1, 'weeks').format('YYYY-MM-DD')
                }

                if (this.send.option == 2) {
                    this.send.f1 = moment(this.send.f1).subtract(1, 'months').format('YYYY-MM-DD')
                    this.send.f2 = moment(this.send.f1).endOf('month').format('YYYY-MM-DD')
                }

                if (this.send.option == 1) {
                    this.send.f1 = moment(this.send.f1).subtract(1, 'years').format('YYYY-MM-DD')
                    this.send.f2 = moment(this.send.f1).endOf('year').format('YYYY-MM-DD')
                }
            }

            if (key == 2) {
                if (this.send.option == 4) {
                    this.send.f1 = moment(this.send.f1).add(1, 'days').format('YYYY-MM-DD')
                    this.send.f2 = this.send.f1
                }

                if (this.send.option == 3) {
                    this.send.f1 = moment(this.send.f1).add(1, 'weeks').format('YYYY-MM-DD'),
                    this.send.f2 = moment(this.send.f2).add(1, 'weeks').format('YYYY-MM-DD')
                }

                if (this.send.option == 2) {
                    this.send.f1 = moment(this.send.f1).add(1, 'months').format('YYYY-MM-DD')
                    this.send.f2 = moment(this.send.f1).endOf('month').format('YYYY-MM-DD')
                }

                if (this.send.option == 1) {
                    this.send.f1 = moment(this.send.f1).add(1, 'years').format('YYYY-MM-DD')
                    this.send.f2 = moment(this.send.f1).endOf('year').format('YYYY-MM-DD')
                }
            }

            this.formatoFecha()
            this.changeFecha()
        },
        formatoFecha(){
            if (this.send.option == 1) {
                this.fechaMostrar = moment(this.send.f1).format('YYYY')
            }

            if (this.send.option == 2) {
                const txt = moment(this.send.f1).format('MMMM [de] YYYY')
                this.fechaMostrar = txt.charAt(0).toUpperCase() + txt.slice(1)
            }

            if (this.send.option == 3) {
                if (moment(this.send.f1).year() === moment(this.send.f2).year()) {
                    this.fechaMostrar = moment(this.send.f1).format('DD MMM') + ' - ' + moment(this.send.f2).format('DD MMM, yyyy')
                }
                else {
                    this.fechaMostrar = moment(this.send.f1).format('DD MMM YYYY') + ' - ' + moment(this.send.f2).format('DD MMM YYYY')
                }
            }

            if (this.send.option == 4) {
                if (moment().isSame(this.send.f1, 'day')) {
                    this.fechaMostrar = 'Hoy, ' + moment(this.send.f1).format('D [de] MMMM')
                }
                else if (moment().subtract(1, 'days').isSame(this.send.f1, 'day')) {
                    this.fechaMostrar = 'Ayer, ' + moment(this.send.f1).format('D [de] MMMM')
                }
                else {
                    this.fechaMostrar = moment(this.send.f1).format('D [de] MMMM')
                }
            }

            if (this.send.option == 5) {
                this.fechaMostrar = 'Desde ' + moment(this.send.f1).format('DD MMM YYYY') + ' hasta ' + moment(this.send.f2).format('DD MMM YYYY')
            }

            localStorage.setItem(this.pestana+'-fechas', JSON.stringify(this.send))
        },
        openCalendar(){
            let title = ''

            if (this.send.option == 1) {
                title = 'Seleccione el año'
            }

            if (this.send.option == 2) {
                title = 'Seleccione el mes'
            }

            if (this.send.option == 3) {
                title = 'Seleccione la semana'
            }

            if (this.send.option == 4) {
                title = 'Seleccione el día'
            }

            if (this.send.option == 5) {
                title = 'Seleccione el periodo'
            }

            this.useModals.setModal('filtroFechas', title, true)
        },
        deCalendario(){
            const partesF1 = this.send.f1.split("-")
            const partesF2 = this.send.f2.split("-")

            const año = this.$refs.calendar1.año
            const mes = this.$refs.calendar1.mes
            const dia = this.$refs.calendar1.dia

            if (this.send.option == 1) {
                partesF1[0] = año
                partesF2[0] = año
            }

            if (this.send.option == 2) {
                partesF1[0] = año
                partesF1[1] = mes
                
                partesF2[0] = año
                partesF2[1] = mes
                partesF2[2] = moment(partesF1.join("-")).endOf('month').format('DD')
            }

            if (this.send.option == 3) {
                partesF1[0] = año
                partesF1[1] = mes
                partesF1[2] = dia
                
                partesF2[0] = moment(partesF1.join("-")).endOf('week').format('YYYY')
                partesF2[1] = moment(partesF1.join("-")).endOf('week').format('MM')
                partesF2[2] = moment(partesF1.join("-")).endOf('week').format('DD')
            }

            if (this.send.option == 4) {
                partesF1[0] = año
                partesF1[1] = mes
                partesF1[2] = dia
                
                partesF2[0] = año
                partesF2[1] = mes
                partesF2[2] = dia
            }

            if (this.send.option == 5) {
                const año2 = this.$refs.calendar2.año
                const mes2 = this.$refs.calendar2.mes
                const dia2 = this.$refs.calendar2.dia

                partesF1[0] = año
                partesF1[1] = mes
                partesF1[2] = dia
                
                partesF2[0] = año2
                partesF2[1] = mes2
                partesF2[2] = dia2

                if (moment(partesF1.join("-")).isBefore(moment(partesF2.join("-"))) == false) {
                    swal('warning', 'La primera fecha debe ser menor a la segunda')
                    return
                }
            }

            this.send.f1 = partesF1.join("-")
            this.send.f2 = partesF2.join("-")

            this.formatoFecha()
            this.changeFecha()
            
            this.useModals.filtroFechas.show = false
        },
        dentroPeriodo(){
            const diaSel1 = moment(this.$refs.calendar1.diaSel)
            const diaSel2 = moment(this.$refs.calendar2.diaSel)

            this.$refs.calendar1.diaPeriodo(diaSel1, diaSel2)
            this.$refs.calendar2.diaPeriodo(diaSel1, diaSel2)
        },
        changeFecha(){
            this.$emit('change-fecha')
        }
    },
}
</script>

<style lang="scss" scoped>
.container-options{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    li{
        padding: 0.3rem 0;
        cursor: pointer;
    }

    .actual{
        color: var(--primary-color);
        border-bottom: solid 0.1rem var(--primary-color);
    }
}

.container-fechaMostrar{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;

    p, i{
        cursor: pointer;
    }

    p{
        text-decoration: underline;
    }
}
.no-select{
    justify-content: center;
}
</style>