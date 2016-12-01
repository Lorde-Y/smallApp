# https://github.com/ericdum/mujiang.info/issues/6/
# 这个文件主要是来解决 模块引用，例如在app.js中引用login.js，
# 虽然在webpack使用了alias，引用的路径为 import login from 'components/login/login',两个login，别扭了点吧
# 所以，main字段是非常有用的，提供文件的入口，  所以就变成  import login from 'components/login'