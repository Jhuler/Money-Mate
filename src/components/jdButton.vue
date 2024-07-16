<template>
    <div class="jd-button">
        <div
            class="btn"
            :class="{btn1:color=='1', btn2:color=='2', 'btn-disabled':disabled}"
        >
            <p :class="{'hide-text': spin}">
                <slot></slot>
                {{ text }}
            </p>
        </div>
        <loadingSpin :color="color" scale="0.5" v-if="spin"/>
    </div>
</template>

<script>
import loadingSpin from '@/components/loadingSpin.vue'

export default {
    components: {
        loadingSpin
    },
    props:{
        color: {type:String, default:'2'},
        text: String,
        spin: {type:Boolean, default:false},
        disabled: {type:Boolean, default:false}
    },
    data: () => ({
        show:false
    }),
    methods: {
    },
}
</script>

<style lang="scss" scoped>
.jd-button{
    position: relative;
    overflow: hidden;
    width: fit-content;

    .hide-text{
        opacity: 0;
    }
}
</style>