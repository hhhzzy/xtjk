<template>
    <div class="formula-user-box">
        <navbar :backVisible="false" :title="'在线配方'"></navbar>
        <p class="tips">
           <img src="../../../static/images/notice.png" alt="">
            <span>不同的调理目的和身体素质将影响配方构成，请 如实告知。</span>
        </p>
        <div class="box">
            <p class="main-title">
                调理人信息
            </p>
            <div class="form-box">
                <van-cell-group>
                    <van-field
                        label="姓名："
                        @input="nameTest"
                        :value="formData.userName"
                        placeholder="请输入姓名"
                    />
                    <van-field
                        label="性别："
                        readonly
                        :is-link="true"
                        :value="formData.userSex"
                        :arrow-direction="right"
                        @click="showSexPopup"
                        placeholder="请选择性别"
                    />
                    <van-field
                        label="年龄："
                        :value="formData.userAge"
                        @input="ageTest"
                        placeholder="请输入年龄"
                    />
                    <van-field
                        label="身高："
                        :value="formData.userHeight"
                        @input="heightTest"
                        placeholder="请输入身高（cm）"
                    />
                    <van-field
                        label="体重："
                        @input="weightTest"
                        :value="weight"
                        placeholder="请输入体重（kg）"
                    />
                    <van-field
                        label="活动强度："
                        readonly
                        :value="formData.workText"
                        @click="showWorkPopup"
                        :is-link="true"
                        :arrow-direction="right"
                        placeholder="请选择活动强度"
                    />
                    <van-field
                        label="调理方向："
                        readonly
                        :value="formData.directionText"
                        :is-link="true"
                        :arrow-direction="right"
                        @click="showDirectionPopup"
                        placeholder="请选择调理方向"
                    />
                    <van-field
                        readonly
                        :value="formData.diabetesText"
                        :is-link="true"
                        :arrow-direction="right"
                        @click="showDiabetesPopup"
                        placeholder="请选择是否有糖尿病"
                    >
                    <van-button slot="label" size="small" type="primary">是否有糖尿病：<i>（包含以往病史）</i></van-button>
                    </van-field>
                    <van-field
                        label="个人体质："
                        readonly
                        :value="formData.bodyText"
                        :is-link="true"
                        :arrow-direction="right"
                        @click="showBodyPopup"
                        placeholder="请选择个人体质（可多选）"
                    >
                    </van-field>
                    <span class="form-tip">（请按自身体质检查，可多选）</span>
                    <a class="link" @click="gotoCp">不清楚体质，立即去测评>></a>
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
                <!-- 工作性质 -->
                <van-popup  :show="workShow"  
                            position="bottom" 
                            @close="closeWorkPopup">
                    <van-picker :columns="work"
                                show-toolbar
                                title="请选择活动强度" 
                                @cancel="onCancel"
                                @confirm="onWorkConfirm"  />
                </van-popup>
                <!-- 调理方向 -->
                <van-popup  :show="directionShow"  
                            position="bottom" 
                            @close="closeDirectionPopup">
                    <van-picker :columns="direction"
                                show-toolbar
                                title="请选择调理方向" 
                                @cancel="onCancel"
                                @confirm="onDirectionConfirm"  />
                </van-popup>
                <!-- 糖尿病 -->
                <van-popup  :show="diabetesShow"  
                            position="bottom" 
                            @close="closeDiabetesPopup">
                    <van-picker :columns="diabetes"
                                show-toolbar
                                title="选择是否有糖尿病" 
                                @cancel="onCancel"
                                @confirm="onDiabetesConfirm"  />
                </van-popup>
                <!-- 个人体质 -->
                <van-popup  :show="bodyShow"  
                            position="bottom" 
                            custom-style="height: 40%"
                            @close="closeBodyPopup">
                    <!-- <van-picker :columns="body"
                                show-toolbar
                                title="选择个人体质（可多选）" 
                                @cancel="onCancel"
                                @confirm="onBodyConfirm"  /> -->
                            <div class="picker-top">
                                <p class="cancel" @click="closeBodyPopup">取消</p>
                                <p class="title">选择个人体质（可多选）</p>
                                <p class="sure" @click="closeBodyPopup">确认</p>
                            </div>
                            <ul class="picker-ul"  >
                                <li v-for="(item,index) in bodyList" :key="index" @click="selectBody(item)" :class="[item.current?'current':'']">
                                    {{item.bodyTypeName}}
                                    <van-icon name="success" color="#4CDBC5" />
                                </li>
                            </ul>
                                
                </van-popup>
                
            </div>
        </div>
        <div class="footer-box">
            <p class="add-p" @click="goPf">获取专属配方</p>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import navbar from '../../components/navbar'
import axios from '../../utils/request.js'
import {imgBaseUrl} from '../../utils/common.js'
import Toast from '../../../static/vant/toast/toast';
import store from '../../store'
export default {
    data(){
        return{
		    imgBaseUrl:imgBaseUrl,
            sex:['男','女'],
            sexShow:false,
            workShow:false,
            work:[],
            workLList:[],
            directionShow:false,
            directionList:[],
            direction:[],
            diabetes:['没有','有'],
            diabetesShow:false,
            body:[],
            bodyList:[],
            bodyShow:false,
            formData:{
                bodyText:'',
                bodyTypeId:''
            },
            weight:null
        }
    },
    components: {
        navbar
    },
    methods:{
        // 性别
        closeSexPopup(){
            this.sexShow = false;
        },
        showSexPopup(){
            this.sexShow = true;
        },
        onConfirm(event) {
            this.formData.userSex = event.mp.detail.value;
            this.sexShow = false;
        },
        onCancel(){
            this.sexShow = false;
            this.workShow = false;
            this.directionShow = false;
            this.diabetesShow = false;
            this.bodyShow = false;
        },
        // 工作性质
        closeWorkPopup(){
            this.workShow = false;
        },
        showWorkPopup(){
            this.workShow = true;
        },
        onWorkConfirm(event){
            this.formData.workNatureId = this.workList[event.mp.detail.index].id;
            this.formData.workText = event.mp.detail.value;
            this.workShow = false;
        },
        // 调理方向
        closeDirectionPopup(){
            this.directionShow = false;
        },
        showDirectionPopup(){
            this.directionShow = true;
        },
        onDirectionConfirm(event){
            this.formData.condiDirectionId = this.directionList[event.mp.detail.index].id;
            this.formData.directionText = event.mp.detail.value;
            this.directionShow = false;
        },
        // 是否有糖尿病
        closeDiabetesPopup(){
            this.diabetesShow = false;
        },
        showDiabetesPopup(){
            this.diabetesShow = true;
        },
        onDiabetesConfirm(event){
            console.log(event)
            this.formData.isDiabetes = event.mp.detail.index;
            this.formData.diabetesText = event.mp.detail.value;
            this.diabetesShow = false;
        },
        // 个人体质
        closeBodyPopup(){
            this.bodyShow = false;
        },
        showBodyPopup(){
            this.bodyShow = true;
        },
        onBodyConfirm(event){
            if(this.formData.bodyText.indexOf(event.mp.detail.value) < 0){
                this.formData.bodyTypeId += (this.formData.bodyTypeId == ''?'':',') + this.bodyList[event.mp.detail.index].id
                this.formData.bodyText += (this.formData.bodyText == ''?'':',') + event.mp.detail.value;
            }
            this.bodyShow = false;
        },
        selectBody(item){
            if(!item.current){
                if(this.formData.bodyTypeId.indexOf(item.id) < 0 ){
                    this.formData.bodyTypeId += (this.formData.bodyTypeId == ''?'':',') +item.id;
                    this.formData.bodyText += (this.formData.bodyText == ''?'':',') + item.bodyTypeName;
                }
            } else{
                if(this.formData.bodyTypeId.indexOf(item.id) >= 0 ){
                    this.formData.bodyTypeId = this.formData.bodyTypeId.split(',').filter( data => data != item.id ).toString();
                    this.formData.bodyText = this.formData.bodyText.split(',').filter( data => data != item.bodyTypeName ).toString();
                } 
            }
            item.current = !item.current;
            this.bodyList = [...this.bodyList];
        },
        // 绑定年龄
        ageTest(event){
            this.formData.userAge = event.mp.detail;
        },
        // 绑定升高
        heightTest(event){
            this.formData.userHeight = event.mp.detail;
        },
        weightTest(event){
            this.formData.userWeight = Number(event.mp.detail) * 1000;
            this.weight = Number(event.mp.detail);
        },
        nameTest(event){
            this.formData.userName = event.mp.detail;
        },
        // 获取配方
        goPf(){
            if(!this.formData.userName || !this.formData.userSex ||!this.formData.userAge ||!this.formData.bodyTypeId
               ||!this.formData.userHeight ||!this.formData.userWeight ||!this.formData.workNatureId ||!this.formData.condiDirectionId){
                   Toast.fail('以上数据，请必填');
                    return;
            }
            axios({
                url:'api/recipe/addMemberRecipe',
                method:'POST',
                data:this.formData
            }).then( res => {
                if(res.data.code ==1){
                    if(res.data.data.length){
                        Toast({
                            type: 'success',
                            message: '配方获取成功',
                            onClose: () => {
                                wx.setStorageSync('formula',res.data.data);
                                wx.setStorageSync('formulaUser',this.formData);
                                mpvue.navigateTo({ url:'../onlineFormula/main'});
                            }
                        });
                    } else {
                        Toast({
                            type: 'fail',
                            message: '配方获取失败，请重新获取',
                            onClose: () => {
                                
                               
                            }
                        });
                        
                    }
                    
                }
            } )
        },
        gotoCp(){
            mpvue.switchTab({ url:'../physicReview/main' })
        }
    },
    async onShow(){
        // 获取用户信息
        this.formData.userName = store.state.user.userInfo.nickName;
        this.formData.memberId = store.state.user.userInfo.id;
        this.formData.userSex = store.state.user.userInfo.sex;
        // 获取工作性质
        axios({
                url:'api/recipe/queryWorkNatureList',
                method:'get'
            }).then( res => {
                if(res.data.code ==1){
                    this.workList = res.data.data;
                    res.data.data.forEach(item => {
                        this.work.push(item.natureName);
                    });;
                }
            } )
        // 获取调理方向
        axios({
                url:'api/recipe/queryCondiDirectionList',
                method:'get'
            }).then( res => {
                if(res.data.code ==1){
                    this.directionList = res.data.data;
                    res.data.data.forEach(item => {
                        this.direction.push(item.condiName);
                    });;
                }
            } )
        // 获取个人体质
        axios({
                url:'api/recipe/queryBodyTypeList',
                method:'get'
            }).then( res => {
                if(res.data.code ==1){
                    this.bodyList = res.data.data.map(item => {
                        item.current = false;
                        return item; 
                    });
                }
            } )
    }
}
</script>
<style lang="less" scoped>
    .tips{
        background-color: #ffffff;
        width: 345px;
        margin: 10px auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
        border-radius: 8px;
        height: 55px;
        padding-top: 15px;
        padding-right: 10px;
        overflow: hidden;
        img{
            width: 15px;
            height: 15px;
            margin-left: 16px;
            float: left;
            margin-right: 5px;
            margin-top: 3px;
        }
        span{
            width: 294px;
            display: block;
            float: left;
            color: rgba(141, 141, 141, 1);
            font-size: 14px;
        }
    }
    .box{
        width: 354px;
        margin: 0 auto;
        margin-bottom: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
        background-color: #fff;
        border-radius: 8px;
        padding: 15px 0;
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
        /deep/ .van-cell__title{
            min-width:100px!important;
        }
        van-button{
            i{
                font-style: normal;
                font-size: 12px;
                line-height: 12px;
                color: #999;
            }
        }
        .form-tip{
            background-color: #fff;
            display: block;
            font-size: 12px;
            color: #999;
            position: relative;
            top: -12px;
            left: 3px;

        }
    }
    .footer-box{
        margin:  0 auto;
        margin-bottom: 20px;
        width: 345px;
        height: 45px;
        line-height: 45px;
        left: 15px;
        background: -webkit-linear-gradient(top,#82F4A3,#4CDBC5); /* Safari 5.1-6.0 */
        background: -o-linear-gradient(bottom,#82F4A3,#4CDBC5); /* Opera 11.1-12.0 */
        background: -moz-linear-gradient(bottom,#82F4A3,#4CDBC5);/* Firefox 3.6-15 */
        background: linear-gradient(to bottom,#82F4A3,#4CDBC5); /* 标准语法 */
        border-radius: 6px;
        p{
            text-align: center;
            font-size: 16px;
            color: #fff;
        }
    }
    .link{
        padding-left: 10px;
        font-size: 14px;
        color: #4CDBC5;
    }
    .picker-top{
        height: 44px;
        line-height: 44px;
        overflow: hidden;
        border-bottom: 1px solid rgba(235,237,240,0.5);
        position: fixed;
        width: 100%;
        background-color: #fff;
        z-index: 222;
        .cancel{
            font-size: 14px;
            color: #1989fa;
            float: left;
            width:20%;
            padding-left: 10px;
            text-align: left;
        }
        .title{
            color: #000;
            font-size: 16px;
            float: left;
            text-align: center;
            width: 60%;
        }
        .sure{
            font-size: 14px;
            color: #1989fa;
            float: left;
            width: calc( 20% - 20px );
            text-align: right;
            padding-right:10px ;
        }
    }
    .picker-ul{
        overflow: hidden;
        margin-top:60px;
        li{
            height: 44px;
            line-height: 44px;
            color: #323233;
            text-align: center;
            font-size: 16px;
            border-bottom: 1px solid rgba(235,237,240,0.5);
            position: relative;
            /deep/ van-icon{
                display: none;
                position: absolute;
                font-size: 18px;
                top: 0;
                right: 10px;

            }
            &.current{
                /deep/ van-icon{
                    display: block;
                }
                color: #4CDBC5;
            }
        }
    }
</style>