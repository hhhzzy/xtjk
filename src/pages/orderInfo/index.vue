<template>
    <div class="order-info-box">
        <navbar :backVisible="true" :title="'我的订单'" ></navbar>
        <ul>
            <li>
                <p class="title">订单详情</p>
                <div class="content">
                    <p><span class="tit">订单编号：</span><span class="con">{{info.orderNumber}}</span></p>
                    <p><span class="tit">创建时间：</span><span class="con">{{info.createTime}}</span></p>
                    <!-- <p><span class="tit">支付时间：</span><span class="con">2019-12-19  13：26：15</span></p> -->
                </div>
            </li>
            <li v-if="info.orderState">
                <p class="title">物流信息</p>
                <div class="content">
                    <p v-if="info.goodsTime"><span class="tit">发货时间：</span><span class="con">{{info.goodsTime}}</span></p>
                    <p v-if="info.goodsOrder"><span class="tit">物流单号：</span><span class="con">{{info.goodsCompany}} {{info.goodsOrder}}</span> <i>复制</i></p>
                    <p v-if="info.goodsRemark"><span class="tit">备注信息：</span><span class="con">{{info.goodsRemark}}</span></p>
                </div>
            </li>
            <li>
                <p class="title">配方情况</p>
                <p class="tips">该配方包含食材{{foodNum}}种，总热量{{foodHot}}Kcal。</p>
                <div class="content">
                    <p v-for="(item,index) in info.foodMap" :key="index"><span class="tit">热源{{index+1}}:</span><span class="con">{{item.foodName}} X {{item.foodWeight}}克</span></p>
                </div>
                <div class="content fs-box">
                    <p v-for="(item,index) in info.foodList" :key="index"><span class="tit">辅助食{{index+1}}:</span><span class="con">{{item}}</span></p>
                </div>
            </li>
        </ul>
        <div class="del" v-if="!info.orderState">
            <a href="javascript:;" @click="delOrder">点此删除订单（慎重，操作后不可恢复）</a>
        </div>
        <div class="footer-box" v-if="!info.orderState">
            <p class="tips">
                <span class="one">￥{{info.transactionMoney / 1000}}</span>
                <span class="two">已优惠￥{{info.discountMoney / 1000}}</span>
            </p>
            <p class="button-p" @click="buy">立即付款</p>
        </div>
        <div class="footer-box current" v-else>
            <p class="tips">
                <span class="one">￥{{info.transactionMoney / 1000}}</span>
                <span class="two">已优惠￥{{info.discountMoney / 1000}}</span>
            </p>
        </div>
        <van-dialog id="van-dialog" />
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import Dialog from '../../../static/vant/dialog/dialog';
import store from '../../store'
import axios from '../../utils/request.js'
import navbar from '../../components/navbar'
import { resolve } from 'url'
import { rejects } from 'assert'
import { wxpay } from '../../utils/common.js'
import Toast from '../../../static/vant/toast/toast';
export default {
    data(){
        return{
            id:null,
            info:{},
            foodNum:null,
            foodHot:null,
            code:null
        }
    },
    components: {
        navbar
    },
    methods:{
        GetInfo(){
            // 加载数据
            wx.showLoading({
                title: '加载中',
            })   
            axios({
                url: 'api/memberOrder/queryMemberOrderDetail?memberOrderId='+Number(this.id),
                method: 'get',
            }).then( res => {
                console.log(res.data.data);
                if(res.data.code == 1){
                    this.info = res.data.data;
                    this.foodNum = this.info.foodMap.length;
                    this.info.foodMap.forEach(item => {
                        this.foodHot += item.foodHot;
                    });
                }
                wx.hideLoading() 
            } )
        },
        // 删除订单
        delOrder(){
            Dialog.confirm({
                title: '提示',
                message: '是否删除该订单？'
            }).then(() => {
                axios({
                    url:'api/memberOrder/deleteMemberOrder?memberId='+store.state.user.userInfo.id+'&memberOrderId='+this.info.memberOrderId,
                    method:'get',
                }).then( res => {
                    console.log(res)
                    if(res.data.code == 1){
                        wx.showToast({
                            title: '删除成功！',
                            icon: 'success',
                            success:function(){
                                mpvue.navigateTo({ url:'../orderList/main'});
                            }
                        })
                    }else{
                        Toast({
                            type:'success',
                            message: res.data.msg,
                        })
                    }
                } )
            })
        },
        // 购买
        async buy(){
            console.log(22)
            // 支付
            wxpay(store.state.user.userInfo.id,this.info.memberOrderId,'配方订单支付',1);
            return;
            // 1.获取code
           await  new Promise( (resolve,reject) => {
                wx.login({
                    success: async res => {
                        // 获取到用户的 code 之后：res.code
                        console.log(res.code);
                        this.code = res.code;
                        resolve();
                    }
                });
            } )
            // 2.生成订单
            axios({
                url: 'api/weixinpay/getSin?memberId='+store.state.user.userInfo.id+'&memberOrderId='+this.info.memberOrderId+'&body=保健商品'+'&code='+this.code+'&total_fee=1',
                method: 'get',
                data:{
                    memberId:store.state.user.userInfo.id,
                    memberOrderId:this.info.memberOrderId,
                    body:'保健商品',
                    code:wx.getStorageSync('code'),
                    total_fee:1
                }
            }).then( res => { 
                const data = res.data.data;
                console.log(data)
                // 3.调取二维码支付
                wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: 'MD5',
                    paySign: data.paySign,
                    success (res) { 
                        console.log(res,'成功')
                        
                    },
                    fail (res) { 
                        console.log(res,'失败')
                    }
                })
            } )
        }
    },
    onShow(){
        this.GetInfo();
        this.foodNum = null;
        this.foodHot = null
    },
    onLoad(options){
        console.log(options)
        this.id = options.orderId;
    }
}
</script>
<style lang="less" scoped>
ul{
    li{
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
        margin-bottom: 12px;
        background-color: #fff;
        overflow:hidden;
    }
    
    .tips{
        color: rgba(77, 77, 77, 1);
        font-size: 16px;
        padding: 0 20px;
        background-color: #fff;
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
.fs-box{
    border-top:1px solid rgba(245, 245, 245, 1);
    padding: 15px 0;
}
.content{
    margin: 15px 20px;
    p{
        font-size: 14px;
        color: #333;
        margin-bottom: 10px;
        overflow: hidden;
        height: 22px;
        font-size: 16px;
        line-height: 22px;
        i{
            float: right;
            color: red;
            text-decoration: underline;
            font-style: normal;
        }
        .tit{
            width: 80px;
            display: block;
            float: left;
            color: rgba(179, 179, 179, 1);
        }
        .con{
            margin-left: 5px;
            color: rgba(77, 77, 77, 1);
            font-weight: bold;
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
    &.current{
        .tips{
            width: 100%;
            padding-left: 0;
        }
    }
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