/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)


/**看看侃侃电影接口 */

//获取所有影评
router.get('/reviews', controllers.review.reviews)
//获取指定电影的所有影评
router.get('/reviews/:id', controllers.review.review)
//获取所有电影
router.get('/movies', controllers.movie.movieList)
//获取单个电影
router.get('/movies/:id', controllers.movie.movieDetail)
//获取某个影评 
router.get('/reviewDetail/:id', controllers.review.reviewDetail)

//提交影评
router.put('/submitReview', validationMiddleware,controllers.review.submitReview)
//收藏影评
router.put('/collect/:id', validationMiddleware,controllers.collection.collect)

//获取用户  "已收藏的" 影评列表
router.get('/collectedReviews/:id', validationMiddleware, controllers.collection.collectedReviews)
//获取用户  "已发布的" 影评列表
router.get('/userReviews/:id', validationMiddleware, controllers.review.userReviews)
module.exports = router
