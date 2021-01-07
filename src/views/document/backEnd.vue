<template>
    <div class="handle">
        <my-markdown />
    </div>
</template>

<script>
import myMarkdown from '@/assets/backEnd.md'

export default {
    name: 'BackEnd',
    components: {
        myMarkdown,
    },
}
</script>

<style scoped lang="scss">
.handle {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 15px;
    display: flex;
    flex-direction: column;
    overflow: auto;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
}
</style>
