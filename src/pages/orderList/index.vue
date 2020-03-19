<template>
    <div class="order-list-box">
        <navbar :backVisible="true" :title="'我的订单'" ></navbar>
        <p class="main-title">
            我的订单
        </p>
        <ul>
            <li @click="gotoInfo(item.id)" v-for="(item,index) in list" :key="index">
                <p class="one">订单号：{{item.orderNumber}}</p>
                <div class="two">
                    <div class="left">
                        <p class="name">{{item.userName}}</p>
                        <p class="info">调理方向：{{item.condiName}}</p>
                    </div>
                    <div class="right">￥{{item.transactionMoney / 1000}}</div>
                </div>
                <p v-if="item.state == 0" class="three current">去支付</p>
                <p v-else-if="item.state == 1" class="three">已付款</p>
                <p v-else class="three">已完成</p>
            </li>
            
        </ul>
    </div>
</template>
<script>
import store from '../../store'
import axios from '../../utils/request.js'
import navbar from '../../components/navbar'
export default {
    data(){
        return{
            limit:8,
            offset:1,
            list:[]
        }
    },
    components: {
        navbar
    },
    methods:{
        gotoInfo(id){
            mpvue.navigateTo({ url:'../orderInfo/main?orderId='+ id});
        },
        GetList(){
            // 加载数据
            wx.showLoading({
                title: '加载中',
            })     
            axios({
                url: 'api/memberOrder/queryOrderList?limit='+this.limit+'&offset='+this.offset+'&memberId='+store.state.user.userInfo.id,
                method: 'get',
            }).then( res => {
                if(res.data.rows){
                    if(res.data.rows.length){
                        this.list = this.list.concat(res.data.rows); 
                    }
                }
                wx.hideLoading()    
            } )
        }
    },
     onShow(){
        this.list = [];
        this.GetList();
    },
    onReachBottom () {
        this.offset++;
        this.GetList();

    }
}
</script>
<style lang="less" scoped>
.order-list-box{
    height: 100%;
    background-color: #f2f2f2;
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