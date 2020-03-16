<template>
    <div class="account-box">
        <navbar :title="'账户明细'"></navbar>
        <p class="main-title">账户流水</p> 
        <ul>
            <li v-for="(item,index) in list" :key="index">
                <p class="title">【{{item.typeName}}】</p>
                <p class="time">{{item.createTime}}</p>
                <p class="money">{{item.money / 1000}}</p>
            </li>
        </ul>
    </div>
</template>
<script>
import store from '../../store'
import axios from '../../utils/request.js'
import navbar from '../../components/navbar'
export default {
    data(){
        return{
            offset:1,
            limit:15,
            list:[]
        }
    },
    components: {
        navbar
    },
    methods:{
        GetInfo(){
            axios({
                url: 'api/personal/getMemberMoneyTransaction?memberId='+store.state.user.userInfo.id+'&offset='+this.offset+'&limit='+this.limit,
                method: 'get'
            }).then( res => {
                console.log(res);
                if(res.data.rows.length){
                    this.list = res.data.rows;
                }
            } )
        }   
    },
    onShow(){
        this.list = [];
        this.GetInfo();
    },
    onReachBottom () {
        this.offset++;
        this.GetInfo();

    }
}
</script>
<style lang="less" scoped>
.account-box{
 height: 100%;
    .main-title{
        width: 100%;
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
    ul{
        li{
            overflow: hidden;
            padding-left: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
            margin-bottom: 15px;
            p{
                float: left;
                font-size: 14px;
                color: rgba(0, 0, 0, 1);
                height: 50px;
                line-height: 50px;
            }
            .money{
                float: right;
                margin-right: 10px;
            }
        }
    }
}
</style>