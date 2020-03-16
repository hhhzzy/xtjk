<template>
    <div class="order-list-box">
        <navbar :backVisible="true" :title="'我的订单'" ></navbar>
        <p class="main-title">
            我的订单
        </p>
        <ul>
            <li @click="gotoInfo">
                <p class="one">订单号：322123142</p>
                <div class="two">
                    <div class="left">
                        <p class="name">王思聪</p>
                        <p class="info">调理方向：癌症</p>
                    </div>
                    <div class="right">￥502.20</div>
                </div>
                <p class="three current">去支付</p>
            </li>
            <li>
                <p class="one">订单号：322123142</p>
                <div class="two">
                    <div class="left">
                        <p class="name">王思聪</p>
                        <p class="info">调理方向：癌症</p>
                    </div>
                    <div class="right">￥502.20</div>
                </div>
                <p class="three">已完成</p>
            </li>
        </ul>
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
    methods:{
        gotoInfo(){
            mpvue.navigateTo({ url:'../orderInfo/main' });
        }
    }
}
</script>
<style lang="less" scoped>
.order-list-box{
    height: 100%;
    background-color: #f2f2f2;
    overflow: hidden;
    .main-title{
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
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
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
    ul{
        margin-top: 10px;
        li{
            overflow: hidden;
            background-color: #ffffff;
            margin-bottom: 10px;
            .one{
                font-size: 14px;
                color: rgba(0, 0, 0, 1);
                padding-left: 10px;
                height: 30px;
                line-height: 30px;
                margin-top: 5px;
            }
            .two{
                padding-left: 10px;
                overflow: hidden;
                .left{
                    float: left;
                    .name{
                        font-size: 16px;
                        color: rgba(34, 34, 34, 1);
                        font-weight: bold;
                        float: left;
                        margin-right: 3px;
                    }
                    .info{
                        font-size: 16px;
                        color: rgba(34, 34, 34, 1);
                        margin-bottom: 10px;
                        font-weight: bold;
                        float: left;
                    }
                }
                .right{
                    float: right;
                    font-size: 16px;
                    margin-right: 20px;
                    font-size: 16px;
                    color: rgba(34, 34, 34, 1);
                    font-weight: bold;
                }
            }
            .three{
                font-size: 15px;
                text-align: center;
                height: 30px;
                line-height: 30px;
                width: 90px;
                border-radius: 15px;
                color: rgba(178, 178, 178, 1);
                border: 1px solid rgba(178, 178, 178, 1);
                float: right;
                font-weight: bold;
                margin-right: 15px;
                margin-bottom: 14px;
                &.current{
                    color: rgba(81, 221, 194, 1);
                    border: 1px solid rgba(130, 244, 163, 1);
                }
            }
        }
    }
}
</style>