const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList: []
  },

  //电影详情
  onMovieDetail: function(event) {
    let image = event.currentTarget.dataset.image
    let title = event.currentTarget.dataset.title
    let description = event.currentTarget.dataset.description
    let movie_id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/movieDetail/movieDetail?image=${image}&title=${title}&description=${description}&movie_id=${movie_id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMoviews()
  },

  //拉取热门电影
  getMoviews() {
    qcloud.request({
      url: config.service.hotMovies,
      // login: true,
      success: result => {
        wx.hideLoading()
        if (!result.code) {
          wx.showToast({
            icon: 'none',
            title: '刷新电影数据成功',
          })
          console.log(result)
          this.setData({
            movieList: result.data.data
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