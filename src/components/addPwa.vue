<template>
    <modalBack>
        <p class="mrg-btm1">Agregar <strong>My finances</strong> a la pantalla de inicio?</p>
    
        <div class="botones">
            <button class="btn btn2" @click="answer(false)">No, gracias</button>
            <button class="btn btn1" @click="answer(true)">Instalar</button>
        </div>
    </modalBack>
</template>

<script>
import modalBack from '@/layouts/modalBack.vue'

export default {
    components:{
        modalBack,
    },
    methods: {
        answer(key){
            this.$emit('pwa-response', key)
        },
    }
}
</script>