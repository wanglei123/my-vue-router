import view from './my-router-view'

let vue = null;

class MyVueRouter {
  constructor($options){
    this.routes = $options.routes
    // 将current设置为响应式数据
    // vue.util.defineReactive(this, 'current', window.location.hash.slice(1) || '/' )
    this.current = window.location.hash.slice(1) || '/'
    // 处理嵌套路由
    // 2. 路由匹配时获取代表层级的数组
    vue.util.defineReactive(this, 'matched', [])

    // 初始化执行1次,match方法可以递归的遍历路由表，获取匹配关系的数组
    this.match()
    

    // 监听路由变化，获取最新的current
    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1)
      // 路由变化时重新匹配
      this.matched = [];
      this.match()
    })
  }

  match(routes){
    routes = routes || this.routes;
    // 递归遍历
    for (const route of routes) {
      // 首页
      if (route.path === '/' && this.current === '/'){
        this.matched.push(route);
        return;
      }
      //是当前路由的父级 例：/about/info
      if (route.path !== '/' && this.current.indexOf(route.path) != -1){
        this.matched.push(route);
        // 递归查找子路由，并放入matched
        if (route.children){
          this.match(route.children)
        }
        return;
      }
    }
  }


}

// 形参1是vue的构造函数
MyVueRouter.install = function(_vue){
  // 传入构造函数，我们可以修改它的原型，起到扩展作用，这时的构造函数，拿不到router
  vue = _vue;

  // 延迟执行，等到router的实例创建之后再执行
  // 全局混入
  vue.mixin({
    beforeCreate(){
      // 1. 注册$router,只有$options.router存在才赋值，因为好多组件都会走这个钩子
      // 混入,并且在这个钩子执行时才运行，这时的this是vue实例
      if (this.$options.router){
        vue.prototype.$router = this.$options.router;
      }
      // 2. 注册router-link, router-view全局组件
      vue.component('router-link', {
        props: {
          to: {
            type: String,
            default: ''
          },
        },
        render(h){
          // h === createElement 返回vnode
          return h('a', {
            attrs: {
              href: '#' + this.to
            }
          }, this.$slots.default)
        }
      });

      // vue.component('router-view', {
      //   // 数据响应式：数据变化可侦听，使用这些数据组件就会和响应式数据产生依赖关系，将来如果响应式数据发生变化，这些组件将会重新渲染
      //   // hash值，去routes里找到该路由对应的组件，放到h函数里，就可以在router-view中渲染该组件
      //   render(h){
      //     const route = this.$router.routes.find(route => route.path === this.$router.current)
      //     return h(route.component)
      //   }
      // });

      vue.component('router-view', view)
    }
  })

}





export default MyVueRouter