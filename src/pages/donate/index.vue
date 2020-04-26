<template>
    <div class="donate-box">
        <navbar :title="'爱心商城'"></navbar>
        <div class="donate-content">
            <div class="img"> 
                <img :src="imgList" alt="">
            </div>
            <div class="donate-money">
                <p class="money">
                    {{publicAccountMoney / 1000}}
                </p>
                <p class="title">爱心商城收益总额（元）</p>
            </div>
            <div class="donate-btn">
                <p class="btn" @click="showDonate">爱心商城</p>
            </div>
            <div class="donate-con">
                <p>健呗感恩回馈，旨在感恩在平台的爱心消费者，帮助平台内爱心会员在特殊情况下渡过难关，解决问题。我们的理念是“人人为我，我为人人”。救助对象实行权限制，即你需要取得【爱心会员】资格,，符合平台感恩救助规则，才能发起救助申请。</p> 
                <p>如何成为【爱心会员】？</p>
                <p>1：在爱心商城够买任意商品，且注册时间满足一定期限；</p>
                <p>2：在平台内消费达到一定金额后自动升级为爱心会员；</p>
            </div>
        </div>
        <div class="donate-list">
            <p class="title">最新爱心会员播报</p>
            <ul>
                <li v-for="(item,index) in donateList" :key="index">
                    <p>{{item.nickName}}</p>
                    <p>爱心消费了{{item.transactionMoney / 1000}}元</p>
                    <p>{{item.createTime}}</p>
                </li>
            </ul>
        </div>
        <div class="footer-box">
            <a href="../donateList/main" class="my-p">我的消费</a>
        </div>
        <van-popup :show="show" closeable @close="onClose">
            <div class="donate-show">
                <p class="title">
                    爱心商城 <span>让我们一起爱，一起被爱！</span>
                </p>
                <p class="con">爱心商城所有商品均为我公司自主产品，经专家团队结合国内外顶尖研究机构成果，研发而成</p>
                <ul class="money">
                    <li :class="current == index?'current':''" @click="getMoney(item.money,index)" v-for="(item,index) in moneyList" :key="index">
                        {{item.money}}元{{item.content}}
                    </li>
                </ul>
                <!-- <div class="ipt-box">
                    <input type="number" placeholder="自定义金额" @change="changeMoney">
                    <span>元</span>
                </div>
                <p class="tips">*不可低于10元</p> -->
                <van-field
                        label="*收货地址："
                        readonly
                        :is-link="true"
                        :value="addressInfo"
                        :arrow-direction="right"
                        @click="addressClick"
                        placeholder="请选择收货地址"
                    />
                <div class="checked-box">
                    <van-checkbox icon-size="16px"   shape="square"  checked-color="#07c160" :value="checked" @change="onChange">
                        我同意<span class="one">《爱心商城消费须知》</span>，
                    </van-checkbox>
                    <a class="two" @click="seeClick">点此查看>></a>
                </div>
                <div class="donate-sure" @click="donate">确定购买</div> 
            </div>
        </van-popup>
        <van-popup :show="seeShow" closeable @close="onSeeClose">
            <div class="see-box">
                <p style="margin-top:25px;">购买任意爱心商品后，自购买日开始一定时间后，自动升级为爱心会员。</p> 
                <p>须知1：爱心商城商品为定制版本，不支持退货。</p>
                <p>须知2：爱心商城商品均不包邮；如需电子版本，请在购买时备注。</p>
                <p>【爱心会员享受以下权益：】</p> 
                <p class="con">1、可提交满足救助规则的救助申请；</p> 
                <p class="con">2、可申请成为爱心监督员，监督平台对爱心资金的使用。</p> 
                <p>【爱心基金池的来源：】</p> 
                <p class="con">1、平台正常营收提留不高于3%金额，注入爱心池；</p> 
                <p class="con">2、爱心商城收益注入爱心池。</p> 
                <p>【爱心金支出方向：】</p> 
                <p class="con">1、平台内【有病无钱医】的会员本人爱心救助；</p> 
                <p class="con">2、平台内【有病无处医】的会员本人爱心救助；</p> 
                <p class="con">3、平台内爱心会员医患纠纷法律援助；</p> 
                <p class="con">4、平台组织的其他爱心项目，如慰问敬老院等活动；</p> 
                <p>特别说明：爱心商城</p>

            </div>
        </van-popup>
        <van-toast id="van-toast" />
        
        <van-popup  :show="addressShow"  
                    position="bottom" >
            <van-picker :columns="addressList"
                        show-toolbar
                        title="请选择地址"
                        cancel-button-text="添加新地址" 
                        @cancel="onCancel"
                        @confirm="onConfirm"  />
        </van-popup>
    </div>
</template>
<script>
import axios from '../../utils/request.js'
import {imgBaseUrl} from '../../utils/common.js'
import Toast from '../../../static/vant/toast/toast';
import store from '../../store'
import navbar from '../../components/navbar'
export default {
    data(){
        return{
            imgBaseUrl:imgBaseUrl,
            show:false,
            checkNum:1,
            donateList:[],
            checked:false,
            moneyList:[
                {
                    money:10,
                    content:'（定制版健呗高血压日常饮食宜忌表）'
                },
                {
                    money:15,
                    content:'（定制版健呗高血压日常饮食宜忌表+定制版健呗糖尿病日常饮食宜忌表）'
                },
                {
                    money:20,
                    content:'（定制版健呗食物血糖生成指数表）'
                },
                {
                    money:25,
                    content:'（定制版健呗食物血糖生成表+定制版健呗高血压日常饮食宜忌表）'
                },
                {
                    money:30,
                    content:'（定制版健呗高血压、糖尿病日常饮食宜忌表+健呗血糖生成指数表）'
                }
            ],
            current:null,
            formData:{
                transactionMoney:null
            },
            publicAccountMoney:null,
            seeShow:false,
            imgList:'',
            addressShow:false,
            addressList:[],
            addressData:[],
            addressInfo:'点击选择地址'
        }
    },
    components: {
        navbar
    },
    methods:{
        getDonate(){
            axios({
                url:'api/public/getNewPublicTransactionList',
                method:'get'
            }).then( res => {
                console.log(res);
                if(res.data.code ==1){
                    if(res.data.data && res.data.data.length > 0){
                        this.donateList = res.data.data.map( item => {
                            item.nickName = item.nickName.slice(0,1)+'**';
                            return item;
                        } );
                    }
                }
            } )
        },
        // 获取公益金额
        getPublicAccountMoney(){
            axios({
                url:'api/index/getPublicAccountMoney',
                method:'get'
            }).then( res => {
                if(res.data.code ==1){
                    this.publicAccountMoney = res.data.data.money;
                }
            } )
        },
        showDonate(){
            this.show = true;
        },
        onChange(event){
            this.checked = !this.checked;
        },
        onClose(){
            this.show = false;
        },
        getMoney(data,index){
            this.formData.transactionMoney = data;
            this.current = index;
        },
        // changeMoney(event){
        //     this.formData.transactionMoney = Number(event.mp.detail.value);
        //     this.current = null;
        // },
        async donate(){
            if(!this.formData.transactionMoney){
                Toast.fail('请选择购买的商品！');
                return;
            }
            if(!this.formData.addressId){
                Toast.fail('请选择收货地址！');
                return;
            }
            if(!this.checked){
                Toast.fail('请选择我同意');
                return;
            }
            this.formData.updateUserId = store.state.user.userInfo.id;
            console.log(Number(this.formData.transactionMoney))
            wx.showLoading({
                title: '支付中请稍后',
            })
            let code = null;
            let that = this;
            // 1.获取code
            await  new Promise( (resolve,reject) => {
                wx.login({
                    success: async res => {
                        // 获取到用户的 code 之后：res.code
                        console.log(res.code);
                        code = res.code;
                        resolve();
                    }
                });
            } )
            axios({
                url: 'api/weixinpay/getPublicSign?memberId='+store.state.user.userInfo.id+'&body=用户捐赠'+'&code='+code+'&total_fee='+this.formData.transactionMoney*100+'&addressId='+this.formData.addressId,
                method: 'get',
            }).then( res => { 
                const data = res.data.data;
                console.log(res)
                wx.hideLoading();
                // 3.调取二维码支付
                wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: 'MD5',
                    paySign: data.paySign,
                    success (res) { 
                        console.log(res);
                        if(res.errMsg == 'requestPayment:ok'){
                            Toast.success('捐赠成功！');
                            that.show = false;
                            that.getDonate();
                        }
                        // axios({
                        //     url:'api/public/addPublicTransaction',
                        //     method:'post',
                        //     data:that.formData
                        // }).then( res => {
                        //     wx.hideLoading();
                        //     if(res.data.code ==1){
                        //         Toast.success('捐赠成功！');
                        //         that.show = false;
                        //         that.getDonate();
                        //     }
                        // } )
                        
                    },
                    fail (res) { 
                        wx.showModal({
                            title: '提示',
                            content: '付款失败，请重新支付！',
                        })
                    }
                })
            } ).catch( err => {
                console.log(err);
                wx.showModal({
                    title: '提示',
                    content: '付款失败，请重新支付！',
                })
                reject(err);
            } )
        },
        // 查看详细
        seeClick(){
            this.seeShow = true;
        },
        onSeeClose(){
            this.seeShow = false;
        },
        async GetImg(){
            await axios({
                url:'api/index/getAllPicture?type=2',
                method:'get'
            }).then( res => {
                    console.log(res)
                if(res.data.code ==1){
                    this.imgList = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(res.data.data[0].imgUrl);
                }
            } )
        },
        async addressClick(){
            await this.GetAddress();
        },
        async GetAddress(){
            // 获取收获地址
            await new Promise( (resolve,reject) => {
                axios({
                        url:'api/personal/getMemberReceiveAddressList?memberId='+store.state.user.userInfo.id,
                        method:'GET'
                    }).then( res => {
                        console.log(res.data.code == 1 , res.data.data.length >= 1,'');
                        if(res.data.code == 1 && res.data.data.length >= 1){
                            this.boolBuy = true
                            this.addressShow = true;
                            this.addressData = res.data.data;
                            this.addressList = res.data.data.map( item => {
                                return item.receiveAddress;
                            } )
                            this.addressShow = true;
                        } else {
                            Toast({
                                type: 'fail',
                                message: '没有收货地址，请添加',
                                onClose: () => {
                                    mpvue.navigateTo({ url:'../addressAdd/main?type=donate'});
                                }
                            });
                        }
                        resolve();
                    } )
            } )
        },
        onConfirm(value){
            this.formData.addressId = this.addressData[value.mp.detail.index].id;
            this.addressInfo = this.addressData[value.mp.detail.index].receiveAddress;
            this.addressShow = false;
        },
        onCancel(){
            mpvue.navigateTo({ url:'../addressAdd/main?type=donate'});
            this.addressShow = false;
        }
    },
    mounted(){
        this.getDonate();
    },
    onShow(){
        this.show = false;
        this.getPublicAccountMoney();
        this.GetImg();
        this.getDonate();
    }
}
</script>
<style lang="less" scoped>
page{
    height: 100%;
}
.donate-box{
    height: 100%;
    background-color: #f2f2f2;
    padding-bottom: 100px;
}
.donate-content{
    width: 345px;
    background-color: #fff;
    margin: 0 auto;
    overflow: hidden;
    margin-top: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
}
.donate-show{
    width: 345px;
    .title{
        font-size: 16px;
        line-height: 50px;
        padding: 0 10px;
        span{
            font-size: 14px;
        }
    }
    .checked-box{
        overflow: hidden;
        .two{
            color: #000;
            font-size: 14px;
            float: left;
        }
    }
    .con{
        padding: 0 10px;
        font-size: 14px;
        margin-bottom: 10px;
    }
    /deep/ van-checkbox{
        float: left;
        font-size: 14px;
        .one{
            color: #b8dfec;
        }
    }
    ul{
        overflow: hidden;
        padding: 0 10px;
        li{
            float: left;
            width: 305px;
            text-align: left;
            padding: 5px 5px;
            border:1px solid rgba(228, 228, 228, 1);
            color: #FF9900;
            margin-right: 5px;
            font-size: 13px;
            margin-bottom: 5px;

            &:last-child{
                margin-right: 0;
            }
            &.current{
                border-color: #FF9900;
            }
        }
    }
    .address{
        padding: 5px 10px;
        font-size: 14px;
        color: #333;
    }
    .ipt-box{
        font-size: 14px;
        border:1px solid #f2f2f2;
        width: 165px;
        height: 33px;
        overflow: hidden;
        margin: 10px 0;
        margin-left: 10px;
        line-height: 33px;
        input{
            float: left;
            width: 140px;
            height: 33px;
            padding-left: 5px;
        }
        span{
            float: left;
        }
    }
    .tips{
        font-size: 14px;
        color: #333;
        margin-left: 10px;
    }
}
.see-box{
    background-color: #fff;
    width: 325px;
    margin: 0 auto;
    height: 475px;
    padding: 10px;
    p{
        font-size: 14px;
    }
    .con{
        padding-left: 5px;
    }
}
.img{
    width: 332px;
    height: 190px;
    margin: 0 auto;
    margin-top: 10px;
    border-radius: 10px;
    position: relative;
    img{
        width: 332px;
        height: 190px;
    }
}
.donate-money{
    border-bottom: 1px solid #f2f2f2;
    .money{
        font-size: 22px;
        color: rgba(255, 153, 1, 1);
        text-align: center;
        margin-top: 10px;
        font-weight: bold;
    }
    .title{
        font-size: 14px;
        color: rgba(0, 0, 0, 1);
        text-align: center;
        margin-bottom: 10px;
    }
}
.checked-box{
    margin:10px 0;
        margin-left: 10px;
    /deep/ .van-radio__label{
        color: red;
        font-size: 14px;
    }
}
.donate-sure{
    height: 45px;
    line-height: 45px;
    text-align: center;
    background-color: rgba(255, 153, 0, 1);
    color: #fff;
}
.donate-btn{
    padding: 20px 0;
    border-bottom: 1px solid #f2f2f2;
    .btn{
        margin: 0 auto;
        height: 40px;
        line-height: 40px;
        width: 294px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        background-color: rgba(255, 153, 0, 1);
        border-radius: 20px;
    }
}
.donate-con{
    font-size: 14px;
    color: rgba(141, 141, 141, 1);
    line-height: 20px;
    padding: 10px 20px;
}
.donate-list{
    width: 345px;
    background-color: #fff;
    margin: 0 auto;
    overflow: hidden;
    margin-top: 10px;
    border-radius: 5px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
    margin-bottom: 60px;
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
        li{
            padding-left: 20px;
            overflow: hidden;
            p{
                float: left;
                width: 40%;
                font-size: 14px;
                text-align: left;
                color: rgba(0, 0, 0, 1);
                &:first-child{
                    width: 20%;
                }
            }
        }
    }
}
.footer-box{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 45px;
    line-height: 45px;
    font-size: 16px;
    font-weight: bold;
    color: rgba(255, 173, 52, 1);
    text-align: center;
    border-top: 1px solid #f2f2f2;
    background-color: #fff;
}
</style>