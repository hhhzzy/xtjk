<template>
    <div class="donate-join-box">
        <navbar :title="'申请加入'"></navbar>
        <div class="donate-content">
            <div class="img"> 
                <img :src="imgList" alt="">
            </div>
            <div class="donate-con">
                <p> 为杜绝虚假救助申请，欺骗性申请，平台公益金的救助形式为非现金式，即无论救助金额大小，所有资金不经过受助者本人或其他关联人账户，由平台公益资源库医疗机构或医生提供服务，平台直接将所需费用打入服务提供商账户，其他诸如生活开支等费用，均由受助者本人承担，与平台无关。</p>
                <p>救助采用审核制，受助者需满足以下条件，在平台满足其救助金额的前提下，平台审核通过启动救助程序：</p>
                <p>1、受助者本人需是平台公益会员；</p>
                <p>2、受助者本人须属于【有病无钱医】【有病无处医】范畴；</p>
                <p>3、受助者本人必须提供真实情况，如提供虚假情况骗取救助，平台保留追究法律责任的权力；</p>
                <p>4、凡属于【见义勇为】【孝心家庭】及社会公认的有突出贡献的人士，优先审核。</p>

                <p>以上内容望仔细阅读。我们倡议平台各会员能踊跃捐赠，助力健呗【公益互助】，去帮助更多需要帮助的人。</p>

                <p>以上最终解释权归新太（重庆）健康科技有限公司所有</p>

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
                       完成任意一笔爱心商城消费 
                    </van-checkbox>
                    <span v-if="isOk.two">OK</span>
                    <a v-else href="../donate/main">去完成</a>
                </div>
                <div class="line">或</div>
                <div class="list">
                    <van-checkbox icon-size="16px"   shape="square"  checked-color="#07c160" :value="isOk.three" @change="changeThree">
                       消费金额 > {{info.consumerMoney / 1000}}元
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
    line-height: 20px;
    padding: 10px;
    border-bottom: 1px solid #F3F3F3FF;
}
</style>