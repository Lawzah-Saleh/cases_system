export function useCasesByStatusChart(data) {
  return {
    options: {
      chart: {
        type: 'pie',
        toolbar: {
          show: true,
          tools: { download: true },
          export: {
            png: { filename: 'cases-by-status' },
            svg: { filename: 'cases-by-status' }
          }
        }
      },
      labels: data.map((r) => r.status),
      colors: ['#7C3AED', '#F59E0B', '#10B981', '#60A5FA', '#8E44AD', '#E74C3C'],
      legend: { position: 'bottom' }
    },

    series: data.map((r) => r.total)
  }
}
