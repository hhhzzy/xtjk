<template>
    <div class="donate-box">
        <navbar :title="'公益捐赠'"></navbar>
        <div class="donate-content">
            <div class="img"> 
                <img :src="imgList" alt="">
            </div>
            <div class="donate-money">
                <p class="money">
                    {{publicAccountMoney / 1000}}
                </p>
                <p class="title">公益金总额（元）</p>
            </div>
            <div class="donate-btn">
                <p class="btn" @click="showDonate">爱心捐赠</p>
            </div>
            <div class="donate-con">
                捐赠说明文本、介绍或吸引用户的文本在这里。
            </div>
        </div>
        <div class="donate-list">
            <p class="title">最新捐赠播报</p>
            <ul>
                <li v-for="(item,index) in donateList" :key="index">
                    <p>{{item.nickName}}</p>
                    <p>捐赠{{item.transactionMoney}}</p>
                    <p>{{item.createTime}}</p>
                </li>
            </ul>
        </div>
        <div class="footer-box">
            <a href="../donateList/main" class="my-p">我的捐赠</a>
        </div>
        <van-popup :show="show" closeable @close="onClose">
            <div class="donate-show">
                <p class="title">
                    爱心捐赠 <span>让公益成为一种习惯</span>
                </p>
                <ul class="money">
                    <li :class="current == index?'current':''" @click="getMoney(item,index)" v-for="(item,index) in moneyList" :key="index">{{item}}元</li>
                </ul>
                <div class="ipt-box">
                    <input type="number" placeholder="自定义金额" @change="changeMoney">
                    <span>元</span>
                </div>
                <p class="tips">*不可低于10元</p>
                <div class="checked-box">
                    <van-checkbox icon-size="16px"   shape="square"  checked-color="#07c160" :value="checked" @change="onChange">
                        我同意<span class="one">《公益捐助》</span>规则，
                    </van-checkbox>
                    <a class="two" @click="seeClick">点此查看>></a>
                </div>
                <div class="donate-sure" @click="donate">确定捐赠</div> 
            </div>
        </van-popup>
        <van-popup :show="seeShow" closeable @close="onSeeClose">
            <div class="see-box"></div>
        </van-popup>
        <van-toast id="van-toast" />
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
            moneyList:[10,20,30,40,50],
            current:null,
            formData:{
            },
            publicAccountMoney:null,
            seeShow:false,
            imgList:''
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
        changeMoney(event){
            this.formData.transactionMoney = Number(event.mp.detail.value);
            this.current = null;
        },
        donate(){
            if(!this.checked){
                Toast.fail('请选择我同意');
                return;
            }
            if(this.formData.transactionMoney <10){
                Toast.fail('不能小于10元');
                return;
            }
            this.formData.updateUserId = store.state.user.userInfo.id;
            axios({
                url:'api/public/addPublicTransaction',
                method:'post',
                data:this.formData
            }).then( res => {
                if(res.data.code ==1){
                   Toast.success('捐赠成功！');
                   this.show = false;
                   this.getDonate();
                }
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
    },
    mounted(){
        this.getDonate();
    },
    onShow(){
        this.getPublicAccountMoney();
        this.GetImg();
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
    overflow: hidden;
    padding-bottom: 60px;
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
            width: 59px;
            height: 33px;
            text-align: center;
            line-height: 33px;
            border:1px solid rgba(228, 228, 228, 1);
            color: #FF9900;
            margin-right: 5px;

            &:last-child{
                margin-right: 0;
            }
            &.current{
                border-color: #FF9900;
            }
        }
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
    width: 345px;
    margin: 0 auto;
    height: 500px;
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
    line-height: 30px;
    height: 30px;
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
                width: 33%;
                font-size: 14px;
                text-align: left;
                color: rgba(0, 0, 0, 1);
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