/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://x03sgz0a.qcloud.la';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/weapp/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `${host}/weapp/user`,

    // 测试的信道服务地址
    tunnelUrl: `${host}/weapp/tunnel`,

    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,

    // 拉取用户信息
    user: `${host}/weapp/user`,


    /**看看侃侃电影 */

    //获取所有电影影评
    reviews: `${host}/weapp/reviews`,

    //获取指定电影的所有影评
    review: `${host}/weapp/reviews/`,

    //热门电影/所有电影
    hotMovies: `${host}/weapp/movies`,

    //单个电影
    movieDetail: `${host}/weapp/movies/`,

    //单个影评
    reviewDetail: `${host}/weapp/reviewDetail/`,

    //上传影评
    submitReview: `${host}/weapp/submitReview`,

    //收藏影评
    collect: `${host}/weapp/collect/`,

    //获取指定用户发布的所有影片
    userReviews: `${host}/weapp/userReviews/`,
    
    //获取指定用户收藏的所有影片
    collectedReviews: `${host}/weapp/collectedReviews/`,


    //首页推荐
    // homeRecommendation: `${host}/weapp/recommendation`,

    //添加评论
    // addReview: `${host}/weapp/addReview`,
  }
};

module.exports = config;