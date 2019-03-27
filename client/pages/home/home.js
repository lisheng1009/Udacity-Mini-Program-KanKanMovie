const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({
  data: {
    reviewInfo: {}, //一条随机影评
    filmInfo: {} //电影详细信息
  },

  //跳转影评详情
  reviewDetail: function(event) {
    console.log(this.data.reviewInfo)
    wx.navigateTo({
      url: `/pages/reviewDetail/reviewDetail?user_name=${this.data.reviewInfo.user_name}&user_avatar=${this.data.reviewInfo.user_avatar}&movie_review=${this.data.reviewInfo.movie_review.replace('=', '%3D')}&image=${this.data.filmInfo.image}&title=${this.data.filmInfo.title}&movie_id=${this.data.filmInfo.id}&review_id=${this.data.reviewInfo.id}&review_type=${this.data.reviewInfo.type}&myMode=`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

//获取影评
getReviews(){
  qcloud.request({
    url: config.service.reviews,
    success: result => {
      // console.log(result)
      wx.hideLoading()
      if (!result.code) {
        //获取所有影评后随机抽取一条展示
        const mArray = result.data.data
        const radomMovie = mArray[Math.round(Math.random() * (mArray.length - 1))]
        this.setData({
          reviewInfo: radomMovie
        })
        const id = radomMovie.movie_id
        this.getFilmInfo(id)
      } else {
        wx.showToast({
          icon: 'none',
          title: '刷新电影数据失败',
        })
      }
    },
    fail: () => {
      wx.hideLoading()

      wx.showToast({
        icon: 'none',
        title: '刷新电影数据失败',
      })
    }
  })
},




  //根据电影id获取电影信息
  getFilmInfo(id) {
    qcloud.request({
      url: config.service.movieDetail + id,
      success: result => {
        // console.log(result)
        wx.hideLoading()
        if (!result.code) {
          this.setData({
            filmInfo: result.data.data[0]
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '刷新电影数据失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '刷新电影数据失败',
        })
      }
    })
  },


  //点击海报图跳转至电影详情页
  movieDetail: function() {
    let image = this.data.filmInfo.image
    let title = this.data.filmInfo.title
    let description = this.data.filmInfo.description
    let movie_id = this.data.filmInfo.id
    wx.navigateTo({
      url: `/pages/movieDetail/movieDetail?image=${image}&title=${title}&description=${description}&movie_id=${movie_id}`,
    })
  },

  //跳转至热门电影页
  hotMovies: function(event) {
    wx.navigateTo({
      url: '/pages/hotMovies/hotMovies',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //跳转至个人中心页
  my: function(event) {
    wx.navigateTo({
      url: '/pages/my/my',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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
    //每次到主页就刷新一下
    this.getReviews()
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