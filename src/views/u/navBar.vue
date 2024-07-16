<template>
    <nav>
        <router-link v-for="(a,i) in routes" :key="i" :to="{name:a.goto}" activeClass="ruta-actual">
            <i :class="a.icon"></i>
            <p class="max-1line">{{ a.label }}</p>
        </router-link>
    </nav>
</template>

<script>
export default {
    data: () => ({
        routes: [
            {label:'Inicio', icon:'fa-regular fa-rectangle-list', goto:'movimientos'},
            {label:'Cuentas', icon:'fa-solid fa-sack-dollar', goto:'cuentas'},
            {label:'Categorías', icon:'fa-solid fa-layer-group', goto:'categorias'},
            {label:'Préstamos', icon:'fa-solid fa-landmark', goto:'prestamos'},
            {label:'Cuenta', icon:'fa-solid fa-user', goto:'usuario'}
        ]
    })
}
</script>

<style lang="scss" scoped>
nav{
    width: 100%;
    padding: 0.3rem 0;
    box-shadow: var(--box-shadow-modal);
    display: grid;
    gap: 0.3rem;
    grid-template-columns: repeat(5, 1fr);
    // position: absolute;
    // bottom: 0;
    // left: 0;
    background-color: var(--bg-color);

    *{
        color: var(--text-color2);
    }

    a{
        padding: 0.3rem;
        overflow: hidden;
        text-align: center;

        i{
            align-self: center;
            margin-bottom: 0.5rem;
        }

        p{
            font-size: 0.8rem;
        }
    }

    .ruta-actual{
        *{
            color: var(--primary-color);
        }
    }
}
</style>