import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { Chart, TooltipItem } from 'chart.js';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        ChartModule,
        ButtonModule,
        HttpClientModule,
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
    ],
    providers: [
        AppService
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'ClaimsForecasts';
    data: any;
    correlationData: any;
    options: any;
    corOptions: any;
    heatMapOptions: any;
    next_month: any;
    next_year: any;
    display: boolean = false;
    inputForm: any;
    dataSize: any;
    correlations: any;
    initialNextMonthInfo: any;
    controls = [];

    noOfMonths: number = 25

    apiData: any

    constructor(
        protected appService: AppService,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.getAllData();
    }

    setUpInitialNextMonthInfo(data:any){
        this.inputForm = this.fb.group({});
        this.controls.forEach(control => {
            this.inputForm?.addControl(control, this.fb.control('', Validators.required));
        });
        this.inputForm.patchValue(data);
    }

    setUpCorrelationChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        
        const props = Object.keys(this.correlations)
        let vals = Object.values(this.correlations)
        vals = vals.map(x => Math.abs(x as number))

        const barColor = '#cc5c69'

        this.correlationData = {
            labels: props,
            datasets: [
                {
                    label: 'correlation with claim amount',
                    data: vals,
                    backgroundColor: barColor,
                    borderColor: ['teal'],
                    borderWidth: 1
                }
            ]
        };

        this.corOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
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
                        text: 'correlations',
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
                        text: 'Parameters',
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

    setUp() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const amounts = this.apiData.map((x: { payment: any; }) => x.payment)
        const months = this.apiData.map((x: { year: string; month: any; }) => x.month.substring(0, 3) + ' ' + x.year)

        const predictedColor = '#f07d96'
        const existingColor = '#759fa1'

        this.data = {
            labels: months,
            datasets: [
                {
                    label: 'Amount',
                    data: amounts,
                    backgroundColor: this.apiData.map((x: { is_predicted: boolean; }) => x.is_predicted ? predictedColor : existingColor),
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
                        generateLabels: function (chart: Chart) {
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
                        label: function (tooltipItem: { raw: string; }) {
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
        this.appService.getPredictedClaimAmount()
            .subscribe({
                next: (res) => {
                    this.apiData = res.body.claim_data.slice(-this.noOfMonths)
                    this.correlations = res.body.correlations
                    this.dataSize = this.apiData.length
                    this.initialNextMonthInfo = res.body.next_month_info
                    this.controls = res.body.cols
                    let lastMonth = this.apiData[this.dataSize - 1].month
                    let lastYear = this.apiData[this.dataSize - 1].year
                    this.getNextMonth(lastMonth, lastYear)
                    this.setUpCorrelationChart()
                    this.setUp()
                    this.setUpInitialNextMonthInfo(this.initialNextMonthInfo)
                }
            });
    }

    submit() {
        this.appService.getPredictedClaimAmountWithData(this.inputForm?.value)
            .subscribe({
                next: (res) => {
                    if (this.apiData.length == this.dataSize) {
                        this.apiData.push(
                            {
                                month: this.next_month.substring(0, 3),
                                year: this.next_year,
                                payment: res.body,
                                is_predicted: true
                            }
                        )
                    }
                    else {
                        this.apiData[this.apiData.length - 1].payment = res.body
                    }
                    this.setUp()
                },
                error: () => {

                }
            });
    }

    reset(): void {
        this.setUpInitialNextMonthInfo(this.initialNextMonthInfo)
    }

    getNextMonth(month: string, year: number) {
        let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthIndex = monthNames.indexOf(month);

        if (monthIndex === -1) {
            throw new Error('Invalid month. Month should be one of: ' + monthNames.join(", "));
        }

        let nextMonthIndex = monthIndex + 1;
        let nextYear = year;

        if (nextMonthIndex > 11) {
            nextMonthIndex = 0;
            nextYear += 1;
        }

        this.next_month = monthNames[nextMonthIndex]
        this.next_year = nextYear
    }

    showDialog() {
        this.display = true;
      }
    predictAndcloseDialog(){
        this.display = false;
        this.submit()
    }
}
