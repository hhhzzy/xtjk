<template>
    <div class="mine-box">
        <navbar :backVisible="true" :title="'地址管理'" ></navbar>
        <van-cell-group>
            <van-field
                label="姓名："
                v-model="address.receiveName"
                placeholder="请输入姓名"
                required="true"
                :error-message="error.errorName"
                @input="testName"
            />
            <van-field
                center
                clearable
                label="手机号"
                :value="address.receivePhone"
                placeholder="请输入手机号"
                @input="testTel"
                :error-message="error.errorTel"
                required="true"
            >
             </van-field>
            <van-field
                label="收货地址："
                :value="address.receiveAddress"
                placeholder="请填写详细地址信息"
                required="true"
                :error-message="error.errorAddress"
                @input="testAddress"
            />
            <van-field
                label="是否默认地址："
                readonly
                :value="address.default"
                @click="isDefaultPopup"
                placeholder="请选择是否默认地址"
            />
        </van-cell-group>
        <div class="footer-box">
            <div class="edit-box" v-if="type=='edit'">
                <p class="del-p" @click="delAddress">删除</p>
                <p class="save-p" @click="saveAddress">保存</p>
            </div>
            <div class="save-box" v-if="type=='add' || type=='formula' || type=='online' || type == 'donate'">
                <p class="save-p" @click="saveAddress">保存</p>
            </div>
        </div>
        <!-- 是否默认弹窗 -->
        <van-popup  :show="isDefaultShow"  
                    position="bottom" 
                    @close="closeDefaultPopup">
            <van-picker :columns="isDefault"
                        show-toolbar
                        title="选择是否默认地址" 
                        @cancel="onCancel"
                        @confirm="onConfirm"  />
        </van-popup>
        <van-toast id="van-toast" />
        <van-dialog id="van-dialog" />
    </div>
</template>
<script>
import axios from '../../utils/request.js'
import store from '../../store'
import Toast from '../../../static/vant/toast/toast';
import navbar from '../../components/navbar'
import Dialog from '../../../static/vant/dialog/dialog';
export default {
    data(){
        return{
            address:{
                default:'是',
                receiveName:''
            },
            isDefault:['是','否'],
            isDefaultShow:false,
            type:'', // 判断是新增还是编辑
            error:{
                errorTel:'',//
                errorName:'',
                errorAddress:''
            },
            id:null,
            option:{}
        }
    },
    components: {
        navbar
    },
    methods:{
        isDefaultPopup(){
            this.isDefaultShow = true;
        },
        onConfirm(event) {
            // const { picker, value, index } = event.detail;
            console.log(event.target.value)
            this.isDefaultShow = false;
            this.address.default = event.target.value;
        },
        onCancel(){
            this.isDefaultShow = false;
        },
        // 获取用户信息
        getUserInfo(){
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
                console.log(this.userInfo)
            } )
        },
        // 新增地址
        saveAddress(){
            this.address.memberId = String(store.state.user.userInfo.id);
            this.address.isDefault = this.address.default == '是'? 1 : 0;
            this.address.id = this.id?this.id:'';
            console.log(this.address)
            if(!this.address.receivePhone || !this.address.receiveAddress){
                Toast.fail('以上数据请必填');
                return;
            }
            axios({
                url: 'api/personal/insertOrUpdateReceiveAddress',
                method: 'post',
                data:this.address
            }).then( data => {
                console.log(data,'555555')
                if(data.data.code == 1){
                    Toast.success({
                        mask: false,
                        message: '提交成功',
                        onClose: () => {
                            if(this.type == 'formula'){
                                wx.navigateBack();
                                // mpvue.navigateTo({ url:'../formulaInfo/main?id='+this.option.formulaId })
                            }
                            else if(this.type == 'online'){
                                wx.navigateBack();
                                // mpvue.navigateTo({ url:'../onlineFormula/main' })
                            }else if(this.type == 'donate'){
                                wx.navigateBack();
                            } else {
                                wx.navigateBack();
                            }
                        }
                    });
                }
            } )
        },
        testTel(value){
            const retTel =  /^1[3456789]\d{9}$/;
            if(!retTel.test(value.mp.detail)){
                this.error.errorTel = '电话有误，请重新输入！'
            } else {
                this.error.errorTel = '';
            }
            this.address.receivePhone = value.mp.detail;
        },
        testName(value){
            if(value.mp.detail == ''){
                this.error.errorName = '请输入昵称！'
            } else {
                this.error.errorName = '';
            }
            this.address.receiveName = value.mp.detail;
        },
        testAddress(value){
            if(value.mp.detail == ''){
                this.error.errorAddress = '请输入地址！'
            } else {
                this.error.errorAddress = '';
            }
            this.address.receiveAddress = value.mp.detail;
        },
        // 获取地址
        GetAddress(value){
            axios({
                url: 'api/personal/getMemberReceiveAddressList?memberId='+store.state.user.userInfo.id,
                method: 'get',
            }).then( data => {
                if(data.data.code == 1){
                    data.data.data.forEach(item => {
                        if(item.id == value){
                            this.address = item;
                        } 
                    });
                    this.address.default = this.address.isDefault == 1?'是':'否';
                    console.log(this.address,'7777')
                }
            } )
        },
        // 删除地址
        delAddress(){
            if(!this.id){
                return;
            }
            Dialog.confirm({
                title: '提示',
                message: '是否删除该收货地址？删除后不可恢复！'
            })
            .then(() => {
                axios({
                    url: 'api/personal/deleteAddress?memberId='+store.state.user.userInfo.id+'&receiveAddressId='+this.id,
                    method: 'get',
                }).then( data => {
                   Toast({
                        type: 'success',
                        message: '删除成功',
                        onClose: () => {
                            wx.navigateBack();
                        }
                    });
                } )
            })
        }
    },
    mounted(){
    },
    onLoad(option){
        console.log(option)
        this.type = option.type;
        this.id = option.id;
        if(this.id){
            this.GetAddress(this.id);
        }
        this.option = option;
    },
    onShow(){
        this.address = {
                default:'是',
                receiveName:''
            },
        this.getUserInfo();
    }
}
</script>
<style lang="less" scoped>
.footer-box{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    width: 100%;
    .edit-box{
        width: 100%;
        overflow: hidden;
        width: 375px;
        p{
            width: 50%;
            text-align: center;
        }
        .del-p{
            float: left;
            background-color: rgb(204, 204, 204);
            color: #fff;
        }
        .save-p{
            float: right;
            background: -webkit-linear-gradient(top,#82F4A3,#4CDBC5); /* Safari 5.1-6.0 */
            background: -o-linear-gradient(bottom,#82F4A3,#4CDBC5); /* Opera 11.1-12.0 */
            background: -moz-linear-gradient(bottom,#82F4A3,#4CDBC5);/* Firefox 3.6-15 */
            background: linear-gradient(to bottom,#82F4A3,#4CDBC5); /* 标准语法 */
            color: #fff;
        }
    }
    .save-box{
        p{
            width: 100%;
            text-align: center;
            color: #fff;
            background: -webkit-linear-gradient(top,#82F4A3,#4CDBC5); /* Safari 5.1-6.0 */
            background: -o-linear-gradient(bottom,#82F4A3,#4CDBC5); /* Opera 11.1-12.0 */
            background: -moz-linear-gradient(bottom,#82F4A3,#4CDBC5);/* Firefox 3.6-15 */
            background: linear-gradient(to bottom,#82F4A3,#4CDBC5); /* 标准语法 */
        }
    }
}
</style>