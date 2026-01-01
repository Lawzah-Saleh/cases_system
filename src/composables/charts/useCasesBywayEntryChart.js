export function useCasesBywayEntryChart(data) {
  return {
    options: {
      chart: {
        type: 'donut',
        toolbar: {
          show: true,
          tools: { download: true },
          export: {
            png: { filename: 'cases-by-way-of-entry' },
            svg: { filename: 'cases-by-way-of-entry' }
          }
        }
      },
      labels: data.map((r) => r.way_entry),
      legend: { position: 'bottom' },
      colors: ['#7C3AED', '#F59E0B', '#10B981', '#60A5FA', '#04d3bb', '#E74C3C']
    },

    series: data.map((r) => r.total)
  }
}
