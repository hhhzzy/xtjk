<template>
    <div class="formula-info-box">
        <navbar :backVisible="true" :title="'我的配方'"></navbar>
        <div class="bg-box">
            <p class="main-title">
                配方人信息
            </p>
            <ul>
                <li>
                    <p class="title">姓名:</p>
                    <p class="cont">{{info.userName}}</p>
                </li>
                <li>
                    <p class="title">年龄:</p>
                    <p class="cont">{{info.userAge}}岁</p>
                </li>
                <li>
                    <p class="title">身高:</p>
                    <p class="cont">{{info.userHeight}}cm</p>
                </li>
                <li>
                    <p class="title">体重:</p>
                    <p class="cont">{{info.userWeight / 1000}}kg</p>
                </li>
                <li>
                    <p class="title">工作性质:</p>
                    <p class="cont">{{info.natureName}}</p>
                </li>
                <li>
                    <p class="title">调理方向:</p>
                    <p class="cont">{{info.condiName}}</p>
                </li>
                <li>
                    <p class="title">特殊告知:</p>
                    <p class="cont">{{info.isDiabetes?'有糖尿病':'无'}}</p>
                </li>
                <li>
                    <p class="title">体质:</p>
                    <p class="cont">{{info.bodyTypeName}}</p>
                </li>
            </ul>
        </div>
        <div class="bg-box">
            <p class="main-title">
                配方食材构成
            </p>
            <div class="info">
                <p>该配方包含食材{{foodNum}}种，每日所需热量为{{hotNum}}Kcal，总热量{{hotNum*info.overDay}}Kcal。</p>
                <div v-for="(item,index) in info.foodMap" :key="index">
                    <p class="title">热源{{index+1}}：</p>
                    <p class="cont">{{item.foodName}}   X {{item.foodWeight}}克 X {{info.overDay}}天</p>
                </div>
                <p></p>
            </div>
            </div>
        
        <div class="footer-box">
            <p class="del-p" @click="del">删除配方</p>
            <p class="add-p" @click="buy">共￥{{info.recipePrice*info.overDay / 1000}}，立即付款</p>
        </div>
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
        <van-popup  :show="addressShow"  
                    position="bottom" 
                    @close="closeAddressPopup">
            <van-picker :columns="addressList"
                        show-toolbar
                        title="请选择地址" 
                        @cancel="onCancel"
                        @confirm="onConfirm"  />
        </van-popup>
    </div>
</template>
<script>
import navbar from '../../components/navbar'
import axios from '../../utils/request.js'
import store from '../../store'
import Dialog from '../../../static/vant/dialog/dialog';
import Toast from '../../../static/vant/toast/toast';
import { wxpay } from '../../utils/common.js'
import { resolve } from 'url';
export default {
    data(){
        return{
           id:null,
           info:{},
           hotNum:null, //总热量
           foodNum:null,
           memberOrderId:null, // 订单号
           addressShow:false,
           addressList:[],
           addressData:[],
           receiveAddressId:null,

        }
    },
    components: {
        navbar
    },
    methods:{
        GetInfo(){
            axios({
                url:'api/recipe/queryRecipeDetail?memberRecipeId='+this.id,
                method:'GET',
            }).then( res => {
                console.log(res)
                if(res.data.code == 1){
                    this.info = res.data.data;
                    if(this.info.foodMap){
                        this.info.foodMap.forEach(item => {
                            this.hotNum += item.foodHot;
                        });
                        this.foodNum = this.info.foodMap?this.info.foodMap.length:0;
                    }
                }
            } )
        },
        // 删除
        del(){
            Dialog.confirm({
                title: '提示',
                message: '是否删除？',
                asyncClose: true
            })
            .then(() => {
                axios({
                    url:'api/recipe/deleteMemberRecipe?memberRecipeId='+this.id,
                    method:'GET',
                }).then( res => {
                    if(res.data.code == 1){
                        Dialog.close();
                        Toast({
                            type: 'success',
                            message: '删除成功',
                            onClose: () => {
                                mpvue.navigateTo({ url:'../formula/main'});
                            }
                        });
                    }
                } )
            })
            .catch(() => {
                Dialog.close();
            });
        },
        // 购买
        async buy(){
            let boolBuy = false;
            // 获取收获地址
            await new Promise( (resolve,reject) => {
                axios({
                        url:'api/personal/getMemberReceiveAddressList?memberId='+store.state.user.userInfo.id,
                        method:'GET'
                    }).then( res => {
                        console.log(res,'');
                        if(res.data.code == 1 && res.data.data.length >= 1){
                            this.boolBuy = true
                            this.addressShow = true;
                            this.addressData = res.data.data;
                            this.addressList = res.data.data.map( item => {
                                return item.receiveAddress;
                            } )
                        } else {
                            Toast({
                                type: 'fail',
                                message: '请选择收货地址',
                                onClose: () => {
                                    mpvue.navigateTo({ url:'../addressAdd/main?type=formula&formulaId='+this.id});
                                }
                            });
                        }
                        resolve();
                    } )
            } )
        },
        closeAddressPopup(){
            this.addressShow = false;
        },
        async onConfirm(value){
            this.receiveAddressId = this.addressData[value.mp.detail.index].id;
            this.addressShow = false;
            // 生成订单
            await new Promise( (resolve,reject) => {
                const form = {};
                form.memberId = store.state.user.userInfo.id;
                form.memberRecipeId = this.id;
                axios({
                        url:'api/memberOrder/addMemberOrder?memberId='+form.memberId+'&memberRecipeId='+this.id+'&receiveAddressId='+this.receiveAddressId,
                        method:'GET'
                    }).then( res => {
                        console.log(res);
                        if(res.data.code == 1){
                            this.memberOrderId = res.data.data.memberOrderId;
                        }
                        resolve();
                    } )
            } )
            // 支付
            wxpay(store.state.user.userInfo.id,this.memberOrderId,'配方订单支付',1);
        },
        onCancel(){
            this.addressShow = false;
        }
    },
    mounted(){
    },
    onLoad(options){
        console.log(options)
        this.id = options.id;
    },
    onShow(){
        this.GetInfo();
        this.foodNum = null;
        this.hotNum = null;
    }
}
</script>
<style lang="less" scoped>
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
    .bg-box{
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
        margin-bottom: 10px;
    }
    ul{
        padding: 5px 0;
        background-color: #fff;
        li{
            overflow: hidden;
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            .title,.cont{
                font-size: 16px;
                float: left;
            }
            .cont{
                color: #4D4D4DFF;
                font-weight: bold;
            }
            .title{
                color: #B3B3B3FF;
                width: 80px;
            }

        }
    }
    .info{
        padding: 5px 0;
        font-size: 14px;
        color: #333;
        background-color: #fff;
        p{
            line-height: 30px;
        }
        margin-bottom: 60px;
        p:first-child{
            color: rgba(77, 77, 77, 1);
            font-size: 16px;
            padding-left: 20px;
        }
        div{
            overflow: hidden;
            height: 30px;
            line-height: 30px;
            .title,.cont{
                font-size: 16px;
                float: left;
            }
            .cont{
                color: #4D4D4DFF;
                font-weight: bold;
            }
            .title{
                color: #B3B3B3FF;
                width: 80px;
            }

        }
    }
    .footer-box{
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        .del-p{
            height: 45px;
            line-height: 45px;
            width: 100px;
            text-align: center;
            background-color: rgba(93, 198, 246, 1);
            color: #fff;
            font-size: 16px;
            float: left;
        }
        .add-p{
            float: left;
            text-align: center;
            width: calc( 100% - 100px );
            background: -webkit-linear-gradient(left,#63e6b5,#4CDBC5); /* Safari 5.1-6.0 */
            background: -o-linear-gradient(right,#63e6b5,#4CDBC5); /* Opera 11.1-12.0 */
            background: -moz-linear-gradient(right,#63e6b5,#4CDBC5);/* Firefox 3.6-15 */
            background: linear-gradient(to right,#63e6b5,#4CDBC5); /* 标准语法 */
            height: 45px;
            line-height: 45px;
            color: #fff;
            font-size: 16px;
        }
    }
</style>