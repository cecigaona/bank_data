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

  }

}
