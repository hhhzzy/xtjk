import axios from './request.js'

export const imgBaseUrl = 'https://www.xtjianbei.com/';
// export const imgBaseUrl = 'http://47.108.67.109/';

export async function wxpay(memberId,memberOrderId,text,total_fee){
    wx.showLoading({
        title: '支付中请稍后',
    })
    let code = null;
    // 1.获取code
    await  new Promise( (resolve,reject) => {
        wx.login({
            success: async res => {
                // 获取到用户的 code 之后：res.code
                console.log(res.code);
                code = res.code;
                resolve();
            }
        });
    } )
    /**
     *  2.调取后台接口获取支付信息
     *  memberId： 用户id
     *  memberOrderId：订单id
     *  body：商品介绍
     *  code：登录的code
     *  total_fee：总的价格
     * */ 
    console.log(memberId,memberOrderId,text,total_fee)
    axios({
        url: 'api/weixinpay/getSin?memberId='+memberId+'&memberOrderId='+memberOrderId+'&body='+text+'&code='+code+'&total_fee='+total_fee,
        method: 'get',
    }).then( res => { 
        const data = res.data.data;
        console.log(data)
        wx.hideLoading();
        // 3.调取二维码支付
        wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: data.package,
            signType: 'MD5',
            paySign: data.paySign,
            success (res) { 
                console.log(res,'成功')
                wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 1000,
                    success:function(){
                        mpvue.navigateTo({ url:'../orderInfo/main?orderId='+memberOrderId })
                    }
                })
            },
            fail (res) { 
                wx.showModal({
                    title: '提示',
                    content: '付款失败，请重新支付！',
                    success (res) {
                      if (res.confirm) {
                        // mpvue.navigateTo({ url:'../orderInfo/main?orderId='+memberOrderId })
                      } else if (res.cancel) {
                        // mpvue.navigateTo({ url:'../orderInfo/main?orderId='+memberOrderId })
                      }
                    }
                })
            }
        })
    } ).catch( err => {
        reject(err);
    } )
}