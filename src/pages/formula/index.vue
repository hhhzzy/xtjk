<template>
    <div class="formula-box">
        <navbar :backVisible="true" :title="'在线配方'"></navbar>
        <p class="main-title">
            我的配方
        </p>
        <ul>
            <li v-for="(item,index) in list" :key="index">
                <view class="weui-cells weui-cells_after-title">
                    <navigator :url="'../formulaInfo/main?id='+item.memberRecipeId" class="weui-cell weui-cell_access" hover-class="weui-cell_active" >
                        <view class="weui-cell__bd">
                            <p class="name">
                                {{item.userName}}<span>（{{item.recipeName}}）</span>
                            </p>
                            <p class="one">
                                调理方向：{{item.condiName}}
                            </p>
                            <p class="one">
                                个人体质：{{item.bodyTypeName}}
                            </p>
                            <p class="one">
                                每日标准热量：{{item.everyNeedHot}}
                            </p>
                        </view>
                        <div class="weui-cell__ft money">￥{{item.recipePrice / 1000}}</div>
                        <view class="weui-cell__ft weui-cell__ft_in-access"></view>
                    </navigator>
                </view>
            </li>
        </ul>
        <div class="footer-box" @click="getPf">
            <p>获取新配方</p>
        </div>
    </div>
</template>
<script>
import navbar from '../../components/navbar'
import store from '../../store'
import axios from '../../utils/request.js'
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
        gotoInfo(){
            
        },
        // 进入我的配方
        getPf(){
            mpvue.navigateTo({ url:'../onlineFormulaUser/main' })
        },
        // 获取配方列表
        GetList(){
            wx.showLoading({
                title: '加载中',
            })
            axios({
                url:'api/recipe/queryRecipeList?memberId='+store.state.user.userInfo.id+'&offset='+this.offset+'&limit='+this.limit,
                method:'GET',
            }).then( res => {
                wx.hideLoading();
                if(res.data.pages >= this.offset){
                    console.log(res.data)
                    if(res.data.rows.length){
                        this.list = this.list.concat(res.data.rows); 
                    }
                }
            } )
        }
    },
    mounted(){
       
    },
    onShow(){
        this.list = [];
        this.offset = 1;
        this.limit = 15;
        this.GetList();
    },
    onReachBottom () {
        this.offset++;
        this.GetList();

    }
}
</script>
<style lang="less" scoped>
    .formula-box{
        background-color: #fafafa;
        padding-bottom: 20px;
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
            background-color: #fff;
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
            margin-top: 10px;
            margin-bottom: 60px;
            li{
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
                margin-bottom: 10px;
                .name{
                    font-size: 16px;
                    color: rgba(34, 34, 34, 1);
                    font-weight: bold;
                }
                .one{
                    font-size: 14px;
                    color:rgba(0, 0, 0, 1);
                }
                .money{
                    color: rgba(235, 1, 1, 1);
                    font-size: 16px;
                    font-weight: bold;
                }
            }
        }
        .footer-box{
            position: fixed;
            left: 0;
            bottom: 0;
            width: 100%;
            p{
                height: 60px;
                line-height: 60px;
                background: -webkit-linear-gradient(top,#63e6b5,#4CDBC5); /* Safari 5.1-6.0 */
                background: -o-linear-gradient(bottom,#63e6b5,#4CDBC5); /* Opera 11.1-12.0 */
                background: -moz-linear-gradient(bottom,#63e6b5,#4CDBC5);/* Firefox 3.6-15 */
                background: linear-gradient(to bottom,#63e6b5,#4CDBC5); /* 标准语法 */
                font-size: 16px;
                text-align: center;
                color: #fff;
            }
        }
    }
</style>