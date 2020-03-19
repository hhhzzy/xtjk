<template>
    <div class="donate-join-box">
        <navbar :title="'申请加入'"></navbar>
        <div class="donate-content">
            <div class="img"> 
                <img :src="imgList" alt="">
            </div>
            <div class="donate-con">
                捐赠说明文本、介绍或吸引用户的文本在这里。
            </div>
            <p class="title">加入条件</p>
            <div class="one">
                <div class="list">
                    <van-checkbox icon-size="16px"   shape="square"  checked-color="#07c160" :value="isOk.one" @change="changeOne">
                       注册时间 > {{info.registerDay}}天 
                    </van-checkbox>
                    <span v-if="isOk.one">OK</span>
                </div>
                <div class="list">
                    <van-checkbox icon-size="16px"   shape="square"  checked-color="#07c160" :value="isOk.two" @change="changeTwo">
                       完成首笔捐赠 
                    </van-checkbox>
                    <span v-if="isOk.two">OK</span>
                    <a v-else href="../donate/main">去完成</a>
                </div>
                <div class="line">或</div>
                <div class="list">
                    <van-checkbox icon-size="16px"   shape="square"  checked-color="#07c160" :value="isOk.three" @change="changeThree">
                       消费金额 > {{info.consumerMoney}}元
                    </van-checkbox>
                    <span v-if="isOk.three">OK</span>
                    <a v-else href="#" @click="goComThree">去完成</a>
                </div>
            </div>
            <div class="btn-box">
                <p :class="[(isOk.one && isOk.two) || isOk.three?'current':'','btn-p']" @click="application">申请加入</p>
                <p class="content"> <span>*</span> 须先完成上述任务后才能申请加入</p>
            </div>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import axios from '../../utils/request.js'
import store from '../../store'
import {imgBaseUrl} from '../../utils/common.js'
import Toast from '../../../static/vant/toast/toast';
import navbar from '../../components/navbar'
export default {
    data(){
        return{
            imgBaseUrl:imgBaseUrl,
            info:{},
            isOk:{
                one:false,
                two:false,
                three:false
            },
            imgList:''
        }
    },
    components: {
        navbar
    },
    methods:{
        getDonate(){
            axios({
                url:'api/public/getPublicConfig?memberId='+store.state.user.userInfo.id,
                method:'get'
            }).then( res => {
                if(res.data.code == 1){
                    this.info = res.data.data;
                    console.log(res.data.data)
                    this.isOk.one = this.info.memberRegisterDay < this.info.registerDay ? false : true;
                    this.isOk.two = this.info.memberFirstRechargeMoney > this.info.firstRechargeMoney ? true : false;
                    this.isOk.three = this.info.memberConsumerMoney > this.info.consumerMoney ? true : false;
                }
            } )
        },
        changeOne(event){
            if(!this.isOk.one){
                Toast.fail('该条件未完成');
                return;
            }
        },
        changeTwo(event){
            if(!this.isOk.one){
                Toast.fail('该条件未完成');
                return;
            }
        },
        changeThree(event){
            if(!this.isOk.one){
                Toast.fail('该条件未完成');
                return;
            }
        },
        goComThree(){
            mpvue.navigateTo({ url:'../donate/main' });
        },
        application(){
            if((this.isOk.one && this.isOk.two) || this.isOk.three){
                axios({
                    url:'api/public/addPublicMember?memberId='+store.state.user.userInfo.id,
                    method:'get'
                }).then( res => {
                    if(res.data.code == 1){
                        Toast.success('加入成功');
                    } else {
                        Toast.fail(res.data.msg);
                    }
                } )
            } else{
                Toast.fail('上诉条件未完成');
            }
        },
        async GetImg(){
            await axios({
                url:'api/index/getAllPicture?type=3',
                method:'get'
            }).then( res => {
                    console.log(res)
                if(res.data.code ==1){
                    this.imgList = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(res.data.data[0].imgUrl);
                }
            } )
        },
    },
    onShow(){
        this.getDonate();
        this.GetImg();
    }
}
</script>
<style lang="less" scoped>
page{
    height: 100%;
}
.donate-join-box{
    height: 100%;
    overflow: hidden;
}
.donate-content{
    width: 345px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
    margin: 0 auto;
    overflow: hidden;
    margin-top: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    padding-bottom: 10px;

    .img{
        width: 345px;
        height: 190px;
        position: relative;
        img{
            width: 345px;
            height: 190px;
        }
    }
    .title{
        margin:  10px 10px;
        font-size: 16px;
        color: #222222FF;
        font-weight: bold;
    }
    .one{
        margin: 0 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #f2f2f2;
        /deep/ .van-radio__label{
            color: #868686FF;
            font-size: 14px;
        }
        .list{
            overflow: hidden;
            margin: 15px 0;
        }
        van-checkbox{
            float: left;
        }
        span{
            float: right;
            color:#868686FF;
            font-size: 12px;
        }
        a{
            float: right;
            color: red;
            text-decoration: underline;
            font-size: 12px;
        }
    }
    .line{
        position: relative;
        text-align: center;
        &::before{
            content: '';
            display: block;
            position: absolute;
            left: 0;
            top: 12px;
            width: 100%;
            height: 1px;
            border-bottom: 1px dashed #999;
            z-index: 99;
        }
    }
}
.btn-box{
    .btn-p{
        background-color: rgba(204, 204, 204, 1);
        height: 45px;
        line-height: 45px;
        width: 295px;
        text-align: center;
        font-size: 16px;
        color: #fff;
        border-radius: 20px;
        margin: 15px auto;
        margin-bottom: 5px;
    }
    .current{
        background-color: rgba(255, 173, 52, 1);
    }
    .content{
        span{
            color: red;
        }
        font-size: 12px;
        color: #333;
        text-align: center;
    }
}
.donate-con{
    font-size: 14px;
    color: #333;
    line-height: 30px;
    height: 30px;
    padding: 10px;
    border-bottom: 1px solid #F3F3F3FF;
}
</style>