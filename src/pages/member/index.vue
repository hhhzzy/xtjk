<template>
    <div class="memeber-box">
        <navbar :title="'会员权益'"></navbar>
            <div class="content">
                <div class="top">
                    <p>当前等级:<span>{{info.gradeName}}</span></p>
                    <p>享受折扣:<span>{{info.gradeDiscount}}</span></p>
                    <p>升级所需积分:<span>{{info.nextGradeIntegral}}</span></p>
                </div>
                <p class="main-title">会员权益表</p>
                <div class="table">
                    <ul>
                        <li class="li-title">
                            <p>
                                会员等级
                            </p>
                            <p>
                                所需积分
                            </p>
                            <p>
                                享受折扣
                            </p>
                        </li>
                        <li v-for="(item,index) in info.gradeList" :key="index">
                            <p>{{item.gradeName}}</p>
                            <p>{{item.integral}}</p>
                            <p>{{item.gradeDiscount}}</p>
                        </li>
                    </ul>
                </div>
            </div>
    </div>
</template>
<script>
import store from '../../store'
import axios from '../../utils/request.js'
import navbar from '../../components/navbar'
export default {
    data(){
        return{
            info:{}
        }
    },
    components: {
        navbar
    },
    methods:{
        GetInfo(){
            axios({
                url: 'api/personal/getMemberEquity?memberId='+store.state.user.userInfo.id,
                method: 'get'
            }).then( res => {
                console.log(res);
                if(res.data.code == 1){
                    this.info = res.data.data;
                }
            } )
        }
    },
    onShow(){
        this.GetInfo();
    }
}
</script>
<style lang="less" scoped>
.memeber-box{
    height: 100%;
    background-color: #f2f2f2;
    overflow: hidden;
    .content{
        border-radius: 8px;
        background-color: #fff; 
        margin: 10px;
        width: 345px;
        margin: 10px auto;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
        .top{
            padding-left:30px;
            padding-top: 20px; 
            padding-bottom: 20px;
            border-bottom: 1px solid #F3F3F3;
            p{
                font-size: 16px;
                color: #000000;
                margin-bottom: 12px;
                span{
                    color: #FFAD34;
                    font-weight: bold;
                    margin-left: 20px;
                }
            }
        }
    }
    .main-title{
        width: 315px;
        font-size: 17px;
        position: relative;
        height: 25px;
        line-height: 25px;
        position: relative;
        color: #000;
        font-weight: bold;
        padding: 10px 20px;
        padding-right: 10px;
        background-color: #ffffff;
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
        padding: 0 10px;
        padding-bottom: 30px;
            li{
                overflow: hidden;
                border-bottom: 1px solid #FFF7F7F7;
                border-left: 1px solid #FFF7F7F7;
                border-right: 1px solid #FFF7F7F7;
                height: 45px;
                line-height: 45px;
                &.li-title{
                    background-color: #F7F7F7;
                    p{
                        border: none;
                        color:#868686;
                    }
                }
                p{
                    width: 39%;
                    height: 45px;
                    line-height: 45px;
                    float: left;
                    font-size: 13px;
                    color: #000000;
                    text-align: center;
                    &:first-child{
                        width: 20%;
                    }
                    &:not(:last-child){
                        border-right: 1px solid #FFF7F7F7;
                    }
                }
            }
        }
}
</style>