<template>
    <!-- useAuth.usuario.id -->
    <div class="user-view" v-if="useAuth.usuario.id">
        <router-view/>

        <navBar/>
    </div>

    <div class="consola-loading">
        <img src="@/assets/img/logo11.png" alt="">
        <!-- <loadingSpin state="Comprobando sesión ..."/> -->
    </div>
</template>

<script>
import navBar from './navBar.vue'
// import loadingSpin from '@/components/loadingSpin.vue'

import { useAuth } from '@/store/auth.js'
import { useData } from '@/store/data'
import meIdxDb from '@/db/meIdxDb'

export default {
    components: {
        navBar,
        // loadingSpin,
    },
    data: () => ({
        useAuth:useAuth(),
        useData:useData(),
    }),
    created() {
        this.isLogged()
    },
    methods: {
        async isLogged(){
            if (this.useAuth.local) {
                await meIdxDb.conn()
            }
            else {
                const auth = await this.useAuth.verify()
                if (!auth) this.$router.replace({name:'signin'})
            }

        }
    },
}
</script>

<style lang="scss">
.user-view{
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: grid;
    grid-template-rows: auto max-content;

    section{
        // max-height: calc(100vh - 4rem);
        // overflow-y: auto;
        height: 100%;
        display: grid;
        grid-template-rows: max-content auto;
        overflow-y: hidden;
    }

    .section-head{
        box-shadow: var(--box-shadow-modal);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background-color: var(--bg-color);
        // position: sticky;
        // top: 0;
        // z-index: 1;

        .top{
            display: flex;
            justify-content: space-between;
            align-items: center;

            img{
                height: 1.2rem;
            }
        }
    }

    .fechas{
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.2rem 0.5rem;
    }
    
    .section-body{
        padding: 1rem 1.5rem;
        // margin: 1rem 0;
    }

    .gruped{
        margin-bottom: 1.5rem;

        .top{
            display: flex;
            justify-content: space-between;
            border-bottom: var(--border);
            padding-bottom: 0.5rem;
            margin-bottom: 0.7rem;
        }

        ul{
            li{
                margin-bottom: 1rem;
                display: grid;
                align-items: center;

                .left{
                    overflow: hidden;
                }
            }
        }
    }
    
    .to-right{
        text-align: right;
    }
}

.consola-loading{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: var(--color3);

    img{
        width: 8rem;
        animation: pulse 1s infinite;
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.7;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
}
</style>