import { defineStore } from "pinia"
import { urls, get } from '@/store/meCrud'
import { deepCopy } from "@/store/meUtil"
import { useData } from "./data"

export const useAuth = defineStore('auth', {
    state: () => ({
        showPwa: false,
        installPwa: null,

        local: false,
        token: null,
        usuario: {},
        db: null,
        dbInit:false,
        signUp:false,

        timeouts: {},
    }),
    actions: {
        async verify(){
            // this.token = 'U2FsdGVkX1+hxDkj2EMERDqmvcMBg/q8oFSG2HjNn2av6ZHZ6rQZdrLpYy/LmtBI'

            if (this.token == '') {
                this.logout()
                return false
            }

            const result = await get(`${urls.usuarios}/login`)
            
            if (result.code != 0) {
                this.logout()
                return false
            }

            this.usuario = deepCopy(result.data)
            // console.log(this.usuario)
            return true
        },
        async logout(){
            this.token = ''
            this.usuario = {}

            useData().initAll()
        },

        // setNavbar(array){
        //     this.navbar = deepCopy(array)
        // },

        // agregarTimeout(nombre, callback, tiempo) {
        //     this.timeouts[nombre] = setTimeout(callback, tiempo)
        // },
        // eliminarTimeout(nombre) {
        //     clearTimeout(this.timeouts[nombre])
        //     delete this.timeouts[nombre]
        // },
        // limpiarTimeouts() {
        //     Object.values(this.timeouts).forEach(timeout => {
        //         clearTimeout(timeout)
        //     })

        //     Object.keys(this.timeouts).forEach(nombre => {
        //         delete this.timeouts[nombre]
        //     })
        // },
    },
    persist: {
        storage: localStorage,
        paths: ['local','token','dbInit']
    }
})