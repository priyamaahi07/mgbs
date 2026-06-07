import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common-service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  constructor(private _commonService: CommonService) {

  }

  ngOnInit(): void {
    this.createSalesChart();
    this.createCategoryChart();
    this.createProfitRevenueChart();
  }

  createSalesChart() {

    // Example data (replace with API later)
    const labels = this.generateTimeLabels();

    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Daily Sales (₹)',
          data: [1200, 1900, 3000, 2500, 4000, 3800, 5000],
          borderColor: '#1d753a',
          backgroundColor: 'rgba(59,130,246,0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    };

    new Chart('salesChart', {
      type: 'line',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            },
            grid: {
              display: false
            }
          },
          y: {
            title: {
              display: true,
              text: 'Sales (₹)'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  generateTimeLabels(): string[] {
    const now = new Date();
    const labels: string[] = [];

    // last 7 hours example
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      labels.push(
        time.getHours() + ':' + String(time.getMinutes()).padStart(2, '0')
      );
    }

    return labels;
  }

  createCategoryChart() {

    new Chart('categoryChart', {
      type: 'doughnut',
      data: {
        labels: [
          'Tablets',
          'Syrups',
          'Injections',
          'Ointments',
          'Drops'
        ],
        datasets: [{
          data: [45, 25, 15, 10, 5], // percentage or sales value
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  createProfitRevenueChart() {

    new Chart('profitRevenueChart', {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],

        datasets: [
          {
            label: 'Revenue',
            data: [12000, 15000, 13000, 18000, 20000, 22000, 25000],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.15)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Profit',
            data: [4000, 5000, 4500, 6000, 7000, 7500, 9000],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { display: false } }
        }
      }
    });
  }
}
