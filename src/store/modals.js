import {defineStore} from "pinia"

export const useModals = defineStore('modals', {
    state: () => ({
        // jdTippy:{top:0, left:0, text:'', display:'none'},
        movimiento:{},
        cuenta:{},
        categoria:{},
        prestamo:{},

        multiSelect:{},

        filtroFechas:{},

        cambiarContrasena:{},
        cambiarCorreo:{},
        personalInfo:{},
    }),
    actions: {
        setModal(obj, title, show, mode){
            this[obj] = {title, show, mode}
        },

        // setJdTippy(el, text){
        //     this.jdTippy.top = (el.clientY - el.offsetY) //- (el.srcElement.offsetHeight*2)
        //     this.jdTippy.left = (el.clientX - el.offsetX) + (el.srcElement.offsetWidth/2)
        //     this.jdTippy.text = text
        //     this.jdTippy.display = 'initial'

        //     const jdTippyLeave = () => {
        //         this.jdTippy = {top:0, left:0, text:'', display:'none'}
        //         console.log(el)
        //         el.srcElement.removeEventListener('mouseleave', jdTippyLeave)
        //     }

        //     el.srcElement.addEventListener('mouseleave', jdTippyLeave)
        // }
    },
})