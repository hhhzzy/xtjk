<template>
    <div class="order-info-box">
        <navbar :backVisible="true" :title="'我的订单'" ></navbar>
        <ul>
            <li>
                <p class="title">订单详情</p>
                <div class="content">
                    <p>订单编号：323232323232323</p>
                    <p>创建时间：2019-12-16  13：26：15</p>
                    <p>支付时间：2019-12-19  13：26：15</p>
                </div>
            </li>
            <li>
                <p class="title">物流信息</p>
                <div class="content">
                    <p>订单编号：323232323232323</p>
                    <p>物流单号：申通快递 4545454545 <span>复制</span></p>
                    <p>支付时间：2019-12-19  13：26：15</p>
                </div>
            </li>
            <li>
                <p class="title">配方情况</p>
                <div class="content">
                    <p>订单编号：323232323232323</p>
                    <p>创建时间：2019-12-16  13：26：15</p>
                    <p>支付时间：2019-12-19  13：26：15</p>
                </div>
                <div class="content" style="border-top:1px solid #f2f2f2;">
                    <p>订单编号：323232323232323</p>
                    <p>创建时间：2019-12-16  13：26：15</p>
                    <p>支付时间：2019-12-19  13：26：15</p>
                </div>
            </li>
        </ul>
        <div class="del">
            <a href="javascript:;">点此删除订单（慎重，操作后不可恢复）</a>
        </div>
        <div class="footer-box">
            <p class="tips">
                <span class="one">￥2718.17</span>
                <span class="two">已优惠￥320.1</span>
            </p>
            <p class="button-p">立即付款</p>
        </div>
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
    },
}
</script>
<style lang="less" scoped>
ul{
    li{
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
        margin-bottom: 12px;
    }
}
.title{
    font-size: 17px;
    position: relative;
    height: 25px;
    line-height: 25px;
    position: relative;
    color: #000;
    font-weight: bold;
    padding: 10px 20px;
    padding-right: 10px;
    background-color: #fff;
    &::before{
        content: '';
        position: absolute;
        display: block;
        width: 5px;
        height: 16px;
        background-color: #0099ff;
        left: 10px;
        background-image: url("../../../static/images/矩形.png");
        background-repeat:no-repeat; background-size:100% 100%;-moz-background-size:100% 100%;
        top: 15px;
    }
}
.content{
    padding: 15px 10px;
    background-color: #fff;
    p{
        font-size: 14px;
        color: #333;
        margin-bottom: 10px;
        span{
            float: right;
            color: red;
            text-decoration: underline;
        }
    }
}
.del{
    height: 40px;
    line-height: 40px;
    background-color: #f2f2f2;
    padding-left: 10px;
    a{
        color: red;
        text-decoration: underline;
        font-size: 14px;
    }
}
.footer-box{
    overflow: hidden;
    .tips{
        float: left;
        width: 227px;
        height: 45px;
        background-color: rgba(93, 198, 246, 1);
        padding-left: 20px;
        text-align: center;
        .one{
            font-size: 16px;
            color: #fff;
            display: block;
            line-height: 16px;
            margin-top: 8px;
        }
        .two{
            font-size: 12px;
            color: #fff;
            display: block;
        }
    }
    .button-p{
        text-align: center;
        background: -webkit-linear-gradient(top,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1)); /* Safari 5.1-6.0 */
        background: -o-linear-gradient(bottom,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1)); /* Opera 11.1-12.0 */
        background: -moz-linear-gradient(bottom,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1));/* Firefox 3.6-15 */
        background: linear-gradient(to bottom,rgba(130, 244, 163, 1),rgba(76, 219, 197, 1)); /* 标准语法 */
        line-height: 45px;
        color: #fff;
        font-size: 16px;
    }   
}
</style>