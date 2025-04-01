import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { 
  Button, 
  Cell, 
  CellGroup, 
  NavBar, 
  Tabbar, 
  TabbarItem,
  Grid,
  GridItem,
  Icon,
  Toast,
  Image as VanImage
} from 'vant'

// 导入Element Plus配置
import elementIcons from './plugins/element-icons'
import elementPlus from './plugins/element-plus'
import 'element-plus/dist/index.css'
// 导入Vant样式
import 'vant/lib/index.css'

// 确保这些图标已经注册
import {
  Expand,
  Fold,
  HomeFilled,
  Setting,
  User,
  Document,
  Menu,
  Lock,
  Files,
  Picture,
  DataLine,
  Warning,
  CircleCloseFilled,
  WarningFilled,
  CaretBottom
} from '@element-plus/icons-vue'

import './styles/index.scss'  // 导入全局样式

const app = createApp(App)

// 注册Vuex和Router
app.use(store)
app.use(router)

// 注册Vant组件
app.use(Button)
app.use(Cell)
app.use(CellGroup)
app.use(NavBar)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Grid)
app.use(GridItem)
app.use(Icon)
app.use(VanImage)
app.use(Toast)
// // 注册Element Plus图标
app.use(elementIcons)
// // 注册Element Plus配置
app.use(elementPlus)

// 注册图标
const icons = [
  Expand,
  Fold,
  HomeFilled,
  Setting,
  User,
  Document,
  Menu,
  Lock,
  Files,
  Picture,
  DataLine,
  Warning,
  CircleCloseFilled,
  WarningFilled,
  CaretBottom
]

icons.forEach(icon => {
  app.component(icon.name, icon)
})

// 在应用挂载前预处理store
store.dispatch('app/toggleSideBar') // 确保sidebar状态被初始化

app.mount('#app') 