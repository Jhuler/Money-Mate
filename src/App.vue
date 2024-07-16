<template>
    <!-- <addPwa @pwa-response="handlePwa" v-if="showPwa"/> -->

    <router-view/>
</template>

<script>
import { useAuth } from './store/auth'

// import addPwa from './components/addPwa.vue'

export default {
    components: {
        // addPwa,
    },
    data: () => ({
        // showPwa: false,

        useAuth:useAuth(),
    }),
    created() {
        
    },
    beforeMount() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            this.useAuth.installPwa = e
            this.useAuth.showPwa = true
        })
    },
    methods: {
        // handlePwa(key){
        //     if (!key) return this.showPwa = false
            
        //     this.installEvent.prompt()
        //     this.installEvent.userChoice.then( choice => {
        //         this.showPwa = false

        //         if (choice.outcome === 'accepted') {
        //         // Do something additional if the user chose to install
        //         } else {
        //         // Do something additional if the user declined
        //         }
        //     })
        // }
    },
}
</script>

<style lang="scss">
:root{
    --primary-color: #f1c72e;
    --secondary-color: #ffffff;
    --color3: #011657;
    --color4: #ff7547;

    --bg-color: #ffffff;
    --bg-color-hover: whitesmoke;
    --bg-color-selected: #e5feee;

    --bg-color2: whitesmoke;
    --bg-color2-hover: rgb(237, 237, 237);
    --bg-color2-selected: #e5feee;

    --bg-color-disabled: #d1d0d0;

    --text-color: black;
    --text-color-disabled: whitesmoke;

    --text-color2: #828282;
    --text-color3: #ffffff;

    //--btn1-color: #011657;
    --btn1-hover-color: #dfb930;

    --btn2-color: #EBEDF0;
    --btn2-hover-color: #d9dadc;

    --border: solid 0.06rem #dfdfdf;
    --border-dashed: dashed 0.06rem #CCCCCC;
    
    --selected: rgb(225, 225, 225);
    
    --shadow-color: #d1d0d0;
    --box-shadow-modal: 0 0 0.5rem 0.1rem var(--shadow-color);
    --box-shadow-section: 0 0.15rem 0.2rem var(--shadow-color);

    // INPUT
    --input-bg-color: #ffffff;
    --input-text-color: #3C3C3B;
    --input-disabled-bg-color: whitesmoke;
    --input-disabled-text-color: #E0E0E0;
    --input-placeholder: #9c9c9c;
    --input-padding: 0.5rem 0.9rem;
}

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Roboto","Arial",sans-serif;
  border: none;
  outline: none;
  color: var(--text-color);
  // font-size: 14px;
}

html{
    overflow: hidden;
}

h1{
    font-size: 1.4rem;
}

h2 {
    font-size: 1.2rem;
}

h3, p, strong{
    font-size: 1rem;
}

small{
    font-size: 0.8rem;
    color: var(--text-color2);
}

ul{
    padding: 0;
    margin: 0;
}

li{
    list-style: none;
}

a{
    text-decoration: none;
}

label{
    font-size: 0.9rem;
    // margin-top: 0.5rem;
}

.input1{
    padding: var(--input-padding);
    border: var(--border);
    border-radius: 0.4rem;
    font-size: 0.9rem;
    transition: border .2s;
    resize: none;
    background-color: var(--input-bg-color);
    color: var(--input-text-color);
    height: fit-content;
    width: 100%;
    min-height: 2.12rem;

    &:focus{
        border-color: var(--primary-color);
    }

    &:disabled{
        opacity: 1;
        background-color: var(--input-disabled-bg-color) !important;
        color: var(--input-disabled-text-color) !important;
    }

    &::placeholder{
        color: var(--input-placeholder);
    }
}

input[type=radio]{
    cursor: pointer;
}

select{
    padding: 6px 8.6px !important;
    cursor: pointer;

    option{
        background-color: var(--input-bg-color);
        font-size: 0.9rem;
    }
}

button{
    cursor: pointer;
    // background-color: transparent;
    background-color: var(--bg-color2);
    width: fit-content;
    padding: 0.25rem 0.5rem;
    border-radius: 0.3rem;
    // color: #0000ff;
    // color: #ff0000;
    // color: #ffff00;
}

.btn{
    height: fit-content;
    border-radius: 0.4rem;
    padding: var(--input-padding);
    font-size: 1rem;
    cursor: pointer;
    background-color: var(--bg-color);
    white-space: nowrap;
    font-weight: 500;
    user-select: none;

    *{
        font-size: 1rem;
    }

    &:focus{
        box-shadow: 0 0 0.25rem 0.1rem var(--shadow-color);
    }

    // &:disabled{
    //     background-color: var(--bg-disabled-color) !important;
    //     color: var(--text-disabled-color) !important;

    //     *{
    //         color: var(--text-disabled-color) !important;
    //     }

    //     &:hover{
    //         cursor: not-allowed;
    //         background-color: var(--bg-disabled-color) !important;
    //     }
    // }
}

.btn1{
    background-color: var(--primary-color);
    color: white;

    *{
        color: white;
    }

    &:hover{
        background-color: var(--btn1-hover-color);
    }
}

.btn2{
    background-color: var(--btn2-color);

    &:hover{
        background-color: var(--btn2-hover-color);
    }
}

.btn3{
    background-color: var(--color3);
    
    *{
        color: white;
    }
}

.btn4{
    background-color: var(--color4);

    *{
        color: white;
    }
}

.btn-disabled{
    background-color: var(--bg-color-disabled) !important;
    color: var(--text-color-disabled) !important;

    *{
        color: var(--text-color-disabled) !important;
    }

    &:hover{
        cursor: not-allowed;
        background-color: var(--bg-color-disabled) !important;
    }
}

.mrg-btm05{
    margin-bottom: 0.5rem;
}

.mrg-btm1{
    margin-bottom: 1rem;
}

.mrg-btm2{
    margin-bottom: 2rem;
}

.mrg-top1{
    margin-top: 1rem;
}

.mrg-top2{
    margin-top: 2rem;
}

.max-1line{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.max-2lines{
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.botones{
    display: flex;
    justify-content: right;
    gap: 0.5rem;
}
</style>