<template>
    <div class="gzh" :style="{'height':'calc(100% - '+navBarHeight+'px )'}">
        <navbar :backVisible="false" :title="'公众号'"></navbar>
        <img src="../../../static/images/gzh.png" alt="">
    </div>
</template>
<script>
import navbar from '../../components/navbar'
export default {
    data () {
        return {
            navBarHeight:null
        }
    },

    components: {
        navbar
    },
    onShow(){
        const self = this;
        wx.getSystemInfo({
            success(system) {
                let statusBarHeight = system.statusBarHeight;
                let platformReg = /ios/i;
                let titleBarHeight = '';
                if (platformReg.test(system.platform)) {
                    titleBarHeight = 44;
                } else {
                    titleBarHeight = 48;
                }
                self.navBarHeight = statusBarHeight + titleBarHeight;
                console.log(self.navBarHeight)
            }
        });
    }
}
</script>
<style lang="less" scoped>
    img{
        width: 100%;
        height: 100%;
    }
</style>