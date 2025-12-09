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
      colors: ['#7C3AED', '#F59E0B', '#10B981', '#60A5FA', '#8E44AD', '#E74C3C']
    },

    series: data.map((r) => r.total)
  }
}
