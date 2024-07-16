<template>
<div class="container-pass">
    <input :placeholder="placeholder" :type="tipo_input" v-model="inputModel" class="input1"/>

    <i class="fa-solid" :class="{'fa-eye':ver_pass, 'fa-eye-slash':!ver_pass}" @click="showPass"></i>
</div>
</template>

<script>
export default {
    props: {
        modelValue: String,

        placeholder: String,
    },
    computed: {
        inputModel: {
            get() {
                return this.modelValue
            },
            set(newValue) {
                this.$emit('update:modelValue', newValue)
            },
        },
    },
    data: () => ({
        tipo_input:'password',
        ver_pass:false,
    }),
    methods:{
        handleInput (e) {
            console.log(e.target.value)
            this.$emit('input', e.target.value)
        },
        showPass() {
            this.ver_pass = !this.ver_pass
            this.tipo_input = this.ver_pass ? 'text' : 'password'
        },
    }
}
</script>

<style lang="scss" scoped>
.container-pass{
    position: relative;
    display: flex;
    align-items: center;

    input {
        padding-right: 1.7rem !important;
        width: 100%;
    }

    i {
        position: absolute;
        right: 0.5rem;
        font-size: 0.8rem;
        cursor: pointer;
        margin: 0 auto;

        &:hover {
            color: var(--primary-color);
        }
    }
}
</style>