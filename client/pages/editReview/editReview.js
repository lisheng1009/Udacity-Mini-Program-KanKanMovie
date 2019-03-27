const app = getApp()
//录音管理器
const recorderManager = wx.getRecorderManager()
//音频播放
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    movieImage: '',
    title: '',
    movie_id: '',

    reviewValue: '',
    reviewType: '',
    audioPath: '',
    duration:'',
    isPlayingAudio: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      movieImage: options.movieImage,
      title: options.title,
      movie_id: options.movie_id,
      reviewType: options.reviewType
    })
  },

  //手指放开-结束录音
  onEndRecord(e){
    recorderManager.stop()
  },

  //手指长按-开始录音
  onStartRecord(e) {

    //开始录音
    recorderManager.start({
      format: 'mp3',
    })

    //开始录音回调
    recorderManager.onStart(() => {
      wx.showToast({
        title: '开始录音',
        icon: 'loading'
      })
    })

    //录音结束回调
    recorderManager.onStop((res) => {
      wx.showToast({
        title: '录制结束',
      })
      
      //录音临时存放地址 和 录音时间

      let intDuration = parseInt(res.duration / 1000)

      this.setData({
        audioPath: res.tempFilePath,
        duration: intDuration,
        reviewValue: res.tempFilePath
      })
      console.log('录音文件地址',this.data.audioPath)
      console.log('录音时长',this.data.duration)
    })

    //录音失败回调
    recorderManager.onError(function(err) {
      wx.showToast({
        icon: 'none',
        title: '录音失败'
      })
    });
  },


  //播放录音
  playAudio(e) {
    if (!this.data.audioPath){
      wx.showToast({
        icon: 'none',
        title: '您还没有录制语音'
      })
      return
    } 

    //判断是否正在播放 否则开始播放 是则停止播放
    if (this.data.isPlayingAudio == false){
      console.log('录音地址', this.data.audioPath)
      let voiceUrl = this.data.audioPath
      // innerAudioContext.src = voiceUrl
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
    }else{
      innerAudioContext.stop()
      this.setData({
        isPlayingAudio: false
      })
    }

  },

  onInput(event) {
    this.setData({
      reviewValue: event.detail.value.trim()
    })
  },

  addreview(event) {

    let review = this.data.reviewValue
    if (!review) return
    wx.navigateTo({
      url: `/pages/preview(影评预览)/preview?movie_id=${this.data.movie_id}&movieImage=${this.data.movieImage}&title=${this.data.title}&review=${review.replace('=', '%3D')}&reviewType=${this.data.reviewType}&duration=${this.data.duration}`,
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