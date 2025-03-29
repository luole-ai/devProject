import { createApp } from 'vue'
import App from './App.vue'
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

const app = createApp(App)

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

app.mount('#app') 