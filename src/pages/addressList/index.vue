<template>
    <div class="address-list-box">
        <navbar :backVisible="true" :title="'我的地址'" ></navbar>
        <ul v-if="addressList.length">

            <li v-for="(item,index) in addressList" :key="index">
                <p class="img">
                    <img src="../../../static/images/address.png" alt="">
                </p>
                <div class="center">
                    <div class="one">
                        <p class="name">{{item.receiveName}}</p>
                        <p class="tel">{{item.receivePhone}}</p>
                    </div>
                    <div :class="['address',item.isDefault?'current':'']">
                        {{item.receiveAddress}}
                    </div>
                </div>
                <p class="edit" @click="GoEdit(item.id)">编辑</p>
            </li>
            <!-- <li>
                <p class="img">
                    <img src="" alt="">
                </p>
                <div class="center">
                    <div class="one">
                        <p class="name">黄照阳</p>
                        <p class="tel">15223692587</p>
                    </div>
                    <div class="address">
                        重庆市江北区天天尚街3栋27-3 地址更长更长
                    </div>
                </div>
                <p class="edit">编辑</p>
            </li>
            <li>
                <p class="img">
                    <img src="" alt="">
                </p>
                <div class="center">
                    <div class="one">
                        <p class="name">黄照阳</p>
                        <p class="tel">15223692587</p>
                    </div>
                    <div class="address">
                        重庆市江北区天天尚街3栋27-3 地址更长更长
                    </div>
                </div>
                <p class="edit">编辑</p>
            </li> -->
        </ul>
        <p v-else class="no-address">您还没有地址，请添加！</p>
        <div class="footer-box">
            <p class="edit-p" @click="addAddress">新增地址</p>
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
            addressList:[]
        }
    },
    components: {
        navbar
    },
    methods:{
        // 新增地址
        addAddress(){
            mpvue.navigateTo({ url:'../addressAdd/main?type=add' })
        },
        getAddressList(){
            // 获取用户信息
            axios({
                url: 'api/personal/getMemberReceiveAddressList?memberId='+store.state.user.userInfo.id,
                method: 'get',
            }).then( data => {
                if(data.data.code == 1){
                    this.addressList = data.data.data;
                }
                console.log(this.addressList)
            } )
        },
        GoEdit(value){
            mpvue.navigateTo({ url:'../addressAdd/main?type=edit&id='+value })
        }
    },
    onShow(){
        this.getAddressList();
    }
}
</script>
<style lang="less" scoped>
.address-list-box{
    height: 100%;
    background-color: #fff;
    ul{
        li{
            padding: 10px 10px 10px 20px;
            overflow: hidden;
            height: 70px;
            border-bottom: 1px solid #f2f2f2;
            .img{
                width: 54px;
                height: 54px;
                border-radius: 50%;
                float: left;
                img{
                    width: 54px;
                    height: 54px;
                    display: block;
                }
            }
            .center{
                float: left;
                width: 222px;
                margin-left: 10px;
                .one{
                    overflow: hidden;
                    .name{
                        float: left;
                        font-size: 14px;
                        color: #000;
                    }
                    .tel{
                        font-size: 14px;
                        color: #666;
                        float: left;
                        margin-left: 5px;
                    }
                }
                .address{
                    font-size: 14px;
                    color: #000;
                    margin-top: 5px;
                    &.current{
                        padding-left: 40px;
                        position: relative;
                        &::before{
                            content: '默认';
                            display: block;
                            width: 30px;
                            height: 17px;
                            background-color: red;
                            position: absolute;
                            left: 0;
                            top: 3px;
                            font-size: 12px;
                            text-align: center;
                            color: #fff;
                            line-height: 15px;
                        }
                    }
                }
            }
            .edit{
                float: right;
                font-size: 14px;
                color: #666;
                position: relative;
                line-height: 70px;
                &::before{
                    content: '';
                    display: block;
                    width: 1px;
                    height: 45px;
                    background-color: #f2f2f2;
                    left: -15px;
                    position: absolute;
                    top: 15px;
                }
            }
        }
    }
    .footer-box{
        height: 45px;
        text-align: center;
        line-height: 45px;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        .edit-p{
            background: -webkit-linear-gradient(top,#82F4A3,#4CDBC5); /* Safari 5.1-6.0 */
            background: -o-linear-gradient(bottom,#82F4A3,#4CDBC5); /* Opera 11.1-12.0 */
            background: -moz-linear-gradient(bottom,#82F4A3,#4CDBC5);/* Firefox 3.6-15 */
            background: linear-gradient(to bottom,#82F4A3,#4CDBC5); /* 标准语法 */
            color: #fff;
            font-size: 14px;
        }
    }
    .no-address{
        padding:20px 40px;
        font-size: 14px;
        color: #000;
    }
}
</style>