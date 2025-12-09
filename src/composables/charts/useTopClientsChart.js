export function useTopClientsChart(data) {
  return {
    options: {
      chart: {
        toolbar: {
          export: {
            svg: { filename: 'Top Clients' },
            png: { filename: 'Top Clients' }
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
        categories: data.map((r) => r.client_name)
      }
    },

    series: [
      {
        name: 'Cases',
        data: data.map((r) => r.cases_count)
      }
    ]
  }
}
