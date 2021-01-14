(window.webpackJsonp=window.webpackJsonp||[]).push([[270],{1608:function(s,a,n){"use strict";n.r(a);var e=n(13),r=Object(e.a)({},(function(){var s=this,a=s.$createElement,n=s._self._c||a;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h1",{attrs:{id:"_070-基于-nginx-lua-完成商品详情页访问流量实时上报-kafka-的开发"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#_070-基于-nginx-lua-完成商品详情页访问流量实时上报-kafka-的开发"}},[s._v("#")]),s._v(" 070. 基于 nginx+lua 完成商品详情页访问流量实时上报 kafka 的开发")]),s._v(" "),n("p",[s._v("本章节要实现的就是：在 nginx 这一层，接收到访问请求的时候，就把请求的流量上报发送给 kafka，\n这样的话，storm 才能去消费 kafka 中的实时的访问日志，然后去进行缓存热数据的统计")]),s._v(" "),n("p",[s._v("使用到的 lua 工具包："),n("a",{attrs:{href:"https://github.com/doujiang24/lua-resty-kafka",target:"_blank",rel:"noopener noreferrer"}},[s._v("lua-resty-kafka"),n("OutboundLink")],1)]),s._v(" "),n("h2",{attrs:{id:"安装-lua-resty-kafka"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#安装-lua-resty-kafka"}},[s._v("#")]),s._v(" 安装 lua-resty-kafka")]),s._v(" "),n("p",[n("RouterLink",{attrs:{to:"/cache-pdp/053.html"}},[s._v("nginx 三台的作用")]),s._v("：")],1),s._v(" "),n("ul",[n("li",[s._v("eshop-01：应用层")]),s._v(" "),n("li",[s._v("eshop-02：应用层")]),s._v(" "),n("li",[s._v("eshop-03：分发层")])]),s._v(" "),n("p",[s._v("我们需要在 01 和 02 应用层上装上该依赖，并编写上报脚本")]),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" /usr/local/\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("wget")]),s._v(" https://github.com/doujiang24/lua-resty-kafka/archive/master.zip\nyum "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" -y "),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("unzip")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("unzip")]),s._v(" master.zip\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# resty 目录下是 kafka 目录，其实就是讲 kafka 目录放到 lualib 中去")]),s._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[s._v("cp")]),s._v(" -rf /usr/local/lua-resty-kafka-master/lib/resty/ /usr/hello/lualib\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 加载依赖包，其实后续写完脚本之后也需要 reload 的")]),s._v("\n/usr/servers/nginx/sbin/nginx -s reload\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br")])]),n("h2",{attrs:{id:"脚本编写"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#脚本编写"}},[s._v("#")]),s._v(" 脚本编写")]),s._v(" "),n("p",[s._v("在 "),n("code",[s._v("/usr/hello/lua/product.lua")]),s._v(" 中增加这段逻辑")]),s._v(" "),n("p",[s._v("提示：这种工具类的核心写法，在该工具官网 github 中有示例")]),s._v(" "),n("p",[s._v("该段逻辑由于比较独立，可以放在 product.lua 顶部。")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v('local cjson = require("cjson")\n-- 引用之前安装的工具包\nlocal producer = require("resty.kafka.producer")\n\nlocal broker_list = {\n  { host = "192.168.99.170", port = 9092 },  \n  { host = "192.168.99.171", port = 9092 },  \n  { host = "192.168.99.172", port = 9092 }\n}\n\n-- 定义日志信息\nlocal log_json = {}\nlog_json["headers"] = ngx.req.get_headers()  \nlog_json["uri_args"] = ngx.req.get_uri_args()  \nlog_json["body"] = ngx.req.read_body()  \nlog_json["http_version"] = ngx.req.http_version()  \nlog_json["method"] =ngx.req.get_method()\nlog_json["raw_reader"] = ngx.req.raw_header()  \nlog_json["body_data"] = ngx.req.get_body_data()\n\n-- 序列化为一个字符串\nlocal message = cjson.encode(log_json);  \n\n-- local offset, err = p:send("test", key, message)\n-- 这里的 key 只是作为消息路由分区使用，kafka 中的概念\nlocal productId = ngx.req.get_uri_args()["productId"]\n-- 异步发送信息\nlocal async_producer = producer:new(broker_list, { producer_type = "async" })   \nlocal ok, err = async_producer:send("access-log", productId, message)  \n\nif not ok then  \n    ngx.log(ngx.ERR, "kafka send err:", err)  \n    return  \nend\n')])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br"),n("span",{staticClass:"line-number"},[s._v("12")]),n("br"),n("span",{staticClass:"line-number"},[s._v("13")]),n("br"),n("span",{staticClass:"line-number"},[s._v("14")]),n("br"),n("span",{staticClass:"line-number"},[s._v("15")]),n("br"),n("span",{staticClass:"line-number"},[s._v("16")]),n("br"),n("span",{staticClass:"line-number"},[s._v("17")]),n("br"),n("span",{staticClass:"line-number"},[s._v("18")]),n("br"),n("span",{staticClass:"line-number"},[s._v("19")]),n("br"),n("span",{staticClass:"line-number"},[s._v("20")]),n("br"),n("span",{staticClass:"line-number"},[s._v("21")]),n("br"),n("span",{staticClass:"line-number"},[s._v("22")]),n("br"),n("span",{staticClass:"line-number"},[s._v("23")]),n("br"),n("span",{staticClass:"line-number"},[s._v("24")]),n("br"),n("span",{staticClass:"line-number"},[s._v("25")]),n("br"),n("span",{staticClass:"line-number"},[s._v("26")]),n("br"),n("span",{staticClass:"line-number"},[s._v("27")]),n("br"),n("span",{staticClass:"line-number"},[s._v("28")]),n("br"),n("span",{staticClass:"line-number"},[s._v("29")]),n("br"),n("span",{staticClass:"line-number"},[s._v("30")]),n("br"),n("span",{staticClass:"line-number"},[s._v("31")]),n("br"),n("span",{staticClass:"line-number"},[s._v("32")]),n("br"),n("span",{staticClass:"line-number"},[s._v("33")]),n("br"),n("span",{staticClass:"line-number"},[s._v("34")]),n("br")])]),n("p",[s._v("记得需要 "),n("code",[s._v("/usr/servers/nginx/sbin/nginx -s reload")])]),s._v(" "),n("h2",{attrs:{id:"kafka-topic-创建与消费显示"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#kafka-topic-创建与消费显示"}},[s._v("#")]),s._v(" kafka topic 创建与消费显示")]),s._v(" "),n("p",[n("RouterLink",{attrs:{to:"/cache-pdp/049.html#kafka-集群"}},[s._v("详细内容可参考之前的内容")])],1),s._v(" "),n("div",{staticClass:"language-bash line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-bash"}},[n("code",[n("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" /usr/local/kafka_2.9.2-0.8.1.1\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 创建测试的 topic，名称为 access-log")]),s._v("\nbin/kafka-topics.sh --zookeeper "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),s._v(".99.170:2181,192.168.99.171:2181,192.168.99.172:2181 --topic access-log --replication-factor "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" --partitions "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" --create\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 创建一个消费者")]),s._v("\nbin/kafka-console-consumer.sh --zookeeper "),n("span",{pre:!0,attrs:{class:"token number"}},[s._v("192.168")]),s._v(".99.170:2181,192.168.99.171:2181,192.168.99.172:2181 --topic access-log --from-beginning\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br")])]),n("h2",{attrs:{id:"测试脚本是否达到正常效果"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#测试脚本是否达到正常效果"}},[s._v("#")]),s._v(" 测试脚本是否达到正常效果")]),s._v(" "),n("p",[s._v("记得后端缓存服务需要启动，nginx 本地缓存是有过期时间的，过期后就会去请求后端服务了")]),s._v(" "),n("p",[s._v("访问地址："),n("code",[s._v("http://eshop-cache03/product?method=product&productId=1&shopId=1")])]),s._v(" "),n("p",[s._v("页面能正常看到商品信息，但是 kafka consumer 无信息")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v('# 查看 nginx 的错误日志发现\ntail -f /usr/servers/nginx/logs/error.log\n\n2019/05/07 20:14:49 [error] 9888#0: [lua] producer.lua:258: buffered messages send to kafka err: no resolver defined to resolve "eshop-cache01", retryable: true, topic: access-log, partition_id: 0, length: 1, context: ngx.timer, client: 192.168.99.172, server: 0.0.0.0:80\n\n')])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br")])]),n("div",{staticClass:"custom-block tip"},[n("p",{staticClass:"custom-block-title"},[s._v("TIP")]),s._v(" "),n("p",[s._v("经过实战排错，resolver 8.8.8.8; 可以不配置，只需要修改 kafka 配置文件配置项 advertised.host.name = 对应机器 ip 即可")])]),s._v(" "),n("p",[s._v("解决方法：")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v("vi /usr/servers/nginx/conf/nginx.conf\n\n在 http 部分，加入 resolver 8.8.8.8;\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br")])]),n("p",[s._v("再次尝试发现日志变更了")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v("2019/05/07 20:20:55 [error] 9891#0: [lua] producer.lua:258: buffered messages send to kafka err: eshop-cache01 could not be resolved (3: Host not found), retryable: true, topic: access-log, partition_id: 0, length: 1, context: ngx.timer, client: 192.168.99.172, server: 0.0.0.0:80\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br")])]),n("p",[s._v("可以看到日志，的确是去解析了，但是这个是我们本地自定义的肯定解析不到，那么这个问题是哪里的问题呢？")]),s._v(" "),n("p",[s._v("我懒一点，视频中说到，需要更改 kafka 的配置文件，让用本机 ip 而不是  hostName")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v("vi /usr/local/kafka_2.9.2-0.8.1.1/config/server.properties\n\n# 默认是 hostname，更改为自己机器的 ip 地址\n#advertised.host.name=<hostname routable by clients>\nadvertised.host.name = 192.168.99.170\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br")])]),n("p",[s._v("再重启 kafka")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v("[root@eshop-cache01 lua]# jps\n12698 Jps\n12310 logviewer\n1576 Kafka\n\nkill -9 1576\n\ncd /usr/local/kafka_2.9.2-0.8.1.1\nnohup bin/kafka-server-start.sh config/server.properties &\n# 查看是否启动是否报错\ncat nohup.out\n")])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br"),n("span",{staticClass:"line-number"},[s._v("3")]),n("br"),n("span",{staticClass:"line-number"},[s._v("4")]),n("br"),n("span",{staticClass:"line-number"},[s._v("5")]),n("br"),n("span",{staticClass:"line-number"},[s._v("6")]),n("br"),n("span",{staticClass:"line-number"},[s._v("7")]),n("br"),n("span",{staticClass:"line-number"},[s._v("8")]),n("br"),n("span",{staticClass:"line-number"},[s._v("9")]),n("br"),n("span",{staticClass:"line-number"},[s._v("10")]),n("br"),n("span",{staticClass:"line-number"},[s._v("11")]),n("br")])]),n("p",[s._v("再次访问，发现能接受到信息了")]),s._v(" "),n("div",{staticClass:"language- line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[s._v('[root@eshop-cache01 kafka_2.9.2-0.8.1.1]# bin/kafka-console-consumer.sh --zookeeper 192.168.99.170:2181,192.168.99.171:2181,192.168.99.172:2181 --topic access-log --from-beginning\n{"method":"GET","http_version":1.1,"raw_reader":"GET \\/product?productId=1&shopId=1 HTTP\\/1.1\\r\\nHost: 192.168.99.171\\r\\nUser-Agent: lua-resty-http\\/0.13 (Lua) ngx_lua\\/9014\\r\\n\\r\\n","uri_args":{"productId":"1","shopId":"1"},"headers":{"host":"192.168.99.171","user-agent":"lua-resty-http\\/0.13 (Lua) ngx_lua\\/9014"}}\n')])]),s._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[s._v("1")]),n("br"),n("span",{staticClass:"line-number"},[s._v("2")]),n("br")])])])}),[],!1,null,null,null);a.default=r.exports}}]);