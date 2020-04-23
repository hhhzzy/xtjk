<template>
<div>
    <view v-if="canIUse">
        <div v-if="!boolLogin">
            <view class='content'>
                <view>申请获取以下权限</view>
                <text>获得你的公开信息(昵称，头像等)</text>
            </view>
            <button class='bottom' type='primary' open-type="getUserInfo" @getuserinfo="bindGetUserInfo">点击授权</button>
        </div>
        <view v-else class="page">
            <view class="weui-form">
            <view class="weui-form__text-area">
                <view class="weui-form__title">用户登录</view>
            </view>
            <view class="weui-form__control-area">
                <view class="weui-cells__group weui-cells__group_form">  
                    <view class="weui-cells weui-cells_form">
                        <view class="weui-cell">
                            <view class="weui-cell__hd"><label class="weui-label">手机号</label></view>
                            <view class="weui-cell__bd">
                                <input class="weui-input" type="number" v-model="telphone" @input="testTel" pattern="[0-9]*" placeholder="请输入手机号"/>
                            </view>
                        </view>
                        <view class="weui-cell">
                            <view class="weui-cell__hd"><label class="weui-label">验证码</label></view>
                            <view class="weui-cell__bd">
                                <input class="weui-input" type="number" v-model="telCode" pattern="[0-9]*" placeholder="请输入验证码"/>
                            </view>
                            <view class="weui-cell__ft">
                                <button v-if="boolYzm" class="weui-btn weui-btn_default weui-vcode-btn"  @click="GetCode">{{yzmText}}</button>
                                <button v-else class="weui-btn weui-btn_default weui-vcode-btn no-sub" >{{yzmText}}</button>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
          
            <view class="weui-form__opr-area sub-btn">
                <button open-type="getPhoneNumber" @bindgetphonenumber="getPhoneNumber">登录</button>
                <!-- <van-button type="primary" size="large"  @click="GoLogin()">登录</van-button> -->
            </view>
            </view>
        </view>
    </view>

    <view v-else>
        <h5>请升级微信</h5>
    </view>
    <van-toast id="van-toast" />
</div>
</template>
<script>
import axios from '../../utils/request.js'
import { mapActions,mapGetters  } from 'vuex'
import Toast from '../../../static/vant/toast/toast'
import { resolve } from 'url'
import { rejects } from 'assert'
import { clearInterval } from 'timers'
export default {
    data(){
        return{
            canIUse: wx.canIUse('button.open-type.getUserInfo'),
            boolLogin:false,
            userInfo: {},
            telphone:'',
            telCode:'', // 验证码
            info:{},
            code:'', // 微信返回的code
            yzmText:'获取验证码',
            timer:null,
            boolYzm:false
        }
    },
    computed:{
        ...mapGetters ({
            token:'token'
        })
    },
    methods:{
        bindGetUserInfo(res) {
            console.log(res.mp.detail)
            this.userInfo = res.mp.detail.rawData?JSON.parse(res.mp.detail.rawData):'';
            if (res.mp.detail.rawData){
                //用户按了允许授权按钮
                this.allowLogin();
                console.log('用户按了允许授权按钮')
            } else {
                //用户按了拒绝按钮
                console.log('用户按了拒绝按钮')
            }
        },
        ...mapActions({
            login:'user/login'
        }),
        // 允许登录
        allowLogin(){
            wx.login({
                success: async res => {
                    // 获取到用户的 code 之后：res.code
                    console.log(res.code);
                    console.log(this.userInfo)
                    this.code = res.code;
                    wx.setStorageSync('code', this.code);
                    // 可以传给后台，再经过解析获取用户的 openid
                    // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                    this.info = {
                            nickName:this.userInfo.nickName,
                            sex:this.userInfo.gender == 1?'男':'女',
                            parentMemberId: wx.getStorageSync('parentMemberId')?wx.getStorageSync('parentMemberId'):'',
                            imgUrl:this.userInfo.avatarUrl,
                    }
                    // 获取openid
                    // const appid = 'wxd81d6b44c20f7e1f';
                    // const secret = '90b0268e365267167154827e401b2130';
                    // await new Promise( (resolve,reject) => {
                    //     wx.request({
                    //         url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + this.code + '&grant_type=authorization_code',
                    //         data: {},
                    //         header: {
                    //             'content-type': 'json'
                    //         },
                    //         success:  (res) => {
                    //             this.info.appId = res.data.openid;
                    //             resolve();
                    //         }
                    //     })
                    // } )
                    this.info.appId = this.code;
                    // this.boolLogin = true;
                    await this.login(this.info)
                }
            });
        },
        
        getPhoneNumber(e){
            console.log(e.detail.errMsg)
            console.log(e.detail.iv)
            console.log(e.detail.encryptedData)
        },
        // 登录
        async GoLogin(){
            this.info.memberPhone = this.telphone;
            this.info.code = Number(this.telCode);
            if(!this.telphone){
                Toast.fail('请输入手机号')
                return;
            }
            if(!this.telCode){
                Toast.fail('请输入验证码')
                return;
            }
            // 获取openid
            const appid = 'wxd81d6b44c20f7e1f';
            const secret = '90b0268e365267167154827e401b2130';
            await new Promise( (resolve,reject) => {
                wx.request({
                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + this.code + '&grant_type=authorization_code',
                    data: {},
                    header: {
                        'content-type': 'json'
                    },
                    success:  (res) => {
                        this.info.appId = res.data.openid;
                        resolve();
                    }
                })
            } )
            // openid失效重新授权获取
            if(!this.info.appId){
                Toast({
                    type: 'fail',
                    message: '授权失效，请重新授权',
                    onClose: () => {
                        this.boolLogin= false;
                    }
                });
                return;
            }
            console.log(this.info)
            await this.login(this.info)
            wx.removeStorageSync('parentMemberId');
        },
        testTel(value){
            if((/^1[3456789]\d{9}$/.test(value.mp.detail.value))){ 
                this.boolYzm = true;
            }else{
                this.boolYzm = false;
            }
        },
        // 获取验证吗
        GetCode(){
            if(!this.telphone){
                Toast.fail('请输入手机号')
                return;
            }
            let num = 60;
            axios({
                url:'api/getLoginCode?memberPhone='+this.telphone,
                method:'get'
            }).then( res => {
                if(res.data.code ==1){
                    Toast.success(res.data.msg);
                    this.timer = setInterval(() => {
                        num--;
                        this.yzmText = '已发送（'+num+'）';
                        if(num == 0){
                            clearTimeout(this.timer);
                            this.boolYzm = true;
                            this.yzmText="获取验证码";
                        }
                    }, 1000);
                    this.boolYzm = false;
                } else {
                    Toast.fail(res.data.msg)
                }
            } )
            
        }
        
    },
    mounted(){
        wx.checkSession({
    　　　　success: function(res){
    　　　　　　 console.log(wx.getStorageSync('token'),"处于登录态");
                //用户已经授权过
                // if(wx.getStorageSync('token')){
                //     mpvue.switchTab({ 
                //         url: '../index/main'
                //     })
                // }
    　　　　},
    　　　　fail: (res) =>{
                wx.removeStorageSync('token')
    　　　　　　 console.log("需要重新登录");
    　　　　}
    　　})
        // wx.getSetting({
        //     success: (res) => {
        //         if (res.authSetting['scope.userInfo']) {
        //             wx.getUserInfo({
        //                 success: function(res) {
        //                     // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
        //                     // 根据自己的需求有其他操作再补充
        //                     // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
        //                     wx.login({
        //                         success: res => {
        //                             // 获取到用户的 code 之后：res.code
        //                             console.log("用户的code:" + res.code);
                                    
        //                         }
        //                     });
        //                 }
        //             });
        //         } else {
        //             // 用户没有授权
        //             // 改变 isHide 的值，显示授权页面
                    
        //         }
        //     }
        // });
    }
}
</script>
<style lang="less" scoped>
.header image {
    width: 200rpx;
    height: 200rpx;
}

.content {
    margin-left: 50rpx;
    margin-bottom: 90rpx;
    margin-top: 80px;
}

.content text {
    display: block;
    color: #9d9d9d;
    margin-top: 40rpx;
}

.bottom {
    border-radius: 80rpx;
    margin: 70rpx 50rpx;
    font-size: 35rpx;
}
.page{
    background-color: #EDEDED;
    font-size: 16px;
    font-family: -apple-system-font,Helvetica Neue,Helvetica,sans-serif;
}
.page__hd {
    padding: 40px;
}
.page__bd {
    padding-bottom: 40px;
}
.page__bd_spacing {
    padding-left: 15px;
    padding-right: 15px;
}

.page__ft{
    text-align: center;
    padding:0 0 10px;
    padding:0 0 calc(10px + constant(safe-area-inset-bottom));
    padding:0 0 calc(10px + env(safe-area-inset-bottom));
}


.page__title {
    text-align: left;
    font-size: 20px;
    font-weight: 400;
}

.page__desc {
    margin-top: 5px;
    color: #888888;
    text-align: left;
    font-size: 14px;
}
.weui-cell_example:before{
    left:52px;
}

.weui-label{
    font-size: 14px;
}
.weui-input{
    font-size: 14px;
}
.weui-cells_form{
    .weui-btn_default{
        font-size: 14px;
    }
}
.sub-btn{
    text-align: center;
    margin: 0 30px;
}
.no-sub{
    color: #ccc;
}
</style>
