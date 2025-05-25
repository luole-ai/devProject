<template>
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'

export default {
  name: 'BarChart',
  setup() {
    const chartRef = ref(null)
    let chart = null

    const initChart = () => {
      if (chartRef.value) {
        chart = echarts.init(chartRef.value)
        
        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: ['类别1', '类别2', '类别3', '类别4', '类别5']
          },
          yAxis: {
            type: 'value',
            max: 100,
            axisLabel: {
              formatter: '{value}%'
            }
          },
          series: [
            {
              name: '数值',
              type: 'bar',
              data: [30, 45, 75, 60, 85],
              label: {
                show: true,
                position: 'top',
                formatter: '{c}%'
              },
              itemStyle: {
                color: function(params) {
                  return params.value >= 50 ? '#67C23A' : '#F56C6C'
                }
              }
            },
            {
              name: '基准线',
              type: 'line',
              markLine: {
                silent: true,
                symbol: 'none',
                lineStyle: {
                  color: 'red',
                  type: 'solid'
                },
                data: [
                  {
                    yAxis: 50,
                    label: {
                      formatter: '50%',
                      position: 'end',
                      color: 'red'
                    }
                  }
                ]
              }
            }
          ]
        }

        chart.setOption(option)

        // 添加点击事件监听
        chart.on('click', function(params) {
          if (params.componentType === 'series' && params.seriesType === 'bar') {
            const category = params.name
            const value = params.value
            ElMessage({
              message: `选中类别: ${category}, 数值: ${value}%`,
              type: 'info'
            })
            // 这里可以触发自定义事件，将选中的类别信息传递给父组件
            // emit('category-selected', { category, value })
          }
        })
      }
    }

    onMounted(() => {
      initChart()
      window.addEventListener('resize', () => {
        chart && chart.resize()
      })
    })

    onUnmounted(() => {
      if (chart) {
        chart.dispose()
        chart = null
      }
      window.removeEventListener('resize', () => {
        chart && chart.resize()
      })
    })

    return {
      chartRef
    }
  }
}
</script> 