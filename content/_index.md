+++
title = "个人主页"
template = "index.html"

[extra.i18n]
learn_more = "了解更多"
all_rights_reserved = "保留所有权利。"
contact_email = "联系邮箱"
theme_label = "主题"
hot = "热门"
new = "最新"

[extra.nav.message]
enable = true
text = "🎉 访问作者博客"
url = "https://blog.jiaxiang.wang"

[extra.nav.center]
menus = [
    { name = "主页", url = "主页", internal = true },
    { name = "主题", url = "主题", internal = true },
    { name = "博客", url = "博客", internal = true },
    { name = "媒体", url = "媒体", internal = true },
    { name = "项目", url = "https://blog.jiaxiang.wang/tags/project/", internal = false },
]

[extra.nav.right]
menus = [
    { name = "作者博客", url = "https://blog.jiaxiang.wang", internal = false },
    { name = "作者 Github", url = "https://github.com/iWangJiaxiang", internal = false },
]

[[extra.index.widgets]]
type = "header"
[extra.index.widgets.value]
title_1 = "王嘉祥"
title_2 = "Jiaxiang Wang"
bio_1 = "专注于科技、音乐等领域<span class=\"inline-word\">跨界创新</span>"
bio_2 = "分享经验与见解"
about_url = "https://blog.jiaxiang.wang/about/"
cover = "/img/logo.svg"
[[extra.index.widgets.value.links]]
class_icon = " icon-github-line"
url = "https://github.com/iWangJiaxiang"
[[extra.index.widgets.value.links]]
class_icon = " icon-github-line"
url = "https://github.com/iWangJiaxiang"


[[extra.index.widgets]]
type = "author"
[extra.index.widgets.value]
name = "王嘉祥"
avatar = "/img/logo01.webp"
title = "Team leader, architect,"
bio = '''"专注于科技、音乐等领域跨界创新，分享经验与见解""专注于科技、音乐等领域跨界创新，分享经验与见解""专注于科技、音乐等领域跨界创新，分享经验与见解""专注于科技、音乐等领域跨界创新，分享经验与见解""专注于科技、音乐等领域跨界创新，分享经验与见解""专注于科技、音乐等领域跨界创新，分享经验与见解""专注于科技、音乐等领域跨界创新，分享经验与见解""专注于科技、音乐等领域跨界创新，分享经验与见解"'''


[[extra.index.widgets]]
type = "featured-posts"
[extra.index.widgets.value]
title = "推荐文章"
bio = "精选好文，值得一读"
style = "background: linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%);"
[[extra.index.widgets.value.columns]]
title = "🔧 科技"
[[extra.index.widgets.value.columns.items]]
title = "Pangolin：基于零信任理念的反向代理"
url = "https://blog.jiaxiang.wang/articles/pangolin-a-reverse-proxy-for-zero-trust-network/"
[[extra.index.widgets.value.columns.items]]
title = "GitHub Action：让静态网站实现定时发布"
url = "https://blog.jiaxiang.wang/articles/github-action-makes-static-site-publish-on-schedule/"
[[extra.index.widgets.value.columns.items]]
title = "拥抱AVIF：提升网站加载速度的最佳实践，附Zola模板"
url = "https://blog.jiaxiang.wang/articles/use-avif-to-enhance-website-speed-and-zola-macro-template/"
[[extra.index.widgets.value.columns]]
title = "🎵 音乐"
[[extra.index.widgets.value.columns.items]]
title = "前无古人唱超算，《超算为家国天下》"
url = "https://blog.jiaxiang.wang/articles/sc-song/"
[[extra.index.widgets.value.columns.items]]
title = "后有新人继绝学，《计算为古今未来》"
url = "https://blog.jiaxiang.wang/articles/cs-song/"
[[extra.index.widgets.value.columns.items]]
title = "给超算祛魅！95后理工男决定写歌唱出来"
url = "https://blog.jiaxiang.wang/articles/news-sc-song/"
[[extra.index.widgets.value.columns]]
title = "🌐 开源"
[[extra.index.widgets.value.columns.items]]
title = "回馈社区，本站博客主题正式开源！"
url = "https://blog.jiaxiang.wang/articles/announcement-of-opensource-blog-theme-project/"
[[extra.index.widgets.value.columns.items]]
title = "展示你独特的一面，个人主页主题正式开源！"
url = "https://blog.jiaxiang.wang/articles/announcement-of-opensource-personal-homepage-theme-project/"
[[extra.index.widgets.value.columns.items]]
title = "开源博客主题存在版权侵权风险吗？本站开源博客主题的深度合规分析"
url = "https://blog.jiaxiang.wang/articles/compliance-of-jiaxiang-wang-blog-theme/"


[[extra.index.widgets]]
type = "product-single"
[extra.index.widgets.value]
tip = "主页"
title = "个人主页<br>正式开源"
bio_1 = "像本页面一样，呈现美轮美奂<span class=\"inline-word\">效果</span>"
bio_2 = "轻松配置，快速构建你的<span class=\"inline-word\">个人主页</span>"
img = "/img/homepage-single.webp"
[[extra.index.widgets.value.links]]
class = "primary-button"
url = "https://github.com/iWangJiaxiang/Homepage-Creators"
name = "立刻获取源代码"
[[extra.index.widgets.value.links]]
class = "second-link"
url = "https://github.com/iWangJiaxiang"
name = "开发者主页"


[[extra.index.widgets]]
type = "event"
[extra.index.widgets.value]
tip = "大事件"
title = "王嘉祥博客主题<br>正式开源！"
bio = "一个为创作者而构建的主题，0成本、0运维开始你的博客生涯，与各位优秀博主一同进步！"
button = "立刻获取源代码"
note = "基于 Zola 构建"
url = "https://github.com/iWangJiaxiang/zola-theme-jiaxiang.wang"
img = "/img/blog-event.webp"


[[extra.index.widgets]]
type = "product-single"
[extra.index.widgets.value]
tip = "博客"
title = "新奇的事物<br>有趣的思想"
bio_1 = "备受喜爱的知识共享<span class=\"inline-word\">博客</span>"
bio_2 = "已帮助数百万互联网使用者更好的探索数字<span class=\"inline-word\">世界</span>"
img = "/img/blog.webp"
style = "background-image: linear-gradient(180deg, #830FC1 0%, #3D00A0 100%);"
[[extra.index.widgets.value.links]]
class = "primary-button"
url = "https://blog.jiaxiang.wang/"
name = "访问博客"
[[extra.index.widgets.value.links]]
class = "second-link"
url = "https://blog.jiaxiang.wang/articles/misc/from-0-to-1-the-blog-review/"
name = "创站故事"


[[extra.index.widgets]]
type = "product-list"
[extra.index.widgets.value]
title = "媒体"
bio = "为互联网共享精神添砖加瓦"
[[extra.index.widgets.value.items]]
logo = "/img/internet.svg"
title = "个人博客"
bio = "专注于科技、音乐等领域跨界创新，分享经验与见解"
url = "https://blog.jiaxiang.wang/"
button = "访问"
[[extra.index.widgets.value.items]]
logo = "/img/afdian.png"
title = "爱发电"
bio = "分享有趣又有料的文章与资源"
url = "https://afdian.com/a/wangjiaxiang"
button = "访问"
note = "订阅制"
new = true
[[extra.index.widgets.value.items]]
logo = "/img/wechat.svg"
title = "公众号"
bio = "第一时间获取动态"
url = "https://blog.jiaxiang.wang/wechat"
button = "访问"
hot = true
[[extra.index.widgets.value.items]]
logo = "/img/follow.svg"
title = "Follow"
bio = "一站式获取文章订阅"
url = "https://app.follow.is/share/feeds/89889813571729408"
button = "访问"
new = true


[[extra.index.widgets]]
type = "product-single"
[extra.index.widgets.value]
tip = "主题"
title = "博客主题<br>开源共享"
bio_1 = "0成本0运维搭建属于你的<span class=\"inline-word\">博客站点</span>"
bio_2 = "进入创作分享的<span class=\"inline-word\">博客世界</span>"
img = "/img/theme-single.webp"
style = "background-image: linear-gradient(180deg, #0F6AC1 0%, #002EA0 100%);"
style_tip = "color: white; opacity: 0.6;"
[[extra.index.widgets.value.links]]
class = "primary-button"
url = "https://github.com/iWangJiaxiang/zola-theme-jiaxiang.wang"
name = "访问项目"
[[extra.index.widgets.value.links]]
class = "second-link"
url = "https://theme.jiaxiang.wang/"
name = "访问演示站点"


[[extra.index.widgets]]
type = "product-list"
[extra.index.widgets.value]
title = "主题"
bio = "帮助更多用户构建出非凡的网站"
[[extra.index.widgets.value.items]]
logo = "/img/internet.svg"
title = "Jiaiang.Wang"
bio = "纯静态个人博客主题 (Zola)"
url = "https://github.com/iWangJiaxiang/zola-theme-jiaxiang.wang"
button = "访问"
note = "本人博客主题"
hot = true
[[extra.index.widgets.value.items]]
logo = "/img/internet.svg"
title = "Homepage Creators"
bio = "纯静态个人主页主题 (Zola)"
url = "https://github.com/iWangJiaxiang/Homepage-Creators"
button = "访问"
note = "本站主题"
new = true
+++
