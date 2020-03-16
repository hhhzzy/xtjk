
import axios from '../../utils/request.js'
import Toast from '../../../static/vant/toast/toast'

const state = {
    token: wx.getStorageSync('token'),
    userInfo:wx.getStorageSync('userInfo')
}

const mutations = {
    'SET_TOKEN'(state,data){
        state.token = data;
    },
    'SET_USER'(state,data){
        state.userInfo = data;
    }
}

const actions  = {
    login({commit},userInfo){
        return new Promise( (resolve, reject) => {
            console.log(userInfo)
            axios({
                url: 'api/login',
                method: 'post',
                data:userInfo
            }).then( data => {
                console.log(data);
                if(data.data.code == 1){
                    commit('SET_TOKEN',data.data.data.token);
                    commit('SET_USER',data.data.data.user);
                    wx.setStorageSync('token', data.data.data.token);
                    wx.setStorageSync('userInfo', data.data.data.user);
                    mpvue.switchTab({ 
                        url: '../index/main'
                    })
                    resolve();
                } else {
                    Toast({
                        type: 'fail',
                        message: '登录失败，请重新登录',
                        onClose: () => {
                            mpvue.navigateTo({ 
                                url: '../authorize/main'
                            })
                        }
                    });
                }
            } ).catch( err => {
                reject(err);
            } )
            
        } )
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}