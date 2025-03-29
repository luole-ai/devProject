// 按需导入组件
import { ElMessage, ElNotification } from 'element-plus'

export default (app) => {
  // 全局配置
  app.config.globalProperties.$message = ElMessage
  app.config.globalProperties.$notify = ElNotification

} 