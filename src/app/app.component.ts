import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { Chart, TooltipItem } from 'chart.js';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ChartModule, ButtonModule, HttpClientModule],
    providers: [
        AppService
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'ClaimsForecasts';
    data: any;
    options: any;
    isDisabled: boolean = false;

    apiData: any

    constructor(
        protected appService: AppService
    ) { }

    ngOnInit() {
        this.getAllData();
    }
        setUp() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const amounts = this.apiData.map((x: {payment: any; })=> x.payment)
        const months = this.apiData.map((x: {year: string; month: any; })=> x.month.substring(0, 3)+' '+x.year)

        const predictedColor= '#f07d96'
        const existingColor = '#759fa1'

        this.data = {
            labels: months,
            datasets: [
                {
                    label:'Amount',
                    data: amounts,
                    backgroundColor: this.apiData.map((x: { is_predicted: boolean; })=>x.is_predicted?predictedColor: existingColor),
                    borderColor: ['teal'],
                    borderWidth: 1
                }
            ]
        };

        this.options = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        generateLabels: function(chart:Chart) {
                            return [{
                                text: 'Predicted Claim Amount (BDT)',
                                fillStyle: predictedColor
                            },
                            {
                                text: 'Claim Amount (BDT)',
                                fillStyle: existingColor
                            }];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem: { raw: string; }) {
                            return 'Claim Amount: ' + tooltipItem.raw + " BDT"; // Custom label text in tooltip
                        }
                    }
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: 'Claim Amount (BDT)',
                        font: {
                            weight: 'bold',
                            size: 16,
                            family: 'Arial'
                        }
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: 'Month',
                        font: {
                            weight: 'bold',
                            size: 16,
                            family: 'Arial'
                        }
                    }
                }
            }
        };
    }

    getAllData() {
        this.appService.getAllClaimAmount()
            .subscribe({
                next: (res) => {
                   this.apiData = res.body.filter((x: { is_predicted: boolean; })=>!x.is_predicted).slice(-18)
                   this.setUp()
                },
                error: () => {

                }
            });
    }

    submit() {
        this.isDisabled = true;
        this.appService.getPredictedClaimAmount()
            .subscribe({
                next: (res) => {
                    this.apiData = res.body.slice(-18)
                    this.setUp()
                },
                error: () => {

                }
            });
    }
}
