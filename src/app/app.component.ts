import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';

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
    basicData: any;
    data: any;
    basicOptions: any;
    options: any;
    isDisabled: boolean = false;

    constructor(
        protected appService: AppService
    ) { }

    ngOnInit() {
        this.getAllData();

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.basicData = {
            labels: ['May, 2019', 'May, 2019', 'May, 2019', 'May, 2019', 'May, 2019', 'May, 2019'],
            datasets: [
                {
                    label: 'Claim Amount',
                    data: [100000, 200000, 300000, 400000, 500000, 600000],
                    backgroundColor: ['rgba(255, 159, 64, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                    borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)'],
                    borderWidth: 1
                }
            ]
        };

        this.basicOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
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
                        text: 'Claim Amount',
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

        this.data = {
            labels: ['May, 2019', 'May, 2019', 'May, 2019', 'May, 2019', 'May, 2019', 'May, 2019', 'May, 2019'],
            datasets: [
                {
                    label: 'Claim Amount',
                    data: [100000, 200000, 300000, 400000, 500000, 600000, 7000000],
                    fill: false,
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    tension: 0.4
                }
            ]
        };

        this.options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
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
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    },
                    title: {
                        display: true,
                        text: 'Claim Amount',
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

                },
                error: () => {

                }
            });
    }
}
