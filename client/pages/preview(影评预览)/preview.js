// client/pages/preview(影评预览)/preview.js
const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')
const innerAudioContext = wx.createInnerAudioContext()
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
    movie_id: '',
    review: '',
    duration:'',
    reviewType: '',
    isPlayingAudio: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log(options.review, options.review.replace('%3D', '='))

    console.log(options)
    this.setData({
      movieImage: options.movieImage,
      title: options.title,
      movie_id: options.movie_id,
      review: options.review.replace('%3D', '='),
      reviewType: options.reviewType,
      duration: options.duration
    })
  },

  //播放音频
  playAudio: function() {
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

  //上传音频
  uploadAudio() {
    console.log(config.service.uploadUrl, this.data.review)
    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: this.data.review,
      name: 'file',
      success: res => {
        let data = JSON.parse(res.data)
        console.log("上传结果",res)
        if (!data.code) {
          console.log("上传得到的录音文件路径", data.data.imgUrl)
          this.setData({
            review: data.data.imgUrl
          })
        }
      },
      fail: function(res) {
        console.log('fail res',res)
      },
    })
  },



  //重新编辑
  backToRewrite() {
    wx.navigateBack({})
  },

  //发布影评
  submitReview(event) {
    // console.log('submit', this.data.movie_id, this.data.title, this.data.review)
    wx.showLoading({
      title: '正在发布影评'
    })

    //如果是音频 需要先上传
    if (this.data.reviewType == 'audio') {
      this.uploadAudio()
    }
    // return

    qcloud.request({
      url: config.service.submitReview,
      login: true,
      method: 'PUT',
      data: {
        movieId: this.data.movie_id,
        type: this.data.reviewType,
        movieTitle: this.data.title,
        movie_review: this.data.review,
        movie_image: this.data.movieImage,
        duration:this.data.duration
      },
      success: result => {
        wx.hideLoading()

        let data = result.data
        // console.log('insertResult' + result)
        if (!data.code) {
          wx.showToast({
            title: '发布影评成功'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: `/pages/reviewList(影评列表)/reviewList?movie_id=${this.data.movie_id}&image=${this.data.movieImage}`,
            })
          }, 1500)

        } else {
          wx.showToast({
            icon: 'none',
            title: '发表评论失败'
          })
        }
      },
      fail: (err) => {
        console.log(err)
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '发表评论失败'
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
      }
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