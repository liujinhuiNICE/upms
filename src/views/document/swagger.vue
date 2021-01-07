<template>
    <div class="handle">
        <iframe src="http://17.16.39.115:8891/doc.html" width="100%" height="100%" frameborder="0" />
    </div>
</template>

<script>
export default {
    name: 'Swagger',
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
