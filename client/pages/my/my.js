const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    reviewList: [],

    submitReviews:[],
    collectedReviews:[],
    tab:0
  },

  //获取所有已发布的影评
  getAllSubmitReviews(id) {
    wx.showLoading({
      title: '正在拉取影评'
    })
    qcloud.request({
      url: config.service.userReviews + id,
      login: true,
      success: result => {
        let data = result.data
        console.log(result)
        wx.hideLoading()
        if (!data.code) {
          this.setData({
            reviewList: data.data,
            submitReviews: data.data
          })
          wx.showToast({
            title: '拉取影评成功'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '拉取影评失败'
          })
        }
      },
      fail: (err) => {
        console.log(err)
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '拉取影评失败'
        })
      }
    })
  },

  //获取所有已收藏的影评
  getAllCollectedReviews(id) {
    wx.showLoading({
      title: '正在拉取影评'
    })
    qcloud.request({
      url: config.service.collectedReviews + id,
      login: true,
      success: result => {
        let data = result.data
        console.log('collection')
        console.log(data.data)
        wx.hideLoading()
        if (!data.code) {
          this.setData({
            collectedReviews: data.data,
            // reviewList:data.data
          })
          wx.showToast({
            title: '拉取影评成功'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '拉取影评失败'
          })
        }
      },
      fail: (err) => {
        console.log(err)
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '拉取影评失败'
        })
      }
    })
  },

  //跳转影评详情
  onReviewDetail: function(event) {
    let user_name = event.currentTarget.dataset.name
    let user_avatar = event.currentTarget.dataset.avatar
    let type = event.currentTarget.dataset.type
    let movie_review = event.currentTarget.dataset.review
    let title = event.currentTarget.dataset.title
    let movie_id = event.currentTarget.dataset.movieId
    let movie_image = event.currentTarget.dataset.image
    let review_id = event.currentTarget.dataset.review_id

    wx.navigateTo({
      url: `/pages/reviewDetail/reviewDetail?user_name=${user_name}&user_avatar=${user_avatar}&review_type=${type}&movie_review=${movie_review}&image=${movie_image}&title=${title}&movie_id=${movie_id}&review_id=${review_id}&myMode=`,
    })
  },

  //按钮选择 我发布的影评
  getSubmit:function(){
    this.setData({
      reviewList: this.data.submitReviews,
      data:0
    })
  },

  //按钮选择 我收藏的影评
  getCollect: function () {
    this.setData({
      reviewList: this.data.collectedReviews,
      data: 1
    })
  },

  //回到首页
  backToHome:function(){
    wx.navigateBack({
      
    })
  },

  onTapAddress() {
    wx.showToast({
      icon: 'none',
      title: '此功能暂未开放'
    })
  },

  onTapKf() {
    wx.showToast({
      icon: 'none',
      title: '此功能暂未开放'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  onTapLogin: function() {
    app.login({
      success: ({
        userInfo
      }) => {
        console.log('success')
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
        this.getAllSubmitReviews(userInfo.openId)
      },
      error: () => {
        console.log('fail')
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 同步授权状态
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo
        })
        this.getAllSubmitReviews(userInfo.openId)
        this.getAllCollectedReviews(userInfo.openId)
      }
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})