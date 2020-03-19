<template>
    <div class="comp-navbar">
            <!-- 导航栏主体 -->
            <div class="navbar" :style="{height: navBarHeight + 'px',background:'linear-gradient(to bottom,'+linearOne+','+linearTwo+')'}">
                <!-- 状态栏 -->
                <div class="nav-statusbar" :style="{height: statusBarHeight + 'px'}"></div>
                <!-- 标题栏 -->
                <div class="nav-titlebar" :style="{height: titleBarHeight + 'px' }">
                    <!-- homek键及关闭键及后退键 -->
                    <div class="bar-options">
                        <div v-if="backVisible" class="opt opt-back" @click="backClick()">
                            <img class="back-image" src="../../static/images/goBack.png" >
                        </div>
                        <!-- <cover-view class="line" v-if="backVisible && homePath"></cover-view> -->
                        <!-- <div v-if="homeIshide" class="opt opt-home" @click="homeClick()">
                            <img class="home-image" src="../../static/images/home.png" >
                        </div> -->
                    </div>
                    <!-- 标题 -->
                    <div class="bar-title" :style="[{color:titleColor}]">{{title}}</div>
                </div>
            </div>
            
            <!-- 占位栏 -->
            <div class="placeholder-bar" :style="{height: navBarHeight + 'px'}"></div>
    </div>
</template>

<script>
export default {
  props: {
    // 导航栏背景色
    navBackgroundColor: {
      default: "#82F4A3"
    },
    // 标题颜色
    titleColor: {
      default: "#FFFFFF"
    },
    //标题文字
    title: {
      required: false,
      default: ""
    },
    // 是否显示后退按钮
    backVisible: {
      required: false,
      default: true
    },
    // home按钮的路径
    homePath: {
      required: false,
      default: ""
    },
    backPath: {
      default: ""
    },
    homeIshide: {
      type: Boolean,
      default: false
    },
    linearOne:{
        default:'#82F4A3'
    },
    linearTwo:{
        default:'#4CDBC5'
    }
  },
  data() {
    return {
      statusBarHeight: "", // 状态栏高度
      titleBarHeight: "", // 标题栏高度
      navBarHeight: "", // 导航栏总高度
      platform: "",
      model: "",
      brand: "",
      system: ""
    };
  },
  beforeMount() {
    const self = this;
    wx.getSystemInfo({
      success(system) {
        self.statusBarHeight = system.statusBarHeight;
        self.platform = system.platform;
        self.model = system.model;
        self.brand = system.brand;
        self.system = system.system;
        let platformReg = /ios/i;
        if (platformReg.test(system.platform)) {
          self.titleBarHeight = 44;
        } else {
          self.titleBarHeight = 48;
        }
        self.navBarHeight = self.statusBarHeight + self.titleBarHeight;
      }
    });
  },
  mounted() {
    // console.log(`this.backVisible:`, this.backVisible);
  },
  methods: {
    backClick() {
      wx.navigateBack({
        delta: 1
      });
    },
    homeClick() {
      wx.reLaunch({
        url: this.homePath
      });
    }
  }
};
</script>

<style lang="less" scoped>
.comp-navbar {
    width: 100vw;
    z-index: 999;
  .navbar {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 999;
    .nav-titlebar {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      .bar-options {
        width: 50rpx;
        height: 60rpx;
        display: flex;
        box-sizing: border-box;
        align-items: center;
        justify-content: space-around;
        position: absolute;
        left: 7px;
        display: flex;
        align-items: center;
        border-radius: 27px;
        padding-right: 5px;
        .opt {
          width: 50rpx;
          height: 50rpx;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .opt-back {
          .back-image {
            width: 22px;
            height: 22px;
          }
        }
        .line {
          display: block;
          height: 30rpx;
          width: 1px;
          background-color: gray;
        }
        .opt-home {
          .home-image {
            width: 50rpx;
            height: 50rpx;
          }
        }
      }
      .bar-title {
        width: 45%;
        font-size: 19px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
  .placeholder-bar {
    width: 100%;
  }
}
</style>