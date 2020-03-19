import axios from './request.js'

export const imgBaseUrl = 'http://47.108.67.109/';

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
                    duration: 1000
                })
                setTimeout(()=>{
                    wx.reLaunch({
                        url: '../orderList/main'
                    })
                },1000)
            },
            fail (res) { 
                console.log(res,'失败')
            }
        })
    } ).catch( err => {
        reject(err);
    } )
    console.log(7878888)
}