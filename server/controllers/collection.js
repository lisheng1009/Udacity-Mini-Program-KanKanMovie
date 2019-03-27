const DB = require('../utils/db.js')

module.exports = {
  /**
   * 收藏影评
   */
  collect: async ctx => {
    collectID = +ctx.params.id
    let userId = ctx.state.$wxInfo.userinfo.openId
    await DB.query('INSERT INTO collection(user_id,review_id) VALUES (?,?)', [userId, collectID])
  },

  /**
   * 获取指定用户的 已收藏的 所有影评
   */
  collectedReviews: async ctx =>{
    userID = ctx.params.id
    ctx.state.data = await DB.query("select    a.*,b.movie_title,b.movie_image,b.movie_review,b.type,b.user_avatar,b.user_name  from collection  a inner  join movie_review b on a.review_id=b.id where a.user_id=?", [userID])
  }

}