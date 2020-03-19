<template>
    <div class="rescue-box">
        <navbar :title="'救助申请'"></navbar>
        <div class="content">
            <p class="con">申请救助的说明文本、介绍或吸引用户的文本在这里</p>
            <div class="form-box">
                <p class="title">申请救助人信息</p>
                 <van-cell-group>
                    <van-field
                        label="姓名："
                        placeholder="申请人的姓名"
                        required="true"
                        :value="formData.applyName"
                        :error-message="error.errorName"
                        @input="applyName"
                    />
                    <van-field
                        label="联系方式："
                        placeholder="申请人或直系亲属联系电话"
                        required="true"
                        :value="formData.applyPhone"
                        :error-message="error.errorPhone"
                        @input="applyPhone"
                    />
                    <div class="list">
                        <p> <span style="color:red;">*</span>上传凭证： </p>
                        <van-uploader :file-list="fileListArray" @delete="deleteImg"  @afterRead="afterRead"  />
                    </div>
                    <p style="clear:both;"></p>
                    <p class="tips">身份证、医院诊断说明、其他合法能证明身份及经济状况等的文件，如村委会或居委会的证明。</p>
                    <p class="p-title">情况说明：</p>
                    <textarea @input="remark" placeholder="请按实际描述，如与事实不符将中止救助。（限500字内）"></textarea>
                </van-cell-group>
            </div>
            <div class="btn-box">
                <p class="btn-p" @click="application">立即申请</p>
            </div>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import axios from '../../utils/request.js'
import store from '../../store'
import Toast from '../../../static/vant/toast/toast';
import {imgBaseUrl} from '../../utils/common.js'
import navbar from '../../components/navbar'
export default {
    data(){
        return{
            formData:{

            },
            error:{
                errorName:'',
                errorPhone:''
            },
            allowSub:false,
            imgBaseUrl:imgBaseUrl,
            fileListArray:[],
            delFileList:[]
        }
    },
    components: {
        navbar
    },
    methods:{
        applyName(value){
            if(value.mp.detail == ''){
                this.error.errorName = '请输入姓名'
            } else {
                this.error.errorName = '';
                this.formData.applyName = value.mp.detail;
            }
        },
        applyPhone(value){
            const retTel =  /^1[3456789]\d{9}$/;
            if(!retTel.test(value.mp.detail)){
                this.error.errorPhone = '电话有误，请重新输入！'
            } else {
                this.error.errorPhone = '';
                this.formData.applyPhone = value.mp.detail;
            }
        },
        remark(value){
            this.formData.remark = value.mp.detail;
        },
        afterRead(event){
            console.log(event.mp.detail)
            const { file } = event.mp.detail;
            const _this = this;
            // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
            wx.uploadFile({
                url: this.imgBaseUrl+'api/service/upload/uploadImage', 
                filePath: file.path,
                name: 'file',
                success(res)  {
                    // 上传完成需要更新 fileList
                    _this.fileListArray.push({ ...file, url: imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(JSON.parse(res.data).data) });
                    _this.delFileList.push({ ...file, url: JSON.parse(res.data).data });
                }
            });
        },
        deleteImg(event){
            axios({
                    url: 'api/service/upload/deleteImg',
                    method: 'post',
                    data:{
                        "imgUrl":this.delFileList[event.mp.detail.index].url
                    }
                }).then( data => {
                    if(data.data.code == 1){
                        this.fileListArray.splice(event.mp.detail.index,1);
                        this.delFileList.splice(event.mp.detail.index,1);
                        Toast.success({
                                mask: false,
                                message: '删除成功',
                            });
                        }
                    } )
        },
        application(){
            this.formData.memberId = store.state.user.userInfo.id;
            const tempUrl = [];
            this.fileListArray.forEach(item => {
                tempUrl.push(item.url);
            })
            this.formData.imgUrl = tempUrl?tempUrl.join('||'):'';
            if(!this.formData.remark){
                Toast.fail('请填写情况说明');
                return;
            }
            if(!this.formData.imgUrl){
                Toast.fail('请上传附件');
                return;
            }
            if(this.formData.applyName != undefined && this.formData.applyPhone != undefined){
                wx.showLoading({
                    title: '加载中',
                })
                axios({
                    url: 'api/public/addMemberApplyRescue',
                    method: 'post',
                    data:this.formData
                }).then( data => {
                    wx.hideLoading();
                    if(data.data.code == 1){
                        Toast.success({
                            mask: false,
                            message: '新增成功',
                            onClose: () => {
                                console.log(5555)
                                mpvue.switchTab({ url:'../index/main' })
                            }
                        });
                        }
                    } )
            }
            
        }
    },
    mounted(){

    }
}
</script>
<style lang="less" scoped>
/deep/ page{
    height: 100%;
}
.rescue-box{
    height: 100%;
    .content{
        width: 345px;
        background-color: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
        margin:  10px auto;
        border-radius: 5px;
        overflow: hidden;
        .con{
            padding: 10px;
            font-size: 14px;
            min-height: 80px;
            border-bottom: 2px solid #f2f2f2;
            color: #868686FF;
        }
    }
    .form-box{
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
        .list{
            margin:10px;
            p{
                float: left;
                font-size: 14px;
                color: #333;

            }
            van-uploader{
                float: left;
                margin-left: 18px;
                width: 230px;
            }
        }
        .tips{
            font-size: 13px;
            color: #868686FF;
            margin:0 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f2f2f2;
            line-height: 20px;
        }
        .p-title{
            padding-left:10px;
            font-size: 14px;
            height: 40px;
            line-height: 40px;
            color: #333;

        }
        textarea{
            width: 305px;
            height: 120px;
            border:1px solid rgba(245, 245, 245, 1);
            margin: 0 auto;
            font-size: 14px;
            color: rgba(134, 134, 134, 1);
            padding: 10px;
        }
        /deep/ textarea{
            min-height: 100px;
            padding-top: 5px;
        }
    }
    .btn-box{
        overflow: hidden;
        text-align: center;
        height: 40px;
        line-height: 40px;
        width: 240px;
        background-color: rgba(255, 173, 52, 1);
        border-radius: 20px;
        margin:  20px auto;
    }
    .btn-p{
        font-size: 16px;
        color: #fff;
        font-weight: 600;
    }
}
</style>