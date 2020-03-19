<template>
    <div class="mine-box">
        <navbar :backVisible="true" :title="'我的'" :linearOne="'#82F4A3'" :linearTwo="'#6ae7b1'"></navbar>
        <div class="mine-one">
            <div class="top">
                <p class="img">
                    <a href="../mineInfo/main"> <img :src="userInfo.imgUrl" alt=""></a>
                </p>
                <div class="info-box">
                    <p class="one">
                        <span class="name">{{userInfo.nickName}}</span>
                        <img src="../../../static/images/设置.png" alt="">
                    </p>
                    <div class="level">
                        <span><a href="../integralDetail/main">{{userInfo.nowGradeName}}</a></span>
                        <p class="process"></p>
                        <span><a href="../integralDetail/main">{{userInfo.nextGradeName}}</a></span>
                    </div>
                    <div class="number">
                        <p class="num"><a href="../integralDetail/main">{{userInfo.memberIntegral}}分</a></p>
                        <p class="per"><a href="../recommend/main">{{userInfo.childrenNumber}}人</a></p>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <p class="money">
                    账户余额：<a href="../accountDetail/main"><span>{{userInfo.memberAccountMoney / 1000}}元</span></a>
                </p>
                <p class="add-p">立即提现</p>
            </div>
        </div>
        <div class="mine-order">
            <p class="main-title">我的订单</p>
            <ul class="list-ul">
                <li>
                    <a href="../orderList/main">
                        <p class="img">
                            <img src="../../../static/images/dfk.png" alt="">
                        </p>
                        <span>待付款</span>
                    </a>
                </li>
                <li>
                    <a href="../orderList/main">
                        <p class="img">
                            <img src="../../../static/images/yzf.png" alt="">
                        </p>
                        <span>已支付</span>
                    </a>
                </li>
                <li>
                    <a href="../orderList/main">
                        <p class="img">
                            <img src="../../../static/images/ywc.png" alt="">
                        </p>
                        <span>已完成</span>
                    </a>
                </li>
                <li>
                    <a href="../orderBack/main">
                        <p class="img">
                            <img src="../../../static/images/spsh.png" alt="">
                        </p>
                        <span>商品售后</span>
                    </a>
                </li>
            </ul>
        </div> 
        <div class="mine-order mine-member">
            <p class="main-title">会员服务</p>
            <ul class="list-ul">
                <li>
                    <a href="javascript:;" @click="goPhysic">
                        <p class="img">
                            <img src="../../../static/images/wdcp.png" alt="">
                        </p>
                        <span>我的测评</span>
                    </a>
                </li>
                <li>
                    <a href="../formula/main">
                        <p class="img">
                            <img src="../../../static/images/zxpy.png" alt="">
                        </p>
                        <span>智能配方</span>
                    </a>
                </li>
                <li>
                    <a href="../member/main">
                        <p class="img">
                            <img src="../../../static/images/zxfk.png" alt="">
                        </p>
                        <span>会员权益</span>
                    </a>
                </li>
                <li>
                    <a href="../recommend/main">
                        <p class="img">
                            <img src="../../../static/images/tjhy.png" alt="">
                        </p>
                        <span>推荐好友</span>
                    </a>
                </li>
                <li>
                    <a href="../suggest/main">
                        <p class="img">
                            <img src="../../../static/images/tsjy.png" alt="">
                        </p>
                        <span>投诉建议</span>
                    </a>
                </li>
                <li>
                    <a href="../tc/main">
                        <p class="img">
                            <img src="../../../static/images/zxfk.png" alt="">
                        </p>
                        <span>在线反馈</span>
                    </a>
                </li>
            </ul>
        </div> 
    </div>
</template>
<script>

import store from '../../store'
import axios from '../../utils/request.js'
import navbar from '../../components/navbar'
export default {
    data(){
        return{
            userInfo:{}
        }
    },
    components: {
        navbar
    },
    methods:{
        getUserInfo(){
            // 获取用户信息
            axios({
                url: 'api/personal/getMemberInfo?memberId='+store.state.user.userInfo.id,
                method: 'get',
                data:{
                    memberId:store.state.user.userInfo.id
                }
            }).then( data => {
                if(data.data.code == 1){
                    this.userInfo = data.data.data;
                }
            } )
        },
        goPhysic(){
            mpvue.switchTab({ url:'../physicReview/main' })
        }
    },
    created(){
        this.getUserInfo();
    },
    onShow(){
        this.getUserInfo();
    }
}
</script>
<style lang="less" scoped>
.mine-box{
    height: 100%;
    background-color: #f2f2f2;
    overflow: hidden;
    .mine-one{
        padding: 0 16px;
        height: 125px;
        background-color: #4CDBC5;
        background: -webkit-linear-gradient(top,#6ae7b1,#4CDBC5); /* Safari 5.1-6.0 */
        background: -o-linear-gradient(bottom,#6ae7b1,#4CDBC5); /* Opera 11.1-12.0 */
        background: -moz-linear-gradient(bottom,#6ae7b1,#4CDBC5);/* Firefox 3.6-15 */
        background: linear-gradient(to bottom,#6ae7b1,#4CDBC5); /* 标准语法 */
        position: relative;
        margin-bottom: 40px;
        .top{
            overflow: hidden;
            .img{
                width: 56px;
                height: 56px;
                border-radius: 50%;
                overflow: hidden;
                float: left;
                img{
                    width: 56px;
                    height: 56px;
                    display: block;
                }
            }
            .info-box{
                float: left;
                margin-left: 10px;
                width: calc( 100% - 70px );
                padding-bottom: 15px;
                .name{
                    font-size: 18px;
                    color: #fff;
                }
                .one{
                    img{
                        float: right;
                        width: 15px;
                        height: 15px;
                        margin-top: 5px;
                    }
                }
                .level{
                    overflow: hidden;
                    line-height: 25px;
                    span{
                        float: left;
                        font-size: 14px;
                        color: #fff;
                        &:nth-of-type(2){
                            float: right;
                        }
                    }
                    .process{
                        float: left;
                        width: 198px;
                        height: 10px;
                        background-color: #fff;
                        margin-top: 7px;
                        margin-left: 8px;
                        border-radius: 10px;
                        position: relative;
                        &::after{
                            position: absolute;
                            content: '';
                            display: block;
                            height: 10px;
                            width: 50px;
                            background-color: #F8D43F;
                            left: 0;
                            top: 0;
                            border-radius: 10px;
                        }
                    }
                }
                .number{
                    p{
                        font-size: 14px;
                        color: #fff;
                        float: left;
                        position: relative;
                        padding-left: 20px;
                        height: 20px;
                        line-height: 20px;
                        margin-right: 20px;
                        &::before{
                            content: '';
                            display: block;
                            position: absolute;
                            width: 15px;
                            height: 15px;
                            background-color: red;
                            left: 0;
                            top: 2px;
                        }
                        &.num::before{
                            background-color: #FFEFC8;
                        }
                        &.per::before{
                            background-color: #CDF8EE;
                        }
                    }
                }
            }
        }
        .bottom{ 
            overflow: hidden;
            width: 345px;
            height: 56px;
            background-color: #fff;
            position: absolute;
            border-radius: 5px;
            line-height: 56px;
            box-shadow: 0 2px 4px rgba(211, 211, 211, 0.5);
            .money{
                font-size: 15px;
                color: #3E3E3E;
                float: left;
                margin-left: 13px;
                font-weight: bold;
                a{
                    display: inline;
                }
            }
            .add-p{
                float: right;
                width: 76px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                background: -webkit-linear-gradient(top,#82F4A3,#4CDBC5); /* Safari 5.1-6.0 */
                background: -o-linear-gradient(bottom,#82F4A3,#4CDBC5); /* Opera 11.1-12.0 */
                background: -moz-linear-gradient(bottom,#82F4A3,#4CDBC5);/* Firefox 3.6-15 */
                background: linear-gradient(to bottom,#82F4A3,#4CDBC5); /* 标准语法 */
                font-size: 12px;
                color: #fff;
                margin-top: 13px;
                margin-right: 13px;
                border-radius: 4px;
            }
        }
    }
    .mine-order{
        height: 150px;
        background-color: #fff;
        border-radius: 5px;
        overflow: hidden;
        margin-top: 15px;
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
    }
    .list-ul{
         overflow: hidden;
            margin-top: 20px;
            li{
                float: left;
                width: 25%;
                margin-bottom: 15px;
                .img{
                    width: 30px;
                    height: 30px;
                    margin: 0 auto;
                    img{
                        display: block;
                        width: 30px;
                        height: 30px;
                    } 
                }
                span{
                    display: block;
                    text-align: center;
                    font-size: 14px;
                    color: #333;
                }   
            }
    }
    .mine-member{
        height: 214px;
    }
}
</style>