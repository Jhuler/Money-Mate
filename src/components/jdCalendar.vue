<template>
    <article class="jdCalendar">
        <div class="cabecera mrg-btm05">
            <div>
                <p v-if="modei==1">
                    {{ años[0].año }} - {{ años[años.length-1].año }}
                </p>

                <p v-if="modei==2" @click="modei=1">
                    {{ moment(año+'-'+mes+'-'+dia).format('YYYY') }}
                </p>

                <p v-if="modei==3 || modei==4 || modei==5" @click="modei=2">
                    {{ mostrarMesAño() }}
                </p>
            </div>

            <div class="arrows">
                <p @click="sumarRestar(1)">
                    <i class="fa-solid fa-chevron-up"></i>
                </p>
                <p @click="sumarRestar(2)">
                    <i class="fa-solid fa-chevron-down"></i>
                </p>
            </div>
        </div>

        <!-- {{ año }} - {{ mes }} - {{ dia }} -->

        <ul class="container-años"
            v-if="modei == 1"
        >
            <li v-for="(a,i) in años" :key="i"
                :class="{actual: año == a.año}"
                @click="año=a.año; modei=mode!=1?2:1"
            >
                {{ a.año }}
            </li>
        </ul>

        <ul class="container-meses" v-if="modei == 2">
            <li v-for="(a,i) in meses" :key="i"
                :class="{actual: mes == a.id}"
                @click="mes=a.id; setDias()"
            >
                {{ a.mes }}
            </li>
        </ul>

        <div class="container-dias"
            :class="{'container-dias-semanas':modei == 3}"
            v-if="modei == 3 || modei == 4 || modei == 5"
        >
            <div class="semana-numero" v-if="this.mode == 3">
                <ul>
                    <li>
                        <small>Sem</small>
                    </li>
                </ul>

                <ul class="numeros">
                    <li v-for="(a,i) in semanas" :key="i"
                        :class="{actual:semanaSel==a.semana}"
                        @click="selSemana(a)"
                    >
                        {{ a.semana }}
                    </li>
                </ul>
            </div>

            <div class="vista-mes">
                <ul class="dias-semana">
                    <li v-for="(a,i) of days" :key="i">
                        <small>{{ a }}</small>
                    </li>
                </ul>
    
                <ul class="dias-mes" :class="{'no-select-day':mode==3}">
                    <li v-for="(a,i) of dias" :key="i"
                        :class="{'fuera-month':a.fuera, 'today':a.hoy, actual:diaSel==a.date, 'semana-actual':semanaSel==a.semana, 'dia-periodo':a.dentroPeriodo}"
                        @click="selDia(a)"
                    >
                        {{ a.dia }}
                    </li>
                </ul>
            </div>
        </div>

        <div class="botones mrg-top1" v-if="confirmation">
            <button class="btn btn1" @click="sendFecha">
                Ok
            </button>
        </div>
    </article>    
</template>

<script>
import moment from 'moment'
import 'moment/locale/es'
moment.updateLocale('es', {
    week: {
        dow: 0,
    },
})

export default {
    components:{

    },
    emits:['sendFecha','dentroPeriodo'],
    props: {
        mode: {type:Number},
        añoi: {type:[Number,String], default:moment().format('YYYY')},
        mesi: {type:[Number,String], default:moment().format('MM')},
        diai: {type:[Number,String], default:moment().format('DD')},
        confirmation: {type:Boolean, default:false}
    },
    data: () => ({
        años:[],
        dias:[],
        meses: [
            {id:'01', mes:'Enero'},
            {id:'02', mes:'Febrero'},
            {id:'03', mes:'Marzo'},
            {id:'04', mes:'Abril'},
            {id:'05', mes:'Mayo'},
            {id:'06', mes:'Junio'},
            {id:'07', mes:'Julio'},
            {id:'08', mes:'Agosto'},
            {id:'09', mes:'Septiembre'},
            {id:'10', mes:'Octubre'},
            {id:'11', mes:'Noviembre'},
            {id:'12', mes:'Diciembre'}
        ],
        semanas:[],
        days:[
            'Dom',
            'Lun',
            'Mar',
            'Mie',
            'Jue',
            'Vie',
            'Sáb',
        ],

        año:null,
        mes:null,
        semana:null,
        semanaSel:null,
        dia:null,
        diaSel:null,
        modei:null,

        visibleAño:false,
        visibleMes:false,

        moment,
    }),
    created(){
        this.modei = this.mode
        this.año = this.añoi
        this.mes = this.mesi
        this.dia = this.diai

        this.setYears(moment().year())
        this.setDias()

        if (this.mode == 3) this.semanaSel = moment(this.año +'-'+ this.mes +'-'+this.dia).week()
        if (this.mode == 4 || this.mode == 5) this.diaSel = this.año +'-'+ this.mes +'-'+ this.dia
    },
    methods: {
        setYears(anio, key){
            let result

            if (key == undefined) {
                const multiplo10Menor = Math.floor(anio / 10) * 10
                result = multiplo10Menor === anio ? multiplo10Menor - 10 : multiplo10Menor
            }
            else {
                result = anio
            }

            this.años.length = 0

            for (let i = 0; i < 20; i++) {

                const año = result + i
                const biciesto = año % 4 === 0
                
                this.años.push({año, biciesto})
            }
        },
        setDias1(){
            // if (this.mode != 4 || this.mode != 3) return

            const dateMostrar = moment(this.año+'-'+this.mes)
            const startOfMonth = dateMostrar.clone().startOf('month').startOf('week')
            const endOfMonth = dateMostrar.clone().endOf('month').endOf('week')

            const weeks = []
            let week = []
            let day = startOfMonth.clone();

            while (day <= endOfMonth) {
                week.push(day.clone());
                day.add(1, 'day');

                if (week.length === 7) {
                weeks.push(week);
                week = [];
                }
            }

            console.log(weeks)
        },
        setDias(){
            if (this.mode == 1 || this.mode == 2) return

            this.modei = this.mode

            let dateMostrar = moment(this.año+'-'+this.mes)
            let dateStart = moment(dateMostrar).startOf('month')
            let dateEnd = moment(dateMostrar).endOf('month')
            
            this.dias.length = 0
            this.semanas.length = 0

            while (dateStart.day() !== 0) {
                dateStart.subtract(1, 'days')
            }

            while (dateEnd.day() !== 6) {
                dateEnd.add(1, 'days')
            }

            do {
                this.dias.push({
                    date: dateStart.format('YYYY-MM-DD'),
                    dia: dateStart.format('D'),
                    semana: dateStart.week(),
                    mes: dateStart.format('MM'),
                    año: dateStart.format('YYYY'),
                    fuera: dateStart.month() !== dateMostrar.month(),
                    hoy: dateStart.isSame(moment(), 'day'),
                })

                const i = this.semanas.findIndex(a => a.semana == dateStart.week())

                if (i === -1) {
                    this.semanas.push({
                        semana: dateStart.week(),
                    })
                }

                dateStart.add(1, 'days')
            }
            while (dateStart.isSameOrBefore(dateEnd))

            // if (this.mode == 5) {
            //     const a = this.dias.find(b => b.date == this.año +'-'+ this.mes +'-'+ this.dia)
            //     this.selDia(a)
            // }
        },
        sumarRestar(key){
            if (key == 1) {
                if (this.modei == 1) {
                    const primero = this.años[0].año - 20
                    this.setYears(primero, true)
                }

                if (this.modei == 2) {
                    this.año--
                }

                if (this.modei == 3 || this.modei == 4 || this.modei == 5) {
                    const newMes = moment(this.año+'-'+this.mes).subtract(1, 'months')
                    this.mes = newMes.format('MM')
                    this.año = newMes.format('YYYY')
                    this.setDias()
                }
            }

            if (key == 2) {
                if (this.modei == 1) {
                    const primero = this.años[0].año + 20
                    this.setYears(primero, true)
                }

                if (this.modei == 2) {
                    this.año++
                }

                if (this.modei == 3 || this.modei == 4 || this.modei == 5) {
                    const newMes = moment(this.año+'-'+this.mes).add(1, 'months')
                    this.mes = newMes.format('MM')
                    this.año = newMes.format('YYYY')
                    this.setDias()
                }
            }
        },
        selSemana(a){
            this.semanaSel = a.semana

            const startOfYear = moment().year(this.año).startOf('year');
  
            const startOfWeek = startOfYear.clone().week(this.semanaSel).startOf('week')

            this.mes = startOfWeek.format('MM')
            this.dia = startOfWeek.format('DD')
        },
        selDia(a){
            if (this.mode == 3) return

            this.diaSel = a.date
            this.dia = a.dia.toString().padStart(2, '0')

            if (this.mode == 5) this.$emit('dentroPeriodo')
        },
        mostrarMesAño(){
            const dato = moment(this.año+'-'+this.mes).format('MMMM [de] YYYY')

            return dato.charAt(0).toUpperCase() + dato.slice(1)
        },
        sendFecha(){
            this.$emit('sendFecha', this.año, this.mes, this.dia)
        },
        diaPeriodo(f1, f2){
            for (const a of this.dias) {
                a.dentroPeriodo = moment(moment(a.date)).isBetween(f1, f2, undefined, '()')
            }
        }
    },
}
</script>

<style lang="scss" scoped>
.jdCalendar{
    width: 20rem;

    ul{
        max-height: 15rem;
        overflow-y: auto;
        display: grid;
        gap: 0.2rem;

        li{
            padding: 0.5rem 0.8rem;
            border-radius: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;

            // &:hover{
            //     background-color: var(--bg-color-hover);
            // }
        }

        .actual{
            background-color: var(--primary-color);
            color: var(--text-color3) !important;
        }
    }
}

.cabecera{
    display: flex;
    justify-content: space-between;
    align-items: center;

    div{
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
    }

    p{
        display: flex;
        align-items: center;
        padding: 0.5rem;
        cursor: pointer;
        border-radius: 0.3rem;

        &:hover{
            background-color: var(--bg-color2);
        }
    }
}

.container-años{
    grid-template-columns: repeat(4, 1fr);
}

.container-meses{
    grid-template-columns: repeat(3, 1fr);
}

.container-dias-semanas{
    grid-template-columns: 2.5rem auto !important;
}

.container-dias{
    display: grid;
    // grid-template-columns: 2.5rem auto;
    gap: 0.5rem;
    
    li{
        padding: 0 !important;
        height: 2rem;
        width: 2rem;
    }

    .semana-numero{
        border-right: var(--border);

        .numeros{
            li{
                cursor: pointer;
            }
        }
    }

    .vista-mes{
        .dias-mes{
            li{
                cursor: pointer;
            }
    
            .fuera-month{
                color: var(--text-color2);
            }
        
            .today{
                border: var(--border);
                border-color: var(--primary-color);
            }
        
            .semana-actual{
                background-color: var(--bg-color2);
            }
        
            .no-select-day{
                user-select: none;
            }
        
            .dia-periodo{
                background-color: var(--bg-color2);
            }
        }
    
        .dias-semana, .dias-mes{
            grid-template-columns: repeat(7, 1fr);
        }
    }
}
</style>