<template>
    <article class="modal-back">
        <div class="modal-main">
            <div class="head" v-if="modal">
                <h2>{{ useModals[modal].title }}</h2>

                <div class="botones">
                    <button class="btn btn2" @click="useModals[modal].show = false">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
            <slot></slot>

            <div class="foot" v-if="buttons && buttons.length">
                <div class="botones">
                    <jdButton
                        v-for="(a, i) in buttons" :key="i"
                        :text="a.text"
                        :spin="a.spin"
                        @click="footButtonsClick(a.spin, a.action)"
                        :color="a.color"
                        v-show="a.show"
                    />
                </div>
            </div>
        </div>
    </article>
</template>

<script>
import jdButton from '@/components/jdButton.vue'

import { useModals } from '@/store/modals'

export default {
    components: {
        jdButton
    },
    props: {
        modal: String,
        buttons: Array,
    },
    data: () => ({
        useModals:useModals()
    }),
    methods: {
        footButtonsClick(spin, action){
            if (spin) return
            
            this.$emit('jdmodal-buttons-click', action)
        }
    },
}
</script>

<style lang="scss" scoped>
.modal-back{
    background-color: rgba($color: #000000, $alpha: 0.5);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    // align-items: center;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 2;

    .modal-main{
        margin: 1rem 0;
        padding: 1rem;
        border-radius: 0.3rem;
        background-color: var(--bg-color);
        max-width: 95%;
        height: fit-content;

        .head{
            border-bottom: var(--border);
            padding-bottom: 1rem;
            margin-bottom: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
        }

        .foot{
            border-top: var(--border);
            padding-top: 1rem;
            margin-top: 1rem;
        }
    }
}
</style>