<template>
    <div class="donate-list-box">
        <navbar :title="'我的捐赠'"></navbar>
        <p class="main-title">
            我的捐赠
        </p>
        <div class="table-box">
            <ul>
                <li class="li-title">
                    <p>序号</p>
                    <p>捐赠时间</p>
                    <p>捐赠金额</p>
                </li>
                <li v-for="(item,index) in donateList" :key="index">
                    <p>{{index+1}}</p>
                    <p>{{item.createTime}}</p>
                    <p>{{item.transactionMoney}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import axios from '../../utils/request.js'
import store from '../../store'
import navbar from '../../components/navbar'
export default {
    data(){
        return{
            donateList:[],
        }
    },
    methods:{
        getDonate(){
            axios({
                url:'api/public/getMyPublicTransactionList?limit=1000&offset=1&memberId='+store.state.user.userInfo.id,
                method:'get'
            }).then( res => {
                if(res.data.rows){
                    this.donateList = res.data.rows;
                }
            } )
        },
    },
    components: {
        navbar
    },
    mounted(){
        this.getDonate();
    }
}
</script>
<style lang="less" scoped>
.donate-list-box{
    height: 100%;
    background-color: #fff;
}
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
    margin-bottom: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
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
.table-box{
    ul{
        li{
            overflow: hidden;
            height: 45px;
            line-height: 45px;
            &.li-title{
                background-color: #F7F7F7FF;
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
    p{
        border-right:1px solid #e4e4e4;
        border-bottom:1px solid #e4e4e4;
        float: left;
        width: 33%;
        text-align: center;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        &:nth-of-type(3){
            border-right: none;
        }
    }
}
</style>