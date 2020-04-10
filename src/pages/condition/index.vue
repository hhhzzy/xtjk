<template>
    <div>
        <navbar :title="'调理建议'"></navbar>
        <img src="../../../static/images/tljy.png" alt="">
    </div>
</template>
<script>
import navbar from '../../components/navbar'
export default {
    data(){
        return {

        }
    },
    components: {
        navbar
    },
}
</script>
<style lang="less" scoped>
    img{
        width: 375px;
        height: 1500px;
        display: block;
        margin:  0 auto;
        &:nth-of-type(2){
            height: 257px;
        }
    }
</style>