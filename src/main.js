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
  Image as VanImage
} from 'vant'

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

app.mount('#app') 