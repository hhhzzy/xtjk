<template>
	<div class="index-box">
        <navbar :backVisible="false" :title="'健呗'"></navbar>
		<div class="banner-box">
			<view class="page-section page-section-spacing swiper">
				<swiper :indicator-dots="swiper.indicatorDots"
					:autoplay="swiper.autoplay" :interval="swiper.interval" :duration="swiper.duration">
					<block v-for="(item,index) in bannerList" :key="index">
					<swiper-item>
						<view :class="['swiper-item',item]">
							<a :href="item.linkedUrl">
								<img :src="item.imgUrl" alt="">
							</a>
						</view>
					</swiper-item>
					</block>
				</swiper>
			</view>
		</div>
		<div class="tab-box online-box">
			<p class="main-title">
				健康云服务
			</p>
			<div class="content">
				<div class="left-con">
					<a href="javascript:;" @click="gotoOnlineFormulaUser">
						<p class="img">
							<img src="../../../static/images/znpf.png" alt="">
						</p>
					</a>
				</div>
				<div class="right-con">
					<div class="top">
						<a href="../physicReview/main" @click="gotoPhysic">
							<p class="img">
								<img src="../../../static/images/zxpc.png" alt="">
							</p>
						</a>
						<a href="../orderList/main">
							<p class="img">
								<img src="../../../static/images/wddd.png" alt="">
							</p>
						</a>
					</div>
					<div class="bottom">
						<a href="javascript:;" @click="gotoformula">
							<p class="img">
								<img src="../../../static/images/wdpf.png" alt="">
							</p>
						</a>
						<a href="../tc/main">
							<p class="img">
								<img src="../../../static/images/wytc.png" alt="">
							</p>
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="tab-box health-tab-box">
			<p class="main-title" >
				健康资讯
				<a href="../health/main">更多></a>
			</p>
			<div class="health-box">
				<ul>
					<li v-for="(item,index) in healthList" :key="index">
						<a :href="'../healthInfo/main?id='+item.id">
							<p>
								<span>{{item.title}}</span>
								<span class="two">{{item.sub_title}}</span>
							</p>
							<img :src="item.imgUrl" alt="">
						</a>
					</li>
				</ul>
			</div>
		</div>
		<div class="tab-box">
			<p class="main-title">
				感恩回馈
			</p>
			<div class="gy-content">
				<div class="one">
					<p class="title">爱心商城收益金额</p>
					<p class="money">{{publicAccountMoney / 1000}}元</p>
					<ul>
						<li>
							<a href="javascript:;">
								<img src="" alt="">
								<span>大病求助</span>
							</a>
						</li>
						<li>
							<a href="javascript:;">
								<img src="" alt="">
								<span>求医问药</span>
							</a>
						</li>
						<li>
							<a href="javascript:;">
								<img src="" alt="">
								<span>法律援助</span>
							</a>
						</li>
					</ul>
				</div>
				<div class="two scroll-box">
					<van-notice-bar
						:text="gyInfo"
					/>
					
				</div>
				<div class="three">
					<ul>
						<li>
							<a href="../welfare/main">
								<img src="../../../static/images/gyxw.png" alt="">
								<span>爱心新闻</span>
							</a>
						</li>
						<li>
							<a href="../donate/main">
								<img src="../../../static/images/wdjz.png" alt="">
								<span>爱心商城</span>
							</a>
						</li>
						<li>
							<a href="../donateJoin/main">
								<img src="../../../static/images/sqjr.png" alt="">
								<span>申请加入</span>
							</a>
						</li>
						<li>
							<a href="../rescueJoin/main">
								<img src="../../../static/images/jzsq.png" alt="">
								<span>救助申请</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="tab-box">
			<p class="main-title" >
				明星榜
				<a href="../teamList/main">更多></a>
			</p>
			<div class="team-box">
				<ul>
					<li v-for="(item,index) in teamList" :key="index">
						<a :href="'../teamInfo/main?id='+item.id">
							<img :src="item.imgUrl" alt="">
							<p>{{item.title}}</p>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import card from '@/components/card'
import test from '@/components/test'
import store from '../../store'

import axios from '../../utils/request.js'
import {imgBaseUrl} from '../../utils/common.js'
import navbar from '../../components/navbar'
export default {
  data () {
    return {
		imgBaseUrl:imgBaseUrl,
		bannerList: [],
		swiper:{
			indicatorDots: true,
			vertical: false,
			autoplay: true,
			interval: 2000,
			duration: 500
		},
		publicAccountMoney:"",
		publicTransaction:[],
		animation:'',
		scrollWidth:null,
		time:null,
		healthList:[], // 新闻列表
		teamList:[], // 团队展示
		gyList:[],
		gyInfo:''
	}
  },

  components: {
    card,
	test,
	navbar
  },

  methods: {
    bindViewTap () {
      const url = '../login/main'
      mpvue.navigateTo({ url:'../login/main' })
      // if (mpvuePlatform === 'wx') {
      //   mpvue.switchTab({ url })
      // } else {
      //   mpvue.navigateTo({ url })
      // }
    },
    clickHandle (ev) {
      console.log('clickHandle:', ev)
      // throw {message: 'custom test'}
	},
	// 进入我的配方
	gotoformula(){
		mpvue.navigateTo({ url:'../formula/main' })
	},
	// 进入体质评测
	gotoPhysic(){
		mpvue.switchTab({ url:'../physicReview/main' })
	},
	// 获取轮播图
	async getBanner(){
		await axios({
			url:'api/index/getAllPicture?type=1',
			method:'get'
		}).then( res => {
			if(res.data.code ==1){
				this.bannerList = res.data.data.map( item => {
					item.imgUrl = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(item.imgUrl);
					return item;
                });
                console.log(res)
			}
		} )
	},
	// 获取公益金额
	getPublicAccountMoney(){
		axios({
			url:'api/index/getPublicAccountMoney',
			method:'get'
		}).then( res => {
			if(res.data.code ==1){
				this.publicAccountMoney = res.data.data.money;
			}
		} )
	},
	// 获取捐赠记录
	getPublicTransaction(){
		axios({
			url:'api/index/getPublicTransaction',
			method:'get'
		}).then( res => {
			if(res.data.code ==1){
				this.publicTransaction = res.data.data;
				// console.log(this.publicTransaction)
			}
		} )
	},
	// 获取健康资讯
	getNewsList(){
		axios({
			url:'api/index/getIndexMessage?messageType=1',
			method:'get'
		}).then( res => {
			if(res.data.code ==1){
				if(res.data.data){
					this.healthList = res.data.data.map( item => {
						item.imgUrl = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(item.imgUrl);
						return item;
					});
				}
			}
		} )
	},
	// 获取团队展示
	getTeamList(){
		axios({
			url:'api/index/getIndexMessage?messageType=2',
			method:'get'
		}).then( res => {
			if(res.data.code ==1){
				if(res.data.data){
					this.teamList = res.data.data.map( item => {
						item.imgUrl = this.imgBaseUrl+'api/service/upload/getImg?imgUrl='+encodeURIComponent(item.imgUrl);
						return item;
                    });
                    console.log(this.teamList)
				}
			}
		} )
	},
	// 获取公益
	getGY(){
		axios({
			url:'api/public/getNewPublicTransactionList',
			method:'get'
		}).then( res => {
			if(res.data.code ==1){
			this.gyList = res.data.data.map( item => {
							// item.nickName = item.nickName.slice(0,1)+'**';
							this.gyInfo += item.nickName+'消费了'+(item.transactionMoney / 1000)+'元                                         ';
							return item;
						} );
				console.log(res)
			}
		} )
	},
	gotoOnlineFormulaUser(){
		mpvue.switchTab({ url:'../onlineFormulaUser/main'}); 
	}
    
  },

  mounted () {
	this.getBanner();
	// 获取新闻信息
	this.getNewsList();
	// 获取团队展示
	this.getTeamList();
    // 分享
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
  },
    onShareAppMessage: (res) => {
        if(res.from == 'menu'){
            return {
                title: '健呗+',
                imageUrl: '', // 图片 URL
                path: "/pages/index/main?parentMemberId="+store.state.user.userInfo.id
            };
        }
    },
  onLoad(options){
      	console.log(options)
		if(options.scene){
			const scene = options.scene?decodeURIComponent(options.scene):'';
			wx.setStorageSync('parentMemberId',scene);
		} else{
			wx.setStorageSync('parentMemberId',options.parentMemberId?options.parentMemberId:'');	
		}

  },
  onShow(){
	  	this.getGY();
		// 获取公益金额
		this.getPublicAccountMoney();
		// 获取捐赠记录
		this.getPublicTransaction();
  }
}
</script>

<style lang="less" scoped>
.index-box{
	background-color: #FAFAFA;
	padding-bottom: 10px;
	.banner-box{
		swiper{
			height: 170px;
		}
		.swiper-item{
			height: 170px;
			a{
				display: block;
				height: 170px;
				background-color: #f2f2f2;
				img{
					width: 100%;
					display: block;
					height: 170px;
				}
			}
		}
	}
	.tab-box{
		background-color: #fff;
		margin:10px 0;
		overflow: hidden;
		box-shadow: 0 2px 6px rgba(0,0,0,0.07);
		.main-title{
			padding: 10px 20px;
			padding-right: 10px;
		}
		.content{
			padding:0 15px;
			margin: 15px 0;
			overflow: hidden;
			font-size: 14px;
			.left-con{
				float: left;
				width: 114px;
				text-align: center;
				.img{
					width: 114px;
					height: 124px;
					margin: 0 auto;
				}
				img{
					width: 114px;
					height: 124px;
					display: block;
				}
			}
			.right-con{
				float: left;
				width: calc( 100% - 114px );
				img{
					width: 94px;
					height: 60px;
					margin: 0 auto;
					display: block;
				}
				a{
					float: left;
					margin-left: 15px;
					&:nth-of-type(2){
						float: right;
						margin-left: 7px;
					}
				}
				.bottom,.top{
					overflow: hidden;
				}
				.top{
					margin-bottom: 5px;
				}
			}
		}
	}
	.online-box{
		margin: 10px;
		border-radius: 5px;
		box-shadow: initial;
	}
	.main-title{
		font-size: 17px;
		position: relative;
		height: 25px;
		line-height: 25px;
		position: relative;
		padding-left: 10px;
		color: #000;
		font-weight: bold;
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
		a{
			float: right;
			font-size: 15px;
			color: #000;
		}

	}
	.gy-content{
		.one{
			width: 345px;
			height: 114px;
			background-color: rgba(215, 215, 215, 1);
			border-radius: 6px;
			margin: 10px auto;
			overflow: hidden;
			background: -webkit-linear-gradient(left,#F32622,#FC704F); /* Safari 5.1-6.0 */
            background: -o-linear-gradient(right,#F32622,#FC704F); /* Opera 11.1-12.0 */
            background: -moz-linear-gradient(right,#F32622,#FC704F);/* Firefox 3.6-15 */
            background: linear-gradient(to right,#F32622,#FC704F); /* 标准语法 */
			.title{
				font-size: 14px;
				color: #fff;
				display: block;
				text-align: center;
				margin-top: 10px;
				margin-bottom: 5px;
			}
			.money{
				font-size: 22px;
				color: #F42B25;
				text-align: center;
				width: 230px;
				height: 35px;
				line-height: 35px;
				margin: 0 auto;
				text-align: center;
				background-color: #fff;
				font-weight: bold;
			}
			ul{
				overflow: hidden;
				margin: 10px auto;
				width: 230px;
				img{
					width: 8px;
					height: 8px;
					display: block;
					float: left;
					margin-right: 5px;
					margin-top: 7px;
				}
				img:first-child{
					background-color: #F7D13E;
				}
				li{
					float: left;
					width: 33%;
					font-size: 12px;
					color: #fff;
					height: 20px;
					line-height: 20px;
					&:last-child a{
						float: right;
						img{
							background-color: #80D1F7;
						}
					}
					&:nth-of-type(2){
						a{
							margin-left: 6%;
							img{
								background-color: #71E2CB;
							}
						}
					}
				}
				span{
					display: block;
					float: left;
				}
				a{
					display: inline-block;
					overflow: hidden;
				}
			}
		}
		.two{
			margin: 20px auto;
			height: 30px;
			overflow: hidden;
			border-radius: 6px;
			background-color: #f2f2f2;
			overflow: hidden;
			width: 335px;
			/deep/ .van-notice-bar{
				height: 32px;
				background-color: #f2f2f2!important;
				padding: 0;
				color: #000000!important;
			}
			/deep/ .van-notice-bar__left-icon{
				display: none;
			}
			ul{
				white-space: nowrap;
				height: 40px;
				line-height: 30px;
				display: inline-block;
				li{
					font-size: 13px;
					color: #333;
					display: inline-block;
					margin-right: 15px;
				}
			}
		}
		.three{
			margin: 0 auto;
			margin-top:20px;
			overflow: hidden;
			height: 90px;
			width: 335px;
			ul{
				overflow: hidden;
				li{
					float: left;
					margin-right: 29px;
					&:last-child{
						margin-right: 0;
					}
					a{
						display: block;
						font-size: 14px;
						width: 60px;
						text-align: center;
						color: #333;
					}
					img{
						width: 45px;
						height: 45px;
						display: block;
						margin: 0 auto;
					}
				}
			}
		}
	}
	.health-box{
		ul{
			padding: 10px;
			li{
				overflow: hidden;
				padding: 10px;
				box-shadow: 0 2px 6px rgba(0,0,0,0.07);
				margin-bottom: 10px;
				border-radius: 5px;
				overflow: hidden;
				p{
					font-size: 17px;
					color: #222;
					float: left;
					width: 240px;
					font-weight: bold;
					.two{
						font-size: 14px;
                        display: block;
                        font-weight: initial;
					}
				}
				img{
					width: 65px;
					height: 65px;
					display: block;
					float: right;
					background-color: #f2f2f2;
				}
			}
		}
	}
	.team-box{
		margin: 10px;
		overflow: hidden;
		ul{
			overflow: hidden;
			li{
				float: left;
				margin-right: 27px;
                text-align: center;
                &:nth-of-type(3n){
                    margin-right: 0;
                }
				img{
					width: 100px;
					height: 110px;
					background-color: #f2f2f2;
					display: block;
				}
				p{
					font-size: 15px;
					color: #000000;
				}
			}
		}
	}
}
.demo-text-1{
	background-color: #f2f2f2;
}
.demo-text-2{
	background-color: green;
}
.demo-text-3{
	background-color: pink;
}

</style>
