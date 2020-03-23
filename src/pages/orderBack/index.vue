<template>
    <div class="order-back-box">
        <navbar :backVisible="true" :title="'商品售后'" ></navbar>
            <p class="title">关于快递</p>
            <p>平台所有产品属于完全私人定制化产品，下单后72小时发货，为保证发货质量和速度，合作快递默认是顺丰。</p>

            <p class="title">关于退换货</p>
            <p>平台所有产品都是根据个人情况智能配方的定制产品，一人一方，我们不支持无理由退换货，望知悉。如因平台原因导致的运输破损或者发错货，由商家负责换货；如产品出现质量问题，商家负责退/换货。</p>

            <p class="title">关于发票</p>
            <p>确认收货后可联系我们开具发票，一般为登记后15个工作日内开出。</p>

            <p class="title">售后客户电话</p>
            <p>4000523023</p>
<!-- 
            <p>售后服务</p>

            <p>由于我们的产品都属于私人定制，我们不支持无理由退换货，望知悉。

            如遇以下情形之一，请及时联系我们进行处理。</p>

            <p>1：产品商家本身的包装损（不包含物流快递外包装破损但产品包装完好的情形）</p>

            <p>2：商家错发，收到的产品与订单产品不符合；</p>

            <p>3：产品质量问题；</p>



            <p>我们的联系方式：</p>

            <p>客服热线：400-0523-023</p>

            <p>客服微信：WPP130607（添加时请注明售后问题</p> -->
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
    .title{
        font-size: 14px;
        margin-top: 10px;
        margin-bottom: 5px;
        font-weight: 600;
    }
}
</style>