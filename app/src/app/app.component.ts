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

  constructor(private sql: SqlService) {

  }

  ngAfterViewInit() {

    const colorPalette:string[] = [
      'rgba(110, 215, 220, 0.75)', 
      'rgba(110, 200, 220, 0.75)', 
      'rgba(110, 185, 220, 0.75)',
      'rgba(110, 170, 220, 0.75)',
      'rgba(110, 155, 220, 0.75)'
    ]

    // -- CHART 1 --
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
            plugins: {
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
                  size: 24,
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


    // -- CHART 2 --
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
            plugins: {
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
                  size: 24,
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

    // -- CHART 3 --
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
            plugins: {
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
                  size: 20,
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
  }

}
