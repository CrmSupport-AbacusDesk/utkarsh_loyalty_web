import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { Location } from '@angular/common'
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  animations: [slideToTop()]

})
export class OrderListComponent implements OnInit {
  view_tab: any = 'all';
  value: any = {};
  tabStatus: any = 'all';
  fabBtnValue: any = 'add';
  active_tab: any = 'Pending';
  orderlist: any = [];
  excelLoader: boolean = false;
  count: any;
  total_page: any;
  loader: any;
  tmp_list: any = [];
  tmp_orderlist: any = [];
  data: any = [];
  search_val: any = {};
  datanotfound: any = false;
  login_data: any = [];
  login_dr_id: any;
  skelton: any = {};
  today_date: Date;
  searchData: any;
  backButton: boolean = false;
  count_list: any = [];
  sr_no: any = 0;
  pageCount: any;
  page_limit: any = 100;
  pagenumber: any = '';
  start: any = 0;
  type: any;
  type_id: any;
  currentMonth: any;
  monthNames: string[];
  currentMonth_no: any;
  currentYear: any;
  date: any;
  OrderMonth: any;
  OrderYear: any;
  downurl: any = '';
  constructor(public serve: DatabaseService,
    public location: Location,
    public navparams: ActivatedRoute,
    public route: Router,
    public dialog: DialogComponent,
    public session: sessionStorage,
    public toast:  ToastrManager
    ) {
    this.downurl = serve.downloadUrl;
    this.page_limit = serve.pageLimit
    this.today_date = new Date();
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    this.skelton = new Array(10);
    this.date = new Date();
    this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth() + 1;
    if (this.login_data.access_level != '1') {
      this.login_dr_id = this.login_data.id;
    }
  
  }

  ngOnInit() {
    this.search_val = this.serve.getData()
    if(this.search_val.order_status){
      this.active_tab = this.search_val.order_status
      this.currentMonth_no = this.search_val.month
      this.currentYear = this.search_val.year 
    }
    this.searchData = (this.navparams['params']['_value']);
    this.navparams.params.subscribe(params => {
      this.type_id = params.id;
      this.type = params.type;
      this.orderList('', this.currentMonth_no, this.currentYear);
    });
  }
  public onDate(event): void {
    this.search_val.date_created = moment(event.value).format('YYYY-MM-DD');
    this.orderList('', this.OrderMonth, this.OrderYear);
  }

  inputValue(value) {
    if (value > this.total_page) {
      this.start = this.total_page;
    }
    else if (value == '' || value <= 0) {
      this.start = 0;
    }
    else {
      this.start = (this.pagenumber * this.page_limit) - this.page_limit;
    }

    this.orderList('', this.currentMonth_no, this.currentYear)
  }

  pervious(blank, month, year) {
    this.start = this.start - this.page_limit;
    this.orderList(blank, month, year);
  }

  nextPage(blank, month, year) {
    this.start = this.start + this.page_limit;
    this.orderList(blank, month, year);
  }
  calenderInfo: any = []
  orderList(action: any = '', month, year) {
    if (action == "refresh") {
      this.search_val = {};
      this.orderlist = [];
      this.start = 0;
    }
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.OrderMonth = month;
    this.OrderYear = year;
    this.search_val.order_status = this.active_tab
    this.search_val.month = this.OrderMonth
    this.search_val.year = this.OrderYear
    this.loader = 1;
    this.serve.post_rqst({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year }, "Order/primaryOrderList")
      .subscribe((result => {
        if(result['statusCode'] == 200) {
          this.count = result['count'];
          this.tmp_orderlist = result['result'];
          this.calenderInfo = result['calenderInfo'];
          setTimeout(() => { 
            this.loader = '';
          }, 700);
          this.filter_order_data(this.tabStatus);
          for (let index = 0; index < this.calenderInfo.length; index++) {
            const date = new Date();
            date.setMonth(this.calenderInfo[index].month - 1);
            let MonthName = ''
            MonthName = date.toLocaleString('en-US', { month: 'short' })
            this.calenderInfo[index].month_name = MonthName
          }
          if (this.active_tab == 'Pending') {
            this.pageCount = this.count.Pending;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);

          }
          else if (this.active_tab == 'Approved') {
            this.pageCount = this.count.Approved;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);

          }
          else if (this.active_tab == 'Reject') {
            this.pageCount = this.count.Reject;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);

          }
          else if (this.active_tab == 'Hold') {
            this.pageCount = this.count.Hold;
            this.total_page = Math.ceil(this.pageCount / this.page_limit);
          }
          else if (this.active_tab == 'Partially') {
            this.pageCount = this.count.Partial_Dispact;
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
          this.sr_no = this.pagenumber - 1;
          this.sr_no = this.sr_no * this.page_limit;
          
          if (this.orderlist.length == 0) {
            this.datanotfound = true;
          } else {
            this.datanotfound = false;
          }
        } else {
          setTimeout(() => {
            this.loader = '';
          }, 700);
          this.toast.errorToastr(result['statusMsg'])
    }
      }))
    this.serve.count_list();

  }
  refresh(blank, month, year) {
    this.search_val = {}
    this.serve.setData(this.search_val)
    this.serve.currentUserID = ''
    this.orderList(blank, month, year);
  }
  detailOrder(id) {
    this.serve.orderFilterPrimary = this.search_val;
    this.route.navigate(['/order-detail/' + id]);
  }

  tmpsearch: any = {};
  tmpsearch1: any = {};
  filter_order_data(status) {
    this.tabStatus = status;
    this.view_tab = status;
    if (status != 'all') {
      this.orderlist = [];
      for (var i = 0; i < this.tmp_orderlist.length; i++) {

        this.tmpsearch = this.tmp_orderlist[i]['order_status'];
        if (this.tmpsearch.includes(status)) {


          this.orderlist.push(this.tmp_orderlist[i]);
        }
      }

    } else if (status == 'all') {
      this.orderlist = this.tmp_orderlist;
    }
  }


  back(): void {
    this.location.back()
  }

  lastBtnValue(value) {
    this.fabBtnValue = value;
  }


  goTODetail(id, status) {
    this.route.navigate(['/order-detail/' + id], { queryParams: { id, status } });
  }
  exportAsXLSX(month, year) {
    this.serve.post_rqst({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id, 'month': month, 'year': year }, "Excel/primary_order_list")
      .subscribe((result => {
        if (result['msg'] == true) {
          window.open(this.downurl + result['filename'])
          this.orderList('', this.OrderMonth, this.OrderYear);
        } else {
         
        }
      }));
  }

}
