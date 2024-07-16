<template>
    <!-- :style="`gridTemplateColumns: ${col1}rem ${col2}rem`" -->
    <div class="container-input">
        <label :class="{datonec:nec}">{{ label }}</label>

        <select
            v-model="inputModel"
            class="input1"
            v-if="!disabled"
        >
            <option v-for="a in lista" :key="a[val]" :value="a[val]">{{ a[mostrar] }}</option>
        </select>

        <div class="input1 disabled" v-else>
            {{ findItem() }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: [String, Number],

        label: String,
        lista: {type:[Array, Object]},
        val: {type:String, default:'id'},
        mostrar: {type:String, default:'nombre'},
        placeholder: String,
        col1: {type:Number, default:8},
        col2: {type:Number, default:15},
        nec: {type:Boolean, default:false},
        disabled: {type:Boolean, default:false}
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
    methods: {
        findItem(){
            const i = this.lista.findIndex(a => a[this.val] == this.inputModel)

            if (i == undefined || i === -1) return ''

            return this.lista[i][this.mostrar]
        }
    },
}
</script>

<style lang="scss" scoped>
.container-input{
    display: grid;
    gap: 0.2rem;
    margin-bottom: 0.3rem;
    .disabled{
        background-color: var(--input-disabled-bg-color);
    }
}
</style>