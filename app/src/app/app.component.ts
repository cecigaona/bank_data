import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { SqlService } from './sql.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'app';

  f_size_big = 22
  f_size_med = 18
  f_size_small = 14

  constructor(private sql: SqlService) {

  }

  ngAfterViewInit() {

    const colorPalette:string[] = [
      'rgba(110, 220, 220, 0.75)', 
      'rgba(110, 200, 220, 0.75)', 
      'rgba(110, 180, 220, 0.75)',
      'rgba(110, 160, 220, 0.75)',
      'rgba(110, 140, 220, 0.75)',
    ]

    // -- CHART credit_score --
    let query = '\
    SELECT Credit_Score, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions) AS percentage \
    FROM transactions \
    GROUP BY Credit_Score;'

    let dataFromResponse: any[] = []
    this.sql.query(query).subscribe({
      next: (response) => {
        console.log('Response data:', response);
        dataFromResponse = response

        const data = {
          labels: dataFromResponse.map(row => row.Credit_Score),
          datasets: [{
            data: dataFromResponse.map(row => row.percentage),
            backgroundColor: colorPalette,
          }]
        };

        new Chart('credit_score', {
          type: 'pie',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Credit Score',
                font: {
                  size: this.f_size_big
                },
                padding: {
                  top: 10,
                  bottom: 20
                }
              },
              legend: {
                display: true,
                position: 'right',
                labels: {
                  font: {
                    size: this.f_size_small
                  },
                  color: '#000',
                  padding: 20
                }
              },
              datalabels: {
                formatter: (value:number, context:any) => {
                  const dataset = context.chart.data.datasets[0].data;
                  const total = dataset.reduce((a:number, b:number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return percentage + '%';
                },
                color: '#000',
                anchor: 'end',
                align: 'start',
                offset: 30,
                font: {
                  weight: 'bold',
                  size: this.f_size_med,
                }
              }
            }
          },
          plugins: [ChartDataLabels]
        });
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
    // --------------------


    // -- CHART credit_used --
    query = 'SELECT \
    FLOOR(Credit_Utilization_Ratio / 10) * 10 AS range_start, \
    FLOOR(Credit_Utilization_Ratio / 10) * 10 + 9.99 AS range_end, \
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions) AS percentage \
    FROM transactions \
    GROUP BY range_start, range_end \
    ORDER BY range_start;'

    this.sql.query(query).subscribe({
      next: (response) => {
        console.log('Response data:', response);
        dataFromResponse = response

        const data = {
          labels: dataFromResponse.map(row => row.range_start + "%"),
          datasets: [{
            data: dataFromResponse.map(row => row.percentage),
            backgroundColor: colorPalette,
          }]
        };

        new Chart('credit_used', {
          type: 'pie',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Percentage of Credit Used',
                font: {
                  size: this.f_size_big
                },
                padding: {
                  top: 10,
                  bottom: 30
                }
              },
              legend: {
                display: true,
                position: 'right',
                labels: {
                  font: {
                    size: this.f_size_small
                  },
                  color: '#000',
                  padding: 20
                }
              },
              datalabels: {
                formatter: (value:number, context:any) => {
                  const dataset = context.chart.data.datasets[0].data;
                  const total = dataset.reduce((a:number, b:number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return percentage + '%';
                },
                color: '#000',
                anchor: 'end',
                align: 'start',
                offset: 30,
                font: {
                  weight: 'bold',
                  size: this.f_size_med,
                }
              }
            }
          },
          plugins: [ChartDataLabels]
        });
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });

    // --------------------

    // -- CHART credit_cards --
    query = 'SELECT \
    FLOOR(Age / 5) * 5 AS age_group_start,\
    FLOOR(Age / 5) * 5 + 4 AS age_group_end,\
    COUNT(*) AS total_people,\
    ROUND(AVG(Num_Credit_Card)) AS avg_credit_cards \
    FROM users \
    WHERE Age IS NOT NULL AND Num_Credit_Card IS NOT NULL \
    GROUP BY age_group_start, age_group_end \
    ORDER BY age_group_start;'

    this.sql.query(query).subscribe({
      next: (response) => {
        console.log('Response data:', response);
        dataFromResponse = response

        const data = {
          labels: dataFromResponse.map(row => row.age_group_start + "-" + row.age_group_end),
          datasets: [{
            data: dataFromResponse.map(row => row.total_people),
            backgroundColor: colorPalette,
          }]
        };

        new Chart('credit_cards', {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Credit Card Usage per Age Group',
                font: {
                  size: this.f_size_big
                },
                padding: {
                  top: 10,
                  bottom: 30
                }
              },
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  font: {
                    size: 0
                  },
                  color: '#000',
                  padding: 20
                }
              },
              datalabels: {
                formatter: (value:number, context:any) => {
                  const dataset = context.chart.data.datasets[0].data;
                  const total = dataset.reduce((a:number, b:number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return percentage + '%';
                },
                color: '#000',
                anchor: 'end',
                align: 'center',
                offset: 10,
                font: {
                  weight: 'bold',
                  size: this.f_size_med,
                }
              }
            }
          },
          plugins: [ChartDataLabels]
        });
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });

    // --------------------

    // -- CHART occupation_interest --
    query = 'SELECT Occupation, AVG(Interest_Rate) AS Avg_Interest\
    FROM users\
    WHERE Interest_Rate IS NOT NULL\
    GROUP BY Occupation\
    ORDER BY Avg_Interest DESC\
    LIMIT 5;';

    this.sql.query(query).subscribe({
      next: (response) => {
        console.log('Response data:', response);
        dataFromResponse = response

        const data = {
          labels: dataFromResponse.map(row => row.Occupation),
          datasets: [{
            data: dataFromResponse.map(row => row.Avg_Interest),
            backgroundColor: colorPalette,
          }]
        };

        new Chart('occupation_interest', {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Top 5 Occupation with Highest Interest',
                font: {
                  size: this.f_size_big
                },
                padding: {
                  top: 10,
                  bottom: 30
                }
              },
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  font: {
                    size: 0
                  },
                  color: '#000',
                  padding: 20
                }
              },
              datalabels: {
                formatter: (value:number, context:any) => {
                  const dataset = context.chart.data.datasets[0].data;
                  const total = dataset.reduce((a:number, b:number) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return percentage + '%';
                },
                color: '#000',
                anchor: 'end',
                align: 'center',
                offset: 10,
                font: {
                  weight: 'bold',
                  size: this.f_size_med,
                }
              }
            }
          },
          plugins: [ChartDataLabels]
        });
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });

    // --------------------

    // STAT stat_1
    // porcentaje de usuarios con deuda no pagada arriba de cierto threshold

    query = 'SELECT \
    (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users)) AS perc_users \
    FROM users  \
    WHERE Outstanding_Debt > 500;'

    this.sql.query(query).subscribe({
      next: (response) => {
        console.log('Response data:', response);
        dataFromResponse = response

        const statSpan = document.getElementById("stat_1");
        if (statSpan) {
          statSpan.textContent = `${(response?.[0]?.perc_users ?? 0).toFixed(1)}%`;
        }
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });

    // --------------------

    // STAT stat_2
    // Promedio en meses del historial crediticio

    query = "SELECT \
      ROUND(AVG( \
        (CAST(SUBSTRING_INDEX(Credit_History_Age, ' Years', 1) AS UNSIGNED) * 12) + \
        (CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(Credit_History_Age, 'and ', -1), ' Month', 1) AS UNSIGNED)) \
      ), 2) AS Promedio_Meses_Historial \
    FROM transactions \
    WHERE Credit_History_Age IS NOT NULL \
      AND Credit_History_Age LIKE '%Year%' AND Credit_History_Age LIKE '%Month%';"

    this.sql.query(query).subscribe({
      next: (response) => {
        console.log('Response data:', response);
        dataFromResponse = response

        const statSpan = document.getElementById("stat_2");
        if (statSpan) {
          statSpan.textContent = `${(response?.[0]?.Promedio_Meses_Historial ?? 0).toFixed(1)}`;
        }
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });

    // --------------------

    // STAT stat_3
    // porcentaje de usuarios con deuda no pagada arriba de cierto threshold

    query = 'SELECT \
    (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users)) AS perc_users \
    FROM users  \
    WHERE Outstanding_Debt > 1500;'

    this.sql.query(query).subscribe({
      next: (response) => {
        console.log('Response data:', response);
        dataFromResponse = response

        const statSpan = document.getElementById("stat_3");
        if (statSpan) {
          statSpan.textContent = `${(response?.[0]?.perc_users ?? 0).toFixed(1)}%`;
        }
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });

    // --------------------
  }

}
