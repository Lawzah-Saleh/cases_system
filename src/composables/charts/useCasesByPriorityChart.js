export function useCasesByPriorityChart(data) {
  return {
    options: {
      chart: {
        type: 'donut',
        toolbar: {
          show: true,
          tools: { download: true },
          export: {
            png: { filename: 'cases-by-priority' },
            svg: { filename: 'cases-by-priority' }
          }
        }
      },
      labels: data.map((r) => r.priority),
      legend: { position: 'bottom' },
      colors: ['#1e7a3b', '#b3261e', '#b45b00', '#364fc7', '#006395', '#E74C3C']
    },

    series: data.map((r) => r.total)
  }
}
