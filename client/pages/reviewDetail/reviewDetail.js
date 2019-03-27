const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
//音频播放
const innerAudioContext = wx.createInnerAudioContext()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,

    movieImage: "",
    title: "",
    userAvatar: "",
    userName: "",
    review: "",
    movie_id: "",
    review_id: "",
    reviewType: "",

    showModal: false,
    isPlayingAudio: false,


    hasMyReview:false,
    myReview:'',
    myReviewType: '',
    myMode:false //显示 我自己的影评详情 则不需要下方两个按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.checkLogState()
    // console.log(options)
    this.setData({
      movieImage: options.image,
      title: options.title,
      userAvatar: options.user_avatar,
      userName: options.user_name,
      review: options.movie_review.replace('%3D', '='),
      movie_id: options.movie_id,
      review_id: options.review_id,
      review_type: options.review_type,
      myMode: options.myMode
    })
    if (this.userInfo){
      this.queryReview(this.data.movie_id, this.userInfo.openId)
    }
  },

  //播放语音影评
  playAudio: function(){
    //判断是否正在播放 否则开始播放 是则停止播放
    if (this.data.isPlayingAudio == false) {
      let voiceUrl = this.data.review
      innerAudioContext.play()

      innerAudioContext.autoplay = true
      innerAudioContext.src = voiceUrl
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
      innerAudioContext.onEnded(() => {
        this.setData({
          isPlayingAudio: false
        })
        console.log('播放完毕')
      })
      innerAudioContext.onStop(() => {
        this.setData({
          isPlayingAudio: false
        })
        console.log('播放中止')
      })

      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
      })
      this.setData({
        isPlayingAudio: true
      })
    } else {
      innerAudioContext.stop()
      this.setData({
        isPlayingAudio: false
      })
    }
  },

  //查询用户是否评论过该电影
  queryReview(movie_id, user_id){
    let id = user_id
    if(!id)return
    qcloud.request({
      url: config.service.userReviews + id,
      login: true,
      success: result => {
        let data = result.data
        if (!data.code) {
          let resultArray = data.data
          for(var i = 0; i < resultArray.length; i++){
            if (resultArray[i].movie_id == this.data.movie_id){
              // console.log(resultArray[i])
              this.setData({
                hasMyReview:true,
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


  //收藏影评
  collectReview: function(event) {
    // console.log(this.data.userInfo)
    //如果未登录则先登录
    if (!this.data.userInfo) {
      console.log('登录')
      this.onTapLogin()
    }

    // console.log(this.data)
    wx.showLoading({
      title: '正在收藏影评'
    })
    let id = this.data.review_id
    qcloud.request({
      url: config.service.collect + id,
      login: true,
      method: 'PUT',
      success: result => {
        let data = result.data
        wx.hideLoading()
        if (!data.code) {
          wx.showToast({
            title: '收藏影评成功'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '收藏影评失败'
          })
        }
      },
      fail: (err) => {
        console.log(err)
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '收藏影评失败'
        })
      }
    })
  },


  //写影评
  addReview: function(event) {
    //如果未登录则先登录
    if(!this.data.userInfo){
      this.onTapLogin()
      this.onTapLogin()
    }

    this.setData({
      showModal: true
    })
  },

  //选择文字影评
  useText: function(event) {
    this.setData({
      showModal: false,
      reviewType: 'text'
    })
    this.toEditReview()
  },

  //选择语音影评
  useVoice: function(event) {
    this.setData({
      showModal: false,
      reviewType: 'audio'
    })
    this.toEditReview()
  },

  //跳转影评编辑页面
  toEditReview() {
    wx.navigateTo({
      url: `/pages/editReview/editReview?movie_id=${this.data.movie_id}&movieImage=${this.data.movieImage}&title=${this.data.title}&reviewType=${this.data.reviewType}`,
    })
  },

  //取消
  cancel: function(event) {
    this.setData({
      showModal: false
    })
  },

  //查看我的影评
  seeMyReview(){
    wx.navigateTo({
      url: `/pages/reviewDetail/reviewDetail?user_name=${this.data.userInfo.nickName}&user_avatar=${this.data.userInfo.avatarUrl}&movie_review=${this.data.myReview}&image=${this.data.movieImage}&title=${this.data.title}&movie_id=${this.data.movie_id}&review_id=${this.data.review_id}&review_type=${this.data.myReviewType}&myMode=true`,
    })
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
      },
      error: () => {
        console.log('fail')
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },

  //检查是否登录
  checkLogState() {
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.checkLogState()
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