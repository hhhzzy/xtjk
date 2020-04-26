<template>
    <div class="mine-info-box">
        <navbar :backVisible="true" :title="'我的'" ></navbar>
        <van-cell-group>
            <van-field
                label="昵称："
                :value="userInfo.nickName"
                readonly
                placeholder="请输入昵称"
            />
            <van-field
                label="姓名："
                :value="userInfo.nickName"
                readonly
                placeholder="请输入姓名"
            />
            <van-field
                label="性别："
                readonly
                :value="userInfo.sex"
                @click="showSexPopup"
                placeholder="请选择性别"
            />
            <van-field
                center
                clearable
                label="手机号"
                :value="userInfo.memberPhone"
                placeholder="请输入手机号"
                use-button-slot
            >
                <van-button slot="button" size="small" type="primary" custom-class="button">更换手机</van-button>
             </van-field>
            <van-field
                label="收货地址："
                icon="arrow"
                readonly
                :value="address.receiveAddress"
                @click="gotoAddress"
                placeholder="请添加收货地址"
            />
        </van-cell-group>
        <!-- 性别弹窗 -->
        <van-popup  :show="sexShow"  
                    position="bottom" 
                    @close="closeSexPopup">
            <van-picker :columns="sex"
                        show-toolbar
                        title="选择性别" 
                        @cancel="onCancel"
                        @confirm="onConfirm"  />
        </van-popup>
    </div>
</template>
<script>
import axios from '../../utils/request.js'
import store from '../../store'
import navbar from '../../components/navbar'
export default {
    data(){
        return{
            userInfo:{},
            sex:['男','女'],
            sexShow:false,
            address:{
                receiveAddress:''
            }
        }
    },
    components: {
        navbar
    },
    methods:{
        showSexPopup(){
            this.sexShow = true;
        },
        onConfirm(event) {
            // const { picker, value, index } = event.detail;
            console.log(event.target.value)
            this.sexShow = false;
        },
        onCancel(){
            this.sexShow = false;
        },
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
        gotoAddress(){
            mpvue.navigateTo({ url:'../addressList/main' })
        },
        GetAddress(){
            axios({
                url:'api/personal/getMemberReceiveAddressList?memberId='+store.state.user.userInfo.id,
                method:'GET'
            }).then( res => {
                if(res.data.code == 1 && res.data.data.length >= 1){
                    res.data.data.forEach(item => {
                        if(item.isDefault == 1) {
                            this.address.receiveAddress = item.receiveAddress;
                        }
                    });
                }
            } )
        }
    },
    onShow(){
        this.address.receiveAddress = '';
        this.getUserInfo();
        this.GetAddress();

    }
}
</script>
<style lang="less" scoped>
/deep/ .van-cell__title{
    color: #000000;
    font-weight: bold;
    font-size: 15px;
}
</style>