const DB = require('../utils/db.js')

module.exports = {

  /**
   * 获取所有影评
   */

  reviews: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movie_review")
  },

  /**
   * 根据电影id获取某个电影的所有影评
   */

  review: async ctx => {
    movieID = +ctx.params.id
    ctx.state.data = await DB.query("SELECT * FROM movie_review WHERE movie_review.movie_id=?", [movieID])
  },

  /**
   * 根据影评id获得单个影评的详细信息
   */
  reviewDetail:async ctx => {
    reviewID = +ctx.params.id
    ctx.state.data = await DB.query("SELECT * FROM movie_review WHERE movie_review.id=?", [reviewID])
  },

  /**
   * 提交影评
   */

  submitReview: async ctx => {
    let userId = ctx.state.$wxInfo.userinfo.openId
    let userName = ctx.state.$wxInfo.userinfo.nickName
    let userAvatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let movieId = +ctx.request.body.movieId
    let type = ctx.request.body.type
    let movieTitle = ctx.request.body.movieTitle
    let movie_image = ctx.request.body. movie_image
    let movie_review = ctx.request.body.movie_review || null
    let duration = ctx.request.body.duration || 0

    await DB.query('INSERT INTO movie_review(movie_id,movie_title,movie_image,user_id,user_name,user_avatar,type,duration,movie_review) VALUES (?,?,?,?,?,?,?,?,?)', [movieId, movieTitle, movie_image, userId, userName, userAvatar, type, duration, movie_review])
  },

  /**
   * 获取某个用户发布的所有影评
   */
  userReviews: async ctx => {
    userID = ctx.params.id
    ctx.state.data = await DB.query("SELECT * FROM movie_review WHERE movie_review.user_id=?", [userID])
  },

  // /**
  //  * 影评详情页:  查询某用户对某电影的影评
  //  */

  // queryReview: async ctx => {
  //   movieID = +ctx.params.id
  //   let userId = ctx.state.$wxInfo.userinfo.openId
  //   ctx.state.data = await DB.query("SELECT * FROM movie_review WHERE movie_review.user_id=? and review_id = ?", [userID],movieID)
  // } 

}