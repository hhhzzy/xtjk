<template>
    <div class="formula-online-box">
        <navbar :backVisible="true" :title="'在线配方'" :linearOne="'#82F4A3'" :linearTwo="'#63e6b5'"></navbar>
        <div class="bg-box">
            <div class="user-box">
                <div class="top">
                    <p class="picture">
                        <img :src="imgUrl" alt="">
                    </p>
                    <p class="name">{{userInfo.userName}}</p>
                    <a href="javascript:;" class="right"><img src="../../../static/images/right.png" alt=""></a>
                </div>
                <div class="user-info">
                    <p class="year">
                        <i>年龄</i>
                        <span>{{userInfo.userAge}}岁</span>
                    </p>
                    <p class="one">
                        <i>病症</i>
                        <span>{{userInfo.directionText}}</span>
                    </p>
                    <p class="two">
                        <i>体质</i>
                        <span>{{userInfo.bodyText}}</span>
                    </p>
                </div>
            </div>
        </div>
        <p class="content">
            以下配方是根据您目前的身体情况私人定制，一人一方，建议每日摄入热量维持在{{hotNum}}Kcal以内，按配方服用。
        </p>
        <div class="btn-box">
            <p :class="['one',currentIndex == 1?'current':'']" @click="switchFormula('one')">配方一</p>
            <p :class="['one',currentIndex == 2?'current':'']" @click="switchFormula('two')">配方二</p>
        </div>
        <div class="food-box">
           <div :class="[boolDetail?'':'food-list']" v-for="(item,index) in formulaData.foodMap" :key="index">
               <p class="tit">热源{{index+1}}</p>
                <p class="con">{{item.foodName}}   X {{item.foodNumber*formulaData.overDay}}份数</p>
           </div>
           <p class="title">该配方包含食材{{foodNum}}种，总热量{{hotNum*formulaData.overDay}}Kcal。</p>
           <p class="food-btn" @click="seeDetail">
               {{seeText}} 
               <img v-if="seeText !='点击查看详细'" class="current" src="../../../static/images/down.png" alt="">
               <img v-else  src="../../../static/images/down.png" alt="">
           </p>
           <div class="food-tip">
               以优惠<span>￥{{formulaData.discountPrice / 1000}}</span>
               小计<i>￥{{formulaData.recipePrice*formulaData.overDay / 1000}}</i>
           </div>
        </div>
        <div class="tj-box">
            <p class="title">推荐辅食</p>
            <p class="tips">亲~科学食疗搭配合理的茶饮及其他健康产品，能提升身体调理的效果哟，以下是针对您的情况为您挑选的一些组合:</p>
            <ul>
                <li v-for="(item,index) in recommend" :key="index" @click="selectTj(item,index)">
                    <div class="top">
                        <p class="img">
                            <img :src="item.imgUrl" alt="">
                        </p>
                        <div class="info">
                            <p class="name">{{item.foodName}}</p>
                            <p class="one">￥{{item.foodPrice / 1000}}</p>
                            <p class="two">￥{{item.discountPrice / 1000}}</p>
                        </div>
                        <div class="select"></div>
                    </div>
                    <p class="bottom">
                        {{item.memo}}
                    </p>
                    <p class="select-p">
                        <img :src="'../../static/images/select-'+tjIndex[index]+'.png'" alt="">
                    </p>
                </li>
            </ul>
        </div>
        <div class="footer-box">
            <p class="save-p" @click="savePf">保存配方</p>
            <p class="buy-p" @click="buySave">
                立即购买
                <span>(共计￥{{formulaData.recipePrice*formulaData.overDay / 1000}})</span>
            </p>
        </div>
        <van-toast id="van-toast" />
    </div>
</template>
<script>
import navbar from '../../components/navbar'
import axios from '../../utils/request.js'
import Toast from '../../../static/vant/toast/toast';
import store from '../../store'
import {imgBaseUrl} from '../../utils/common.js'
import { resolve } from 'url';
import { wxpay } from '../../utils/common.js'
export default {
    data(){
        return{
            imgBaseUrl:imgBaseUrl,
            userInfo:{},
            list:[],
            imgUrl:'',
            formulaData:{},
            hotNum:null,
            foodNum:0,
            boolDetail:false,
            seeText:'点击查看详细',
            currentIndex:1,
            recommend:[],
            tjIndex:[],
            tjForm:[], // 推荐表单
            recipeName:'配方一',
           
        }
    },
    components: {
        navbar
    },
    methods:{
        // 切换配方
        switchFormula(text){
            if(text == 'one'){
                this.formulaData = this.list[0];
                this.currentIndex = 1;
                this.recipeName = '配方一';
            } else {
                this.formulaData = this.list[1];
                this.currentIndex = 2;
                this.recipeName = '配方二';
            }
            this.foodNum = this.formulaData.foodMap?this.formulaData.foodMap.length:0;
        },
        // 查看详细
        seeDetail(){
            this.boolDetail = !this.boolDetail;
            this.seeText = this.boolDetail?'点击收缩':'点击查看详细';
        },
        // 获取推荐食材
        GetOtherFood(){
            axios({
                url:'api/recipe/queryOtherFood?memberId='+store.state.user.userInfo.id,
                method:'get',
                data:this.formData
            }).then( res => {
                if(res.data.code ==1){
                    this.recommend = res.data.data.map( item => {
                        this.tjIndex.push(0);
					    item.imgUrl = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(item.imgUrl);
					    return item;
				    });
                }
            } )
        },
        // 选择食材
        selectTj(data,index){
            let boolIndex = null;
            this.tjIndex[index] = this.tjIndex[index] == 0?1:0;
            if(this.tjForm.length){
                this.tjForm.forEach( (item,ind) => {
                    if(item.id == data.id){
                        boolIndex = ind;
                    }
                } )
                if(boolIndex == null){
                    this.tjForm.push(data);
                } else {
                    this.tjForm.splice(boolIndex,1);
                }
            }else{
                this.tjForm.push(data);
                
            }
            console.log(this.tjForm)
        },
        // 保存配方
        savePf(){
            const form = Object.assign({},this.userInfo);
            form.recipeList = encodeURI(this.formulaData.recipeList);
            form.recipeName = this.recipeName;
            form.recipePrice = this.formulaData.recipePrice;
            console.log(this.recipeName)
            console.log(form)
            axios({
                url:'api/recipe/saveMemberRecipe',
                method:'post',
                data:form
            }).then( res => {
                console.log(res);
                if(res.data.code ==1){
                    Toast({
                        type: 'success',
                        message: '配方保存成功',
                        onClose: () => {
                            mpvue.navigateTo({ url:'../formula/main'});
                        }
                    });
                }
            } )
        },
        // 购买配方
        async buySave(){
            //1.保存配方
            const form = Object.assign({},this.userInfo);
            form.recipeList = encodeURI(this.formulaData.recipeList);
            form.recipeName = this.recipeName;
            form.recipePrice = this.formulaData.recipePrice;
            let memberRecipeId = null;
            await new Promise( (resolve,reject) => {
                axios({
                    url:'api/recipe/saveMemberRecipe',
                    method:'post',
                    data:form
                }).then( res => {
                    console.log(res);
                    if(res.data.code ==1){
                        memberRecipeId = res.data.data;
                    }
                    resolve();
                } )
            } )
            console.log(memberRecipeId)
            // 2. 生成订单
            let memberOrderId = null;
            let foodId = [];
            if(this.tjForm.length){
                this.tjForm.forEach(item => {
                    foodId.push(item.id)
                });
            }
            console.log(foodId)
            await new Promise( (resolve,reject) => {
                axios({
                        url:'api/memberOrder/addMemberOrder?memberId='+form.memberId+'&memberRecipeId='+memberRecipeId+'&foodId='+foodId.toString(),
                        method:'GET'
                    }).then( res => {
                        console.log(res);
                        if(res.data.code == 1){
                            memberOrderId = res.data.data.memberOrderId;
                        }
                        resolve();
                    } )
            } )
            console.log(store.state.user.userInfo.id,memberOrderId,'配方订单支付',1)
            // 3.支付
            wxpay(store.state.user.userInfo.id,memberOrderId,'配方订单支付',1);
        }
    },
    mounted(){
        // 获取配方详情
        
        // 获取数据
        this.userInfo = wx.getStorageSync('formulaUser');
        this.list = wx.getStorageSync('formula');
        this.formulaData = this.list[0];
        this.formulaData.foodMap.forEach(item => {
            this.hotNum += item.foodHot;
        });
        this.foodNum = this.formulaData.foodMap?this.formulaData.foodMap.length:0;
        this.imgUrl = store.state.user.userInfo.imgUrl;
        // 获取推荐食材
        this.GetOtherFood();
    },
}
</script>
<style lang="less" scoped>
.bg-box{
    height: 70px;
    background: -webkit-linear-gradient(top,#63e6b5,#4CDBC5); /* Safari 5.1-6.0 */
    background: -o-linear-gradient(bottom,#63e6b5,#4CDBC5); /* Opera 11.1-12.0 */
    background: -moz-linear-gradient(bottom,#63e6b5,#4CDBC5);/* Firefox 3.6-15 */
    background: linear-gradient(to bottom,#63e6b5,#4CDBC5); /* 标准语法 */
    position: fixed;
    width: 100%;
    z-index: 999;
}
.user-box{
    width: 354px;
    height: 145px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
    margin-left: 10px;
    overflow: hidden;
    .top{
        margin-top: 20px;
        margin-left: 15px;
        overflow: hidden;
        .picture{
            width: 40px;
            height: 40px;
            overflow: hidden;
            border-radius: 50%;
            float: left;
            img{
                width: 40px;
                height: 40px;
            }
        }
        .name{
            font-size: 16px;
            color: rgba(29, 29, 29, 1);
            float: left;
            margin-left: 15px;
            margin-top: 5px;
            font-weight: 500;
        }
        .right{
            float: right;
            margin-right: 20px;
            margin-top: 5px;
            img{
                width: 6px;
                height: 12px;
            }
        }
    }
    .user-info{
        float: left;
        width: 100%;
        margin-top: 20px;
        p{
            font-size: 14px;
            color: #333;
            float: left;
            width: 33%;
            text-align: center;
            i{
                color: #1D1D1DFF;
                font-size: 10px;
                display: block;
                font-style: normal;
            }
            span{
                color: #1D1D1DFF;
                font-size: 15px;
                display: block;
            }
        }
    }
}
.content{
    font-size: 13px;
    color: rgba(29, 29, 29, 1);
    margin: 0 auto;
    margin-top: 155px;
    width: 338px;
}
.btn-box{
    margin: 0 auto;
    overflow: hidden;
    margin-top: 15px;
    width: 354px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    p{
        width: 50%;
        float: left;
        height: 55px;
        line-height: 55px;
        text-align: center;
        background-color: #F0F0F0;
        color: #333;
        font-size: 17px;
        color: #B5B5B5;
    }
    .current{
        background: -webkit-linear-gradient(top,#82F4A3,#4CDBC5); /* Safari 5.1-6.0 */
        background: -o-linear-gradient(bottom,#82F4A3,#4CDBC5); /* Opera 11.1-12.0 */
        background: -moz-linear-gradient(bottom,#82F4A3,#4CDBC5);/* Firefox 3.6-15 */
        background: linear-gradient(to bottom,#82F4A3,#4CDBC5); /* 标准语法 */
        line-height: 60px;
        color: #fff;
    }
}
.food-box{
    margin: 0 auto;
    overflow: hidden;
    width: 354px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
    border-radius: 8px;
    .food-list{
        display: none;
    }
    .title{
        font-size: 15px;
        color: #000000FF;
        padding: 0 10px;
        height: 55px;
        line-height: 55px;
        text-align: left;
        background-color: #fafafa;
    }
    .con{
        font-size: 16px;
        color: #333;
        padding: 0 10px;
        height: 55px;
        line-height: 55px;
    }
    .tit{
        background-color: #fafafa;
        height: 55px;
        line-height: 55px;
        font-size: 14px;
        text-align: center;
    }
    .food-btn{
        font-size: 12px;
        text-align: center;
        height: 55px;
        line-height: 55px;
        color: #4A4A4AFF;
        img{
            display: inline-block;
            width: 12px;
            height: 6px
        }
        .current{
            transform: rotate(180deg);
            margin-bottom: 2px;
        }
    }
    .food-tip{
        height: 55px;
        line-height: 55px;
        text-align: center;
        font-size: 16px;
        border-top: 1px solid #f2f2f2;
        background: -webkit-linear-gradient(top,#82F4A3FF,#4CDBC5); /* Safari 5.1-6.0 */
        background: -o-linear-gradient(bottom,#82F4A3FF,#4CDBC5); /* Opera 11.1-12.0 */
        background: -moz-linear-gradient(bottom,#82F4A3FF,#4CDBC5);/* Firefox 3.6-15 */
        background: linear-gradient(to bottom,#82F4A3FF,#4CDBC5); /* 标准语法 */
        color: #FFFFFFFF;
        span,i{
            font-size: 16px;
            font-style: normal;
            font-weight: bold;
            display: inline;
            color: #FFFFFFFF;
        }
    }
}
.tj-box{
    margin: 0 auto;
    overflow: hidden;
    width: 354px;
    background-color: #fff;
    margin-top: 10px;
    border-radius: 5px;
    margin-bottom: 60px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.11);
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
    .tips{
        font-size: 13px;
        color: #000000FF;
        background-color: #f2f2f2;
        border-radius: 6px;
        padding: 3px;
        width: 306px;
        margin: 0 auto;
        padding: 8px 10px;
    }
    ul{
        padding: 10px;
        li{
            background-color: rgba(242, 242, 242, 1);
            border-radius: 10px;
            padding: 10px;
            margin: 0 auto;
            margin-bottom: 10px;
            width: 306px;
            position: relative;
            .select-p{
                position: absolute;
                right: 0;
                top: 0;
                width: 20px;
                height: 20px;
                right: 18px;
                top: 16px;
                img{
                    width: 20px;
                    height: 20px;
                }
            }
        }
        .top{
            overflow: hidden;
        }
        .img{
            width: 105px;
            height: 70px;
            float: left;
            img{
                width: 105px;
                height: 70px;
            }
        }
        .info{
            margin-left: 10px;
            float: left;
            .name{
                font-size: 16px;
                color: #000000FF;
                font-weight: bold;
            }
            .one{
                font-size: 16px;
                color: #000000FF;
                font-weight: bold;
            }
            .two{
                font-size: 15px;
                color: #A5A5A5FF;
                text-decoration: line-through;
            }
        }
        .bottom{
            font-size: 14px;
            color: #404040FF;
            padding-top:10px; 
        }
    }
}
.footer-box{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .save-p{
        height: 45px;
        line-height: 45px;
        text-align: center;
        width: 135px;
        color: #fff;
        font-size: 16px;
        float: left;
        background-color: rgba(93, 198, 246, 1);
    }
    .buy-p{
        width: calc( 100% - 135px );
        background: -webkit-linear-gradient(top,#63e6b5,#4CDBC5); /* Safari 5.1-6.0 */
        background: -o-linear-gradient(bottom,#63e6b5,#4CDBC5); /* Opera 11.1-12.0 */
        background: -moz-linear-gradient(bottom,#63e6b5,#4CDBC5);/* Firefox 3.6-15 */
        background: linear-gradient(to bottom,#63e6b5,#4CDBC5); /* 标准语法 */
        font-size: 16px;
        color: #fff;
        float: left;
        height: 45px;
        text-align: center;
        span{
            display: block;
            text-align: center;
            font-size: 12px;
        }
    }
}
</style>