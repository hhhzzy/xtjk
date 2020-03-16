<template>
    <div class="order-back-box">
        <navbar :backVisible="true" :title="'商品售后'" ></navbar>
            <p>售后服务</p>

            <p>由于我们的产品都属于私人定制，我们不支持无理由退换货，望知悉。

            如遇以下情形之一，请及时联系我们进行处理。</p>

            <p>1：产品商家本身的包装损（不包含物流快递外包装破损但产品包装完好的情形）</p>

            <p>2：商家错发，收到的产品与订单产品不符合；</p>

            <p>3：产品质量问题；</p>



            <p>我们的联系方式：</p>

            <p>客服热线：400-0523-023</p>

            <p>客服微信：WPP130607（添加时请注明售后问题</p>
    </div>
</template>
<script>
import navbar from '../../components/navbar'
export default {
    data(){
        return{

        }
    },
    components: {
        navbar
    }
}
</script>
<style lang="less" scoped>
.order-back-box{
    p{
        font-size: 14px;
        color: #333;
        margin: 0 10px;
    }
}
</style>