import { AfterViewInit, Component } from '@angular/core';
import {Chart} from 'chart.js/auto';
import { SqlService } from './sql.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit{
  title = 'app';

  constructor(private sql:SqlService){

  }

  

  ngAfterViewInit(){
    this.sql.query('SELECT * FROM test').subscribe({
      next: (response) => {
        console.log('Response data:', response);
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        console.log('Request completed');
      }
    });
    
    const data = [
      { year: 2010, count: 10 },
      { year: 2011, count: 20 },
      { year: 2012, count: 15 },
      { year: 2013, count: 25 },
      { year: 2014, count: 22 },
      { year: 2015, count: 30 },
      { year: 2016, count: 28 },
    ];

    new Chart('acquisitions', {
      type: 'bar',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map(row => row.count),
            backgroundColor: 'rgba(235, 54, 220, 0.75)', // Optional styling
            
          }
        ]
      }
    });  
  }
    
}
