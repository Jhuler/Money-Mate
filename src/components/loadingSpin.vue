<template>
    <div class="spinner-back"
        :style="{
            width,
            position,
            height:position=='absolute'?'100%':'fit-content',
        }"

        :class="{'dark-back':dark}"
    >
        <div class="spinner" :style="{transform:'scale('+scale+')'}">
            <div class="bounce1" :class="{'bounce-color':color=='1'}"></div>
            <div class="bounce2" :class="{'bounce-color':color=='1'}"></div>
            <div class="bounce3" :class="{'bounce-color':color=='1'}"></div>
        </div>
    
        <div class="state" v-if="state != ''">
            {{state}}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        width: {type:String, default:'100%'},
        position: {type:String, default:'absolute'},
        scale: {type:String, default:'1'},
        color: {type:String, default:'2'},
        state: {type:String, default:''},
        dark: {type:Boolean, default:false},
    },
}
</script>

<style lang="scss" scoped>
.spinner-back{
    top: 0;
    left: 0;
    // width: 100%;
    // height: 100%;
    overflow: hidden;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    gap: 1rem;
    z-index: 1;
  
    .spinner {
        // text-align: center;
  
        >div {
            width: 1rem;
            height: 1rem;
            background-color: var(--primary-color);
            border-radius: 100%;
            display: inline-block;
            animation: loading-bounce 1s infinite ease-in-out both;
        }
  
        .bounce1 {
            animation-delay: -0.32s;
        }
    
        .bounce2 {
            animation-delay: -0.16s;
        }
    
        @keyframes loading-bounce {
            0%, 80%, 100% {
            transform: scale(0);
            }
            40% {
            transform: scale(1);
            }
        }
  
        .bounce-color{
            background-color: var(--secondary-color) !important;
        }
    }
  
    .state{
        padding: 0.2rem 1rem;
        border-radius: 0.3rem;
        // background-color: var(--bg-color);
    }
}

.dark-back{
    background-color: rgba($color: #000000, $alpha: 0.5);
    backdrop-filter: blur(0.25rem);
}
</style>