const { compile } = require("vue/types/umd")

function defineReactive(obj, key, val){
    const dep = new Dep();
    // 递归
    observe(val)
    // 属性拦截
    Object.defineProperty(obj,key,{
        get: () => {
            // 依赖收集
            Dep.target && dep.addDep(Dep.target)
            return val
        },
        set: (newVal) => {
            if (newVal !== val)
            observe(newVal) // 用户赋值一个新对象时，又变成响应式处理，接口返回的新数据，就是这样再一次被赋为响应式
            val = newVal
            // 触发更新
            dep.notify()
        }
    })
}

// 循环遍历obj的全部属性，添加响应式
function observe(obj){
    // 首先判断obj是不是对象
    if(typeof obj !== 'object' || obj == null){
        return;
    }
    Object.keys(obj).forEach(key => defineReactive(obj,key,obj[key]))
}

function set(obj, key, val){
    defineReactive(obj,key,val)
    
}

function proxy(vm){
    Object.keys(vm.$data).forEach(key =>{
        Object.defineProperty(vm, key, {
            get:() =>{
                return vm.$data[key]
            },
            set:(v) =>{
                vm.$data[key] = v;
            }
        })
    })
    

}

class KVue {
    constructor(options){
        this.$options = options;
        this.$data = options.data;

        // 1. 响应式：递归遍历data中对象，做响应式
        observe(this.$data)
        // 2. 代理
        proxy(this)
        // 3. 编译模版,
        // template中一个动态的值就对应一个watcher
        // data中有多少key，就对应多少dep
        // 一个dep就包含多个watcher
        new compile(options.el, this)

    }
}

class Compile {
    constructor(el, vm){
        // 获取宿主元素dom
        const el = document.querySelector(el)

        // 编译
        this.compile()

    }
    /**
     * @description 处理所有动态绑定
     * @param {element} node  节点
     * @param {string} exp  表达式
     * @param {string} dir  指令的名称
     */
    update(node, exp, dir){
        // 1. 初始化，让用户能看见内容
        const fn = this[dir + 'Updater']
        fn && fn(node, this.$vm[exp])
        // 2. 创建Watcher实例，负责后续更新
        new Watcher(this.$vm, exp, funciton(val){
            // 此处也是一个闭包处理
            fn && fn(node, val)
        })

    }

    text(node, exp) {
        this.update(node, exp, 'text')
    }

    textUpdater(node, val) {
        node.textContent = val;
    }
}

// 负责具体节点更新
class Watcher {
    constructor(vm, key, updater){
        this.vm = vm;
        this.key = key;
        this.updater = updater;

        Dep.target = this;
        // 调用了一下，特意触发依赖收集
        this.$vm[this.key]
        Dep.target = null;
    }
    // Dep 将来会调用update
    update(){
        const newVal = this.vm[this.key];
        this.updater.call(this.vm,newVal)
    }
}


// 负责通知watchers更新
class Dep {
    constructor(){
        this.deps = []
    }

    addDep(dep){
        this.deps.push(dep)
    }

    notify(){
        this.deps.forEach(wathcer => wathcer.update())
    }
}