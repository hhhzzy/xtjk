<template>
    <div>
        <navbar :title="'调理建议'"></navbar>
        <img :src="imgUrl" alt="">
    </div>
</template>
<script>
import {imgBaseUrl} from '../../utils/common.js'
import navbar from '../../components/navbar'
export default {
    data(){
        return {
            imgBaseUrl:imgBaseUrl,
            imgUrl:''
        }
    },
    components: {
        navbar
    },
    mounted(){
        this.imgUrl = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent('C:/workspace/th_api/source/message.png ');
       
    }
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