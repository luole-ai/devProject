import { ref } from 'vue'
import { useStore } from 'vuex'

const WIDTH = 992 // refer to Bootstrap's responsive design

export default function() {
  const store = useStore()
  const device = ref(store.state.app.device)
  
  const $_isMobile = () => {
    const rect = document.body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  const $_resizeHandler = () => {
    if (!document.hidden) {
      const isMobile = $_isMobile()
      store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

      if (isMobile) {
        store.dispatch('app/closeSideBar', { withoutAnimation: true })
      }
    }
  }

  const $_initResizeEvent = () => {
    window.addEventListener('resize', $_resizeHandler)
  }

  const $_destroyResizeEvent = () => {
    window.removeEventListener('resize', $_resizeHandler)
  }

  return {
    $_isMobile,
    $_resizeHandler,
    $_initResizeEvent,
    $_destroyResizeEvent
  }
} 