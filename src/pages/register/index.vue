<template>
        <view class="page">
            <view class="weui-form">
            <view class="weui-form__text-area">
                <view class="weui-form__title">用户注册</view>
            </view>
            <view class="weui-form__control-area">
                <view class="weui-cells__group weui-cells__group_form">  
                    <view class="weui-cells weui-cells_form">
                        <view class="weui-cell">
                            <view class="weui-cell__hd"><label class="weui-label">手机号</label></view>
                            <view class="weui-cell__bd">
                                <input class="weui-input" type="number" pattern="[0-9]*" placeholder="请输入手机号"/>
                            </view>
                        </view>
                        <view class="weui-cell">
                            <view class="weui-cell__hd"><label class="weui-label">验证码</label></view>
                            <view class="weui-cell__bd">
                                <input class="weui-input" type="number" pattern="[0-9]*" placeholder="请输入验证码"/>
                            </view>
                            <view class="weui-cell__ft">
                                <button class="weui-btn weui-btn_default weui-vcode-btn">获取验证码</button>
                            </view>
                        </view>
                        <view class="weui-cell">
                            <view class="weui-cell__hd"><label class="weui-label">推荐人</label></view>
                            <view class="weui-cell__bd">
                                <input class="weui-input" type="number"  placeholder="请输入推荐人"/>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
          
            <view class="weui-form__opr-area sub-btn">
                <van-button type="primary" size="large" >注册</van-button>
            </view>
            </view>
        </view>
</template>
<script>
export default {
    data(){
        return{
            
        }
    }
}
</script>
<style lang="less">
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
</style>