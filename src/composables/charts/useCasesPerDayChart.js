export function useCasesPerDayChart(data) {
  return {
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          export: {
            svg: { filename: 'Cases Per Day' },
            png: { filename: 'Cases Per Day' }
          }
        }
      },
      colors: ['#190F4E', '#4338CA'],
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: '20%'
        }
      },
      legend: { show: false },
      xaxis: {
        categories: data.map((r) => r.date)
      }
    },

    series: [
      {
        name: 'Cases',
        data: data.map((r) => r.total)
      }
    ]
  }
}
