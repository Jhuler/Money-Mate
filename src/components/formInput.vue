<template>
    <div class="container-input">
        <label :class="{datonec:nec}" v-if="label">{{ label }}</label>
        
        <div v-if="tipo=='color'" class="cont-color">
            <input type="color" v-model="inputModel" v-if="tipo=='color'" class="input-color">
            <input type="text" v-model="inputModel" class="input1">
        </div>

        <input
            :type="tipo"
            :placeholder="placeholder"
            v-model="inputModel"
            class="input1"
            v-if="!disabled && tipo!='color'"
        />

        <div class="input1 disabled" v-if="disabled">
            {{ inputModel }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: [String, Number],

        col1: {type:Number, default:8},
        col2: {type:[String, Number], default:15},
        label: String,
        nec: {type:Boolean, default:false},
        tipo: {type:String, default:'text'},
        placeholder: String,
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
}
</script>

<style lang="scss" scoped>
.container-input{
    display: grid;
    gap: 0.2rem;
    margin-bottom: 0.3rem;
    align-items: center;

    .disabled{
        background-color: var(--input-disabled-bg-color);
    }

    label{
        width: fit-content;
    }

    .cont-color{
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }
    .input-color{
        height: 2rem;
        width: 2rem;
    }
}
</style>