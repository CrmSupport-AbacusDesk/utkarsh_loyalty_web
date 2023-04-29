import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MatDialog } from '@angular/material';
import { DistributorModelComponent } from '../distributor-model/distributor-model.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { Chart } from 'chart.js';
import { Location } from '@angular/common'
import { InvoiceListModalComponent } from 'src/app/invoice-list-modal/invoice-list-modal.component';
import { StatusModalComponent } from 'src/app/order/status-modal/status-modal.component';
@Component({
    selector: 'app-distribution-detail',
    templateUrl: './distribution-detail.component.html',
    styles: ['agm-map { height: 300px; }'],
    animations: [slideToTop()]
})
export class DistributionDetailComponent implements OnInit {

    @ViewChild('barCanvas') private barCanvas: ElementRef;
    @ViewChild('targetbarCanvas') private targetbarCanvas: ElementRef;
    @ViewChild('lineCanvas') private lineCanvas: ElementRef;
    tabType: any = 'Profile';
    orderStatus: any = "Approved";
    month: any = 'Oct';
    ledgerType: any = "ledger"
    discountFlag: boolean = false;
    productType: any = 'top';
    dr_id: any;
    user_type: any;
    dr_detail: any;
    assign_sales_user: any = [];
    hide_line_chart: any = false
    hide_bar_chart: any = false
    hide_target_chart: any = false
    search_val: any = {};
    barChart: any;
    targetbarChart: any;
    lineChart: any;
    filter: any = {}
    latitude = 20.5937;
    longitude = 78.9629;
    mapType = 'roadmap';
    zoom = 3;
    loader: any;
    login_data: any = {};
    ledger_data: any = [];
    count: any = [];
    today_date: any;
    list: any = {};
    data: any = [];
    userData: any;
    userId: any;
    userName: any;
    document: any = []
    currentMonth: any;
    monthNames: string[];
    pageCount: any;
    pagenumber: any = '';
    start: any = 0;
    total_page: any;
    page_limit: any;
    sr_no: any;
    date: any;
    currentMonth_no: any;
    currentYear: any;
    assignedBrands:any;
    constructor(
        public route: ActivatedRoute,
        public rout: Router,
        public toast: ToastrManager,
        public serve: DatabaseService,
        public alert: DialogComponent,
        public dialog: MatDialog,
        public session: sessionStorage,
        public renderer: Renderer2,
        public location: Location,) {
        this.page_limit = serve.pageLimit;
        this.date = new Date();
        this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        this.currentMonth = this.monthNames[this.date.getMonth()];
        this.currentYear = this.date.getFullYear();
        this.currentMonth_no = this.date.getMonth() + 1;
        this.userData = JSON.parse(localStorage.getItem('st_user'));
        this.userId = this.userData['data']['id'];
        this.userName = this.userData['data']['name'];
        this.login_data = this.session.getSession();
        this.login_data = this.login_data.data;

        this.route.params.subscribe(params => {
            this.dr_id = params.id;
            this.serve.currentUserID = params.id
            console.log('user id', this.serve.currentUserID)
            this.user_type = this.route.queryParams['_value']['type'];
        });
        this.distributorDetail();

        this.today_date = moment(new Date()).format("MMM - Y");
        this.session.getSession().subscribe(resp => {
            this.login_data = resp.data;
            if (this.login_data.type == '1' && this.login_data.lead_type == 'Dr') {
                this.renderer.addClass(document.body, 'chanel-patner');
            }
            else {
                this.renderer.removeClass(document.body, 'chanel-patner');
            }
        })

    }

    ngAfterViewInit() {
        // this.barChartMethod();
        this.TargetbarChartMethod();
        this.lineChartMethod();
    }
    ngOnInit() {
        this.distributorTopSelling()
        this.DistributorTarget()
        this.DistributorSalesChr()

    }


    clearFilter() {
        this.filter = {};
    }
    date_format(tabType): void {
        this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');

        if (tabType == 'Profile') {
        }
        else if (tabType == 'Checkin') {
            this.getCheckin();
        }
        else if (tabType == 'Segment') {

        }
        else if (tabType == 'Primary Order') {
            this.getPrimaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus);

        }
        else if (tabType == 'Secondary Order') {
            this.getSecondaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus);

        }
        else if (tabType == 'Retailer') {
            this.getRetailer();
        }
        else if (tabType == 'Ledger') {
            if (this.ledgerType == 'ledger') {
                this.getLedger()
            } else
                if (this.ledgerType == 'billing') {
                    this.invoice_data(this.invoiceMonth, this.invoiceYear)
                } else
                    if (this.ledgerType == 'payment') {
                        this.payment_data(this.paymentMonth, this.paymentYear);
                    } else
                        if (this.ledgerType == 'credit_note') {
                            this.cn_data(this.cnMonth, this.cnYear)
                        }
        }
        else if (tabType == 'Point Ledger') {
            this.getPointLedger();
        }
        else {

        }

    }
    date_format1(tabType): void {
        if (tabType == 'Ledger') {
            if (this.ledgerType == 'ledger') {
                this.getLedger()
            } else
                if (this.ledgerType == 'billing') {
                    this.filter.billing_date = moment(this.filter.billing_date).format('YYYY-MM-DD');
                    this.invoice_data(this.invoiceMonth, this.invoiceYear)
                } else
                    if (this.ledgerType == 'payment') {
                        this.filter.payment_date = moment(this.filter.billing_date).format('YYYY-MM-DD');
                        this.payment_data(this.paymentMonth, this.paymentYear);
                    } else
                        if (this.ledgerType == 'credit_note') {
                            this.cn_data(this.cnMonth, this.cnYear)
                        }
        }
        else {

        }

    }
    refresh(tabType) {
        this.filter = {};
        if (tabType == 'Profile') {

        }
        else if (tabType == 'Checkin') {
            this.getCheckin();
        }
        else if (tabType == 'Segment') {
            this.getSegment();
        }
        else if (tabType == 'Primary Order') {
            this.getPrimaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus);
        }
        else if (tabType == 'Secondary Order') {
            this.getSecondaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus)
        }
        else if (tabType == 'Retailer') {
            this.getRetailer();
        }
        else if (tabType == 'Ledger') {
            if (this.ledgerType == 'ledger') {
                this.getLedger()
            } else
                if (this.ledgerType == 'billing') {
                    this.invoice_data(this.invoiceMonth, this.invoiceYear)
                } else
                    if (this.ledgerType == 'payment') {
                        this.payment_data(this.paymentMonth, this.paymentYear);
                    } else
                        if (this.ledgerType == 'credit_note') {
                            this.cn_data(this.cnMonth, this.cnYear)
                        }
        }

        else if (tabType == 'Point Ledger') {
            this.getPointLedger();
        }

        else {

        }

    }

    dr_type;
    payment_upper_info: any = {}
    payment_lower_info: any = []
    distributors: any = []
    skLoading: boolean = false;
    distributorDetail() {
        this.skLoading = true;
        this.hide_bar_chart = false;
        this.hide_line_chart = false
        this.hide_target_chart = true
        let id = { "id": this.dr_id }
        this.serve.post_rqst(id, "CustomerNetwork/distributorDetail").subscribe((result) => {
            if (result['statusCode'] == 200) {
                
                this.dr_detail = result['distributor_detail'];
                this.distributors = this.dr_detail['distributors'];

                this.assignedBrands = this.dr_detail.brand.toString()
                // this.distributors.concat(this.dr_detail.assign_distributors_company_name)
                this.assign_sales_user = this.dr_detail.sales_user_data;
                this.payment_upper_info = result['dr_account_data']['dr_upper_info']
                this.payment_lower_info = result['dr_account_data']['previous_summary']
                this.skLoading = false;
                this.latitude = parseFloat(result['distributor_detail']['lat']);
                this.longitude = parseFloat(result['distributor_detail']['lng']);
                this.zoom = 15;
            } else {
                this.skLoading = false;
                this.toast.errorToastr(result['statusMsg'])
            }
            console.log('Distributors', this.distributors)
        })
    }



    openDialog(from): void {
        const dialogRef = this.dialog.open(StatusModalComponent, {
            width: '400px',
            panelClass: 'cs-model',
            data: {
                drType: this.user_type,
                company_name: this.dr_detail.company_name,
                drId: this.dr_id,
                delivery_from: from,
                reason: ''
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != false) {
                this.distributorDetail();
            }
        });
    }
    sales_amount: any = []
    salesMonth: any;
    sales_month: any = []
    distributor_saleschr_list: any = []
    DistributorSalesChr() {
        this.sales_amount = []
        this.sales_month = []
        setTimeout(() => {
            if (this.user_type != 3) {
                this.serve.post_rqst({ 'dr_id': this.dr_id }, "CustomerNetwork/drPrimarySalesData").subscribe((result => {
                    if (result['statusCode'] == 200) {
                        this.distributor_saleschr_list = result['calenderInfo'];
                        this.salesMonth = result['current_year'];

                        for (let index = 0; index < this.distributor_saleschr_list.length; index++) {
                            this.sales_amount.push(this.distributor_saleschr_list[index].sale)
                            this.sales_month.push(this.distributor_saleschr_list[index].monthname)
                        }
                    } else {
                        this.toast.errorToastr(result['statusMsg'])
                    }
                    this.lineChartMethod()
                }))
            } else if (this.user_type == 3) {
                this.serve.post_rqst({ 'dr_id': this.dr_id }, "CustomerNetwork/drSecondarySalesData").subscribe((result => {
                    if (result['statusCode'] == 200) {
                        this.distributor_saleschr_list = result['calenderInfo'];
                        for (let index = 0; index < this.distributor_saleschr_list.length; index++) {
                            this.sales_amount.push(this.distributor_saleschr_list[index].sale)
                            this.sales_month.push(this.distributor_saleschr_list[index].monthname)

                        }

                    } else {
                        this.toast.errorToastr(result['statusMsg'])
                    }
                    setTimeout(() => {
                        this.lineChartMethod();
                    }, 1000);
                }))
            }
        }, 3000);
    }

    lineChartMethod() {
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            type: 'line',
            data: {
                labels: this.sales_month,
                datasets: [
                    {
                        label: '',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(255,133,15,0.4)',
                        borderColor: 'rgba(255, 162, 71, 1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(255, 162, 71, 1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(255, 162, 71, 1)',
                        pointHoverBorderColor: 'rgba(161,85,11,1)',
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: this.sales_amount,
                        spanGaps: true,
                    }
                ]
            }
        });
    }
    dist_target: any = []
    dist_achieve: any = []
    target_not_achieved: any = []
    dist_segment: any = []
    distributor_target_list: any = []
    distributor_target_loader: any = []
    target_month: any;
    achieve_color: any = ''
    DistributorTarget() {
        this.dist_target = []
        this.dist_achieve = []
        this.dist_segment = []
        this.target_not_achieved = []
        this.serve.post_rqst({ 'dr_id': this.dr_id }, "CustomerNetwork/drTargetData").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.distributor_target_list = result['target_list'];
                this.target_month = result['current_month'];
                for (let index = 0; index < this.distributor_target_list.length; index++) {
                    this.dist_target.push(this.distributor_target_list[index].value)
                    this.dist_segment.push(this.distributor_target_list[index].brand_code)
                    if (this.distributor_target_list[index].achieved >= this.distributor_target_list[index].value) {

                        this.dist_achieve.push(this.distributor_target_list[index].achieved)
                        this.target_not_achieved.push(0)
                        this.achieve_color = '#27a302'
                    } else {
                        this.dist_achieve.push(0)
                        this.achieve_color = 'red'
                        this.target_not_achieved.push(this.distributor_target_list[index].achieved)
                    }

                }
                console.log(this.dist_target);
                console.log(this.dist_segment);
                
                setTimeout(() => {
                    this.barChart = new Chart(this.barCanvas.nativeElement, {
                        type: 'bar',
                        data: {
                            labels: this.dist_segment,
                            datasets: [
                                {
                                    label: 'Target',
                                    data: this.dist_target,
                                    backgroundColor: 'grey',
                                    borderColor: 'white',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Not Achieved',
                                    data: this.target_not_achieved,
                                    backgroundColor: 'red',
                                    borderColor: '#ffffff',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Achieved',
                                    data: this.dist_achieve,
                                    backgroundColor: '#27a302',
                                    borderColor: '#ffffff',
                                    borderWidth: 1
                                },
            
            
            
                            ]
                        },
            
                    });
                }, 100);
            } else {
                this.toast.errorToastr(result['statusMsg'])
            }
            
        }))
    }
    // barChartMethod() {
    //     this.barChart = new Chart(this.barCanvas.nativeElement, {
    //         type: 'bar',
    //         data: {
    //             labels: this.dist_segment,
    //             datasets: [
    //                 {
    //                     label: 'Target',
    //                     data: this.dist_target,
    //                     backgroundColor: 'grey',
    //                     borderColor: 'white',
    //                     borderWidth: 1
    //                 },
    //                 {
    //                     label: 'Not Achieved',
    //                     data: this.target_not_achieved,
    //                     backgroundColor: 'red',
    //                     borderColor: '#ffffff',
    //                     borderWidth: 1
    //                 },
    //                 {
    //                     label: 'Achieved',
    //                     data: this.dist_achieve,
    //                     backgroundColor: '#27a302',
    //                     borderColor: '#ffffff',
    //                     borderWidth: 1
    //                 },



    //             ]
    //         },

    //     });
    // }
    dr_top_selling: any = []
    dr_least_selling: any = []
    top_selling: any = []
    top_count: any = ''
    distributorTopSelling() {
        this.skLoading = true;
        let id = { "dr_id": this.dr_id, 'type_id': this.dr_id }
        if (this.user_type != 3) {
            this.serve.post_rqst(id, "CustomerNetwork/drTopSellingList").subscribe((result) => {
                if (result['statusCode'] == 200) {
                    this.top_selling = result['result'];
                    this.dr_top_selling = result['result'][0];
                    this.dr_least_selling = result['result'][1];
                    this.top_count = result['top_count']
                    this.skLoading = false
                    setTimeout(() => {
                        this.loader = false;
                    }, 700);
                } else {
                    this.toast.errorToastr(result['statusMsg'])
                }
            }, err => {
                this.skLoading = false;
            })
        } else if (this.user_type == 3) {

            this.serve.post_rqst(id, "CustomerNetwork/secondaryTopSellingList").subscribe((result) => {
                if (result['statusCode'] == 200) {
                    this.top_selling = result['result'];
                    this.dr_top_selling = result['result'][0];
                    this.dr_least_selling = result['result'][1];
                    this.top_count = result['top_count']
                    this.skLoading = false
                    setTimeout(() => {
                        this.loader = false;
                    }, 700);
                } else {
                    this.skLoading = false
                    this.toast.errorToastr(result['statusMsg'])
                }
            })
        }
    }
    pervious(page) {
        this.start = this.start - this.page_limit;
        if (page == 'checkin') {
            this.getCheckin();
        } else if (page == 'segment') {
            this.getSegment()
        } else if (page == 'primary') {

            this.getPrimaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus)
        } else if (page == 'secondary') {

            this.getSecondaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus)
        } else if (page == 'retailer') {
            this.getRetailer()

        } else if (page == 'ledger') {
            if (this.ledgerType == 'ledger') {
                this.getLedger()
            } else
                if (this.ledgerType == 'billing') {
                    this.invoice_data(this.invoiceMonth, this.invoiceYear)
                } else
                    if (this.ledgerType == 'payment') {
                        this.payment_data(this.paymentMonth, this.paymentYear);
                    } else
                        if (this.ledgerType == 'credit_note') {
                            this.cn_data(this.cnMonth, this.cnYear)
                        }
        }
        else if (page == 'Point Ledger') {
            this.getPointLedger()
        }
        else {

        }

    }

    nextPage(page) {
        this.start = this.start + this.page_limit;
        if (page == 'checkin') {

            this.getCheckin();
        } else if (page == 'segment') {

            this.getSegment()
        } else if (page == 'primary') {

            this.getPrimaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus)
        } else if (page == 'secondary') {

            this.getSecondaryOrder('', this.currentMonth_no, this.currentYear, this.orderStatus)
        } else if (page == 'retailer') {
            this.getRetailer()

        } else if (page == 'ledger') {
            if (this.ledgerType == 'ledger') {
                this.getLedger()
            } else
                if (this.ledgerType == 'billing') {
                    this.invoice_data(this.invoiceMonth, this.invoiceYear)
                } else
                    if (this.ledgerType == 'payment') {
                        this.payment_data(this.paymentMonth, this.paymentYear);
                    } else
                        if (this.ledgerType == 'credit_note') {
                            this.cn_data(this.cnMonth, this.cnYear)
                        }
        }
        else if (page == 'Point Ledger') {
            this.getPointLedger()
        }
        else {

        }
    }

    checkinData: any = [];
    checkinLoader: boolean = false;

    getCheckin() {

        this.checkinLoader = true;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }

        if (this.start < 0) {
            this.start = 0;
        }
        let payLoad = { "filter": this.filter, "id": this.dr_id, 'start': this.start, 'pagelimit': this.page_limit }
        this.serve.post_rqst(payLoad, "CustomerNetwork/drCheckinList").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.checkinData = result['dr_checkin_list'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                this.checkinLoader = false;
            } else {
                this.checkinLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }

    segment: any = [];
    segmentLoader: boolean = false;
    getSegment() {
        this.segmentLoader = true;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        let payLoad = { "filter": this.filter, "dr_id": this.dr_id, 'start': this.start, 'pagelimit': this.page_limit }
        this.serve.post_rqst(payLoad, "CustomerNetwork/drSegmentDiscountList").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.segment = result['all_segment_with_discount_list'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                this.segmentLoader = false;
            } else {
                this.segmentLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        })
    }
    primary_order_list: any = [];
    calenderInfo: any = [];
    primary__count: any = {};
    OrderMonth: any;
    OrderYear: any;
    primaryLoader: boolean = false;
    getPrimaryOrder(action: any = '', month, year, status) {
        if (action == "refresh") {
            this.primary_order_list = [];
            this.start = 0;
        }
        this.primaryLoader = true;
        this.OrderMonth = month;
        this.OrderYear = year;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        let id = { "filter": this.filter, "dr_id": this.dr_id }
        this.serve.post_rqst({ "dr_id": this.dr_id, 'status': status, 'month': Number(month), 'filter': this.filter, 'year': Number(year), 'start': this.start, 'pagelimit': this.page_limit }, "CustomerNetwork/drPrimaryOrderList").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.calenderInfo = result['calenderInfo'];
                this.primary__count = result['count'];
                this.primary_order_list = result['order_list'];
                this.primaryLoader = false;
                if (status == 'Pending') {
                    this.pageCount = this.primary__count.Pending;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Approved') {
                    this.pageCount = this.primary__count.Approved;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Reject') {
                    this.pageCount = this.primary__count.Reject;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Draft') {
                    this.pageCount = this.primary__count.Draft;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else if (status == 'Dispatch') {
                    this.pageCount = this.primary__count.Dispatch;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else {
                    this.pageCount = this.count.Dispact;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                for (let index = 0; index < this.calenderInfo.length; index++) {
                    const date = new Date();
                    date.setMonth(this.calenderInfo[index].month - 1);
                    let MonthName = ''
                    MonthName = date.toLocaleString('en-US', { month: 'short' })
                    this.calenderInfo[index].month_name = MonthName
                }
            } else {
                this.primaryLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        })
    }
    secondary_order_list: any = [];
    Secondary_calenderInfo: any = [];
    secondary__count: any = {};
    secondaryLoader: boolean = false;
    SecOrderMonth: any;
    SecOrderYear: any;
    getSecondaryOrder(action: any = '', month, year, status) {
        if (action == "refresh") {
            this.secondary_order_list = [];
            this.start = 0;
        }
        this.secondaryLoader = true;
        this.SecOrderMonth = month;
        this.SecOrderYear = year;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        let id = { "dr_id": this.dr_id }
        this.serve.post_rqst({ "dr_id": this.dr_id, 'status': status, 'month': Number(month), 'year': Number(year), 'type': this.user_type, 'start': this.start, 'pagelimit': this.page_limit, 'filter': this.filter }, "CustomerNetwork/drSecondaryOrderList").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.Secondary_calenderInfo = result['calenderInfo'];
                this.secondary__count = result['count'];
                this.secondaryLoader = false;
                this.secondary_order_list = result['order_list'];

                if (status == 'Pending') {
                    this.pageCount = this.secondary__count.Pending;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Approved') {
                    this.pageCount = this.secondary__count.Approved;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Reject') {
                    this.pageCount = this.secondary__count.Reject;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);

                }
                else if (status == 'Draft') {
                    this.pageCount = this.secondary__count.Draft;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else if (status == 'Dispatch') {
                    this.pageCount = this.secondary__count.Dispatch;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                else {
                    this.pageCount = this.count.Dispact;
                    this.total_page = Math.ceil(this.pageCount / this.page_limit);
                }
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;

                for (let index = 0; index < this.Secondary_calenderInfo.length; index++) {
                    const date = new Date();
                    date.setMonth(this.Secondary_calenderInfo[index].month - 1);
                    let MonthName = ''
                    MonthName = date.toLocaleString('en-US', { month: 'short' })
                    this.Secondary_calenderInfo[index].month_name = MonthName
                }
            } else {
                this.secondary_order_list = [];
                this.secondaryLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }


        })
    }

    target_list: any = [];
    target_calenderInfo: any = [];
    target__count: any = {};
    targetLoader: boolean = false;
    targetMonth: any;
    targetYear: any;
    target_Segment: any = [];
    Target: any = [];
    Achievement: any = [];
    Main_target_not_achieved: any = []
    getTarget(month, year) {
        this.Achievement = []
        this.Target = []
        this.Main_target_not_achieved = []
        this.target_Segment = []
        this.targetLoader = true;
        this.targetMonth = month;
        this.targetYear = year;
        this.hide_bar_chart = true
        this.hide_line_chart = true
        this.hide_target_chart = false
        // let id = { "dr_id": this.dr_id }
        this.serve.post_rqst({ "dr_id": this.dr_id, 'month': Number(month), 'year': Number(year) }, "CustomerNetwork/drPrimaryTargetList").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.target_calenderInfo = result['calenderInfo'];
                this.target_list = result['target_list'];
                this.targetLoader = false;
                for (let index = 0; index < this.target_calenderInfo.length; index++) {
                    const date = new Date();
                    date.setMonth(this.target_calenderInfo[index].month - 1);
                    let MonthName = ''
                    MonthName = date.toLocaleString('en-US', { month: 'short' })
                    this.target_calenderInfo[index].month_name = MonthName
                }
                for (let index = 0; index < this.target_list.length; index++) {
                    // this.Achievement.push(this.target_list[index].achieved)
                    this.Target.push(this.target_list[index].value)
                    this.target_Segment.push(this.target_list[index].brand_code)
                    this.target_list[index].target_percentage = (this.target_list[index].achieved / this.target_list[index].value) * 100
                    if (this.target_list[index].achieved >= this.target_list[index].value) {

                        this.Achievement.push(this.target_list[index].achieved)
                        this.Main_target_not_achieved.push(0)
                    } else {
                        this.Achievement.push(0)

                        this.Main_target_not_achieved.push(this.target_list[index].achieved)
                    }
                }
            } else {
                this.targetLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }
            setTimeout(() => {
                this.TargetbarChartMethod()
            }, 100);
        })
    }

    TargetbarChartMethod() {
        this.targetbarChart = new Chart(this.targetbarCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: this.target_Segment,
                datasets: [
                    {
                        label: 'Target',
                        data: this.Target,
                        backgroundColor: 'grey',
                        borderColor: 'black',
                        borderWidth: 1
                    },
                    {
                        label: 'Achieved',
                        data: this.Achievement,
                        backgroundColor: '#439B03',
                        borderColor: '#C6FF9B'
                        , borderWidth: 1
                    },
                    {
                        label: 'Not Achieved',
                        data: this.Main_target_not_achieved,
                        backgroundColor: 'red',
                        borderColor: 'red',
                        borderWidth: 1
                    },
                ]
            },

        });
    }
    retailer: any = [];
    retailerLoader: boolean = false;
    getRetailer() {
        this.retailerLoader = true;
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        let id = { "filter": this.filter, "dr_id": this.dr_id, 'start': this.start, 'pagelimit': this.page_limit }
        this.serve.post_rqst(id, "CustomerNetwork/distributorsAssignRetailersList").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.retailer = result['all_assign_retailers'];
                this.retailerLoader = false;
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
            } else {
                this.retailerLoader = false;
                this.toast.errorToastr(result['statusMsg'])
            }
        })
    }

    ledger_loader: boolean = false
    getLedger() {
        this.ledger_loader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.serve.post_rqst({ id: this.dr_id, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, }, "CustomerNetwork/drLedgerListStatement").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.ledger_loader = false
                this.ledger_data = result['dr_ledger_list'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
            } else {
                this.ledger_loader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }

    invoice_listing: any = []
    invoice_calenderInfo: any = []
    overall_total_sum: any = {}
    invoiceMonth: any
    invoiceYear: any
    invoice_loader: boolean = false
    invoice_data(month, year) {

        this.invoiceMonth = month;
        this.invoiceYear = year;
        this.invoice_loader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.serve.post_rqst({ 'filter': this.filter, dr_id: this.dr_id, 'month': month, 'year': year, 'start': this.start, 'pagelimit': this.page_limit, }, "CustomerNetwork/drInvoiceListing").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.invoice_loader = false
                this.invoice_listing = result['credit_billing_list'];
                this.invoice_calenderInfo = result['header_data'];
                this.overall_total_sum = result['overall_total_sum'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                for (let index = 0; index < this.invoice_calenderInfo.length; index++) {
                    const date = new Date();
                    date.setMonth(this.invoice_calenderInfo[index].month - 1);
                    let MonthName = ''
                    MonthName = date.toLocaleString('en-US', { month: 'short' })
                    this.invoice_calenderInfo[index].month_name = MonthName
                }
            } else {
                this.invoice_loader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }
    public onDate(event): void {
        this.search_val.date = moment(event.value).format('YYYY-MM-DD');
        this.invoice_data(this.invoiceMonth, this.invoiceYear);
        this.payment_data(this.paymentMonth, this.paymentYear);
        this.cn_data(this.cnMonth, this.cnYear);
    }

    payment_listing: any = []
    payment_calenderInfo: any = []
    paymentoverall_total_sum: any = {}
    paymentMonth: any
    paymentYear: any
    payment_loader: boolean = false
    payment_data(month, year) {
        this.paymentMonth = month;
        this.paymentYear = year;

        this.payment_loader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.serve.post_rqst({ 'filter': this.filter, dr_id: this.dr_id, 'month': month, 'year': year, 'start': this.start, 'pagelimit': this.page_limit, }, "CustomerNetwork/drPaymentList").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.payment_listing = result['list'];
                this.payment_calenderInfo = result['header_data'];
                this.payment_loader = false
                this.paymentoverall_total_sum = result['overall_total_payment_amount'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                for (let index = 0; index < this.payment_calenderInfo.length; index++) {
                    const date = new Date();
                    date.setMonth(this.payment_calenderInfo[index].month - 1);
                    let MonthName = ''
                    MonthName = date.toLocaleString('en-US', { month: 'short' })
                    this.payment_calenderInfo[index].month_name = MonthName
                }
            } else {
                this.payment_loader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }
    cn_listing: any = []
    cn_calenderInfo: any = []
    cn_total_sum: any = {}
    cnMonth: any
    cnYear: any
    cn_loader: boolean = false
    cn_data(month, year) {
        this.cnMonth = month;
        this.cnYear = year;
        this.cn_loader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.serve.post_rqst({ 'filter': this.filter, dr_id: this.dr_id, 'month': month, 'year': year, 'start': this.start, 'pagelimit': this.page_limit, }, "CustomerNetwork/drCreditNoteList").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.cn_loader = false
                this.cn_listing = result['list'];
                this.cn_calenderInfo = result['header_data'];
                this.cn_total_sum = result['overall_total_payment_amount'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
                for (let index = 0; index < this.cn_calenderInfo.length; index++) {
                    const date = new Date();
                    date.setMonth(this.cn_calenderInfo[index].month - 1);
                    let MonthName = ''
                    MonthName = date.toLocaleString('en-US', { month: 'short' })
                    this.cn_calenderInfo[index].month_name = MonthName
                }
            } else {
                this.cn_loader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }






    point_ledger: any = [];
    getPointLedger() {
        this.ledger_loader = true
        if (this.pagenumber > this.total_page) {
            this.pagenumber = this.total_page;
            this.start = this.pageCount - this.page_limit;
        }
        if (this.start < 0) {
            this.start = 0;
        }
        this.serve.post_rqst({ 'id': this.dr_id, 'type': this.user_type, 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit, }, "CustomerNetwork/drPointLedger").subscribe((result) => {
            if (result['statusCode'] == 200) {
                this.ledger_loader = false
                this.point_ledger = result['dr_ledger'];
                this.pageCount = result['count'];
                if (this.pagenumber > this.total_page) {
                    this.pagenumber = this.total_page;
                    this.start = this.pageCount - this.page_limit;
                }
                else {
                    this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
                }
                this.total_page = Math.ceil(this.pageCount / this.page_limit);
                this.sr_no = this.pagenumber - 1;
                this.sr_no = this.sr_no * this.page_limit;
            } else {
                this.ledger_loader = false
                this.toast.errorToastr(result['statusMsg'])
            }
        });
    }


    viewInvoice(start, end) {
        const dialogRef = this.dialog.open(InvoiceListModalComponent, {
            panelClass: 'full-width-modal',
            data: {
                'dr_code': this.dr_detail.dr_code,
                'start_date': start,
                'end_date': end,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
                this.distributorDetail();
            }
        });
    }

    update_google_location(country, state, district, city, pincode, address, type) {

        const dialogRef = this.dialog.open(DistributorModelComponent, {
            width: '500px',
            data: {
                id: this.dr_id,
                country,
                state,
                district,
                city,
                pincode,
                address,
                type,
            }
        });

        dialogRef.afterClosed().subscribe(latlong => {
            if (latlong != false) {
                this.distributorDetail();
                this.DistributorTarget();
                this.DistributorSalesChr();
                this.distributorTopSelling()
            }


        })
    }

    back(): void {
        this.location.back()
    }

    editDetails() {
        let state = this.dr_detail.state;
        let id = this.dr_id;
        let type = this.user_type;
        this.rout.navigate(['/add-distribution/' + this.user_type + '/' + this.dr_id], { queryParams: { state, id, type } });
    }
    // edit details

    discountEdit() {
        this.discountFlag = true;
    }
    // Update Discount Start
    UpdateDiscount(id, discount) {

        if (discount > 100) {
            this.toast.errorToastr('Discount not greater than 100');
            return
        }
        if (discount <= 0) {
            this.toast.errorToastr('Discount value more than 0');
            return
        }

        this.serve.post_rqst({ 'discount_id': id, 'discount': discount, 'last_updated_by': this.userId, 'last_updated_by_name': this.userName }, "CustomerNetwork/updateDrSegmentDiscountList").subscribe((result => {
            if (result['statusCode'] == 200) {
                this.discountFlag = false;
                this.toast.successToastr(result['statusMsg']);
            }
            else {
                this.toast.errorToastr(result['statusMsg']);
            }
        }))
    }

    // Update Discount End
    goTODetail(id, status) {
        this.rout.navigate(['/order-detail/' + id], { queryParams: { id, status } });
    }
    goTOSECONDARYDetail(id, status) {
        this.rout.navigate(['/secondary-order-detail/' + id], { queryParams: { id, status } });
    }

}
