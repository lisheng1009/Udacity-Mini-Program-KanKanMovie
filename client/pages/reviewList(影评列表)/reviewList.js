const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
//音频播放
const innerAudioContext = wx.createInnerAudioContext()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie_id:'',
    reviewList: [],
    image: '',

    playingID:'',//正在播放的音频的review_id, 用来区分
    isPlayingAudio: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log('reviewList')
    // console.log(options)
    this.setData({
      image: options.image,
      movie_id: options.movie_id
    })
    this.getMoviews()
  },

  //拉取电影数据
  getMoviews(){
    qcloud.request({
      url: config.service.review + this.data.movie_id,
      success: result => {

        wx.showToast({
          icon: 'none',
          title: '成功刷新影评数据',
        })

        console.log('reviewList')
        console.log(result)
        wx.hideLoading()
        if (!result.code) {
          this.setData({
            reviewList: result.data.data
          })

        } else {
          wx.showToast({
            icon: 'none',
            title: '刷新影评数据失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '刷新影评数据失败',
        })
      }
    })
  },

  //播放音频
  playAudio:function(event){
    //如果当前没有正在播放的音频, 则点击播放
    if (this.data.isPlayingAudio == false) {

      let voiceUrl = event.currentTarget.dataset.review
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
        isPlayingAudio: true,
        playingID: event.currentTarget.dataset.review_id
      })
    } else {

      if (event.currentTarget.dataset.review_id == this.data.playingID){
        innerAudioContext.stop()
        this.setData({
          isPlayingAudio: false
        })
      }else{
        innerAudioContext.stop()
        innerAudioContext.play()
      }
    }
  },

  //影评详情
  onReviewDetail: function(event) {

    let user_name = event.currentTarget.dataset.name
    let user_avatar = event.currentTarget.dataset.avatar
    let type = event.currentTarget.dataset.type
    let movie_review = event.currentTarget.dataset.review
    let title = event.currentTarget.dataset.title
    let movie_id = event.currentTarget.dataset.movie_id
    let review_id = event.currentTarget.dataset.review_id

    console.log(type, movie_id)
    wx.navigateTo({
      url: `/pages/reviewDetail/reviewDetail?user_name=${user_name}&user_avatar=${user_avatar}&review_type=${type}&movie_review=${movie_review.replace('=', '%3D')}&image=${this.data.image}&title=${title}&movie_id=${movie_id}&review_id=${review_id}&myMode=`,
    })
  },

  backToHome: function() {
    wx.reLaunch({
      url: '/pages/home/home',
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
    this.getMoviews(() => {
      wx.stopPullDownRefresh()
    })
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