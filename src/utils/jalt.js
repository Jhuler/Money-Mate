import Swal from "sweetalert2"

function msg(icon, title) {
    Swal.fire({icon, title, toast:true, position:'top-end', showConfirmButton:false, timer:2000, timerProgressBar:true})
}

const rootStyles = getComputedStyle(document.documentElement)
const btn1Color = rootStyles.getPropertyValue('--primary-color').trim()
// const btn2Color = rootStyles.getPropertyValue('--btn2-color').trim()

const qst = (title, text) => Swal.fire({
    icon: 'question',
    title: title,
    text: text,
    confirmButtonText: "Sí",
    confirmButtonColor: btn1Color,
    showDenyButton: true,
    denyButtonText: 'No',
    // denyButtonColor: btn2Color,
    // customClass: {
    //     denyButton: 'btn btn2'
    // }
})

const jalt = {
    msg,
    qst
}

export default jalt