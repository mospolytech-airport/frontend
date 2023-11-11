<template>
    <div class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <slot name="header"> </slot>
                <button @click="closeModal">X</button>
            </div>
            <div class="modal-body">
                <slot name="content"> </slot>
            </div>
            <div class="modal-footer">
                <slot name="footer"> </slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    methods: {
        closeModal() {
            this.$emit('update:isOpen', false);
        },
    },
};
</script>

<style scoped lang="scss">
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    border: 3px solid black;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.modal-header {
    padding: 0 5px;
    border-bottom: solid 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
        margin: 0;
    }

    button {
        background-color: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
    }
}
.modal-footer {
    margin-top: 15px;
    display: flex;
    gap: 2rem;
    justify-content: end;
}
</style>
