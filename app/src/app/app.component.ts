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
    const query = 'SELECT Credit_Score, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions) AS percentage FROM transactions GROUP BY Credit_Score;'

    let data_credit: any[] = []
    this.sql.query(query).subscribe({
      next: (response) => {
        console.log('Response data:', response);
        data_credit = response

        const data = {
          labels: data_credit.map(row => row.Credit_Score),
          datasets: [{
            data: data_credit.map(row => row.percentage),
            backgroundColor: ['rgba(110, 217, 221, 0.75)', 'rgba(110, 195, 221, 0.75)', 'rgba(110, 177, 221, 0.75)'],
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

  }

}
