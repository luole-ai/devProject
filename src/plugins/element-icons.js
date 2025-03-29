// 导入常用图标
import {
  Camera,
  Picture,
  Setting
} from '@element-plus/icons-vue'

export default (app) => {
  app.component('icon-camera', Camera)
  app.component('icon-picture', Picture) 
  app.component('icon-setting', Setting)
} 