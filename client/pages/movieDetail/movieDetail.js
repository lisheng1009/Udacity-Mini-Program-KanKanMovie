// client/pages/reviewDetail/reviewDetail.js
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

    movieImage: '',
    title: '',
    description: '',
    movie_id: '',

    showModal: false,

    hasMyReview: false,
    myReview: '',
    myReviewType: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    this.setData({
      movieImage: options.image,
      title: options.title,
      description: options.description,
      movie_id: options.movie_id
    })
    if (this.userInfo) {
      this.queryReview(this.data.movie_id, this.userInfo.openId)
    }
  },

  //查询用户是否评论过该电影
  queryReview(movie_id, user_id) {
    let id = user_id
    if (!id) return
    qcloud.request({
      url: config.service.userReviews + id,
      login: true,
      success: result => {
        let data = result.data
        if (!data.code) {
          let resultArray = data.data
          for (var i = 0; i < resultArray.length; i++) {
            if (resultArray[i].movie_id == this.data.movie_id) {
              // console.log(resultArray[i])
              this.setData({
                hasMyReview: true,
                myReview: resultArray[i].movie_review,
                myReviewType: resultArray[i].type
              })
              break;
            }
          }
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

  //查看我的影评
  seeMyReview() {
    wx.navigateTo({
      url: `/pages/reviewDetail/reviewDetail?user_name=${this.data.userInfo.nickName}&user_avatar=${this.data.userInfo.avatarUrl}&movie_review=${this.data.myReview}&image=${this.data.movieImage}&title=${this.data.title}&movie_id=${this.data.movie_id}&review_id=${this.data.review_id}&review_type=${this.data.myReviewType}&myMode=true`,
    })
  },

  //查看影评
  seeReviews: function(event) {
    console.log('seeReviews')
    wx.navigateTo({
      url: `/pages/reviewList(影评列表)/reviewList?movie_id=${this.data.movie_id}&image=${this.data.movieImage}`,
    })
  },

  //添加影评  选择语音或文字
  addReviews: function(event) {

    //如果未登录则先登录
    if (!this.data.userInfo) {
      this.onTapLogin()
    }

    this.setData({
      showModal: true
    })
  },

  //选择添加文字影评
  useText: function(event) {
    this.setData({
      showModal: false
    })
    wx.navigateTo({
      url: `/pages/editReview/editReview?movie_id=${this.data.movie_id}&movieImage=${this.data.movieImage}&title=${this.data.title}&reviewType=text`,
    })

  },

  //选择添加音频影评
  useVoice: function(event) {
    this.setData({
      showModal: false
    })
    wx.navigateTo({
      url: `/pages/editReview/editReview?movie_id=${this.data.movie_id}&movieImage=${this.data.movieImage}&title=${this.data.title}&reviewType=audio`,
    })
  },

  //取消添加影评
  cancel: function(event) {
    this.setData({
      showModal: false
    })
  },

  //点击登录
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
        this.queryReview(this.data.movie_id, userInfo.openId)
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