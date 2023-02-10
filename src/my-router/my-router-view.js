export default {
  render(h){
    // 解决嵌套路由
    // 1. 标记当前router-view深度
    this.$vnode.data.routerView = true
    
    
    let deepth = 0;
    let parent = this.$parent
    while (parent){
      const vnodeData = parent.$vnode && parent.$vnode.data
      // 说明当前parent是一个router-view
      if (vnodeData && vnodeData.routerView){
        deepth++;
      }
      parent = parent.$parent
    }
    
    let component = null;
    const route = this.$router.matched[deepth]
    if (route){
      component = route.component
    }
    return h(component)
  }
}