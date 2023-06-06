import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { Location } from '@angular/common'
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-secondary-order-list',
  templateUrl: './secondary-order-list.component.html',
  styleUrls: ['./secondary-order-list.component.scss']
})
export class SecondaryOrderListComponent implements OnInit {
  active_tab:any ='Pending';
  tabStatus: any = 'all';
  orderlist: any = [];
  tmp_orderlist: any = [];
  count: any;
  fabBtnValue:any ='add';
  total_page: any;
  loader: any;
  tmp_list: any = [];
  data: any = [];
  value: any = {};
  search_val: any = {}
  datanotfound: any = false;
  login_data: any = [];
  login_dr_id: any;
  skelton: any = {};
  secorder_list: any;
  today_date: Date;
  searchData: any;
  backButton: boolean = false;
  sr_no:any=0;
  pageCount:any;
  page_limit: any = 100;
  pagenumber:any =1;
  start: any = 0;
  date: any;
  currentMonth_no: any;
  currentYear: any;
  currentMonth: any;
  monthNames: string[];
  OrderMonth: any;
  OrderYear: any;
  downurl:any ='';
  constructor(public serve: DatabaseService, public location: Location,public navparams: ActivatedRoute,
     public route: Router, public dialog: DialogComponent, public session: sessionStorage,public toast : ToastrManager) {
    this.downurl = serve.downloadUrl;
    this.today_date = new Date();
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value.data;
    this.skelton = new Array(10);
    this.page_limit = serve.pageLimit
    this.searchData = (this.navparams['params']['_value']);
    this.date = new Date();
    this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    this.currentMonth_no = this.date.getMonth() + 1;
  }
  
  ngOnInit() {
    this.search_val = this.serve.getData()
    if(this.search_val.order_status){
      this.active_tab = this.search_val.order_status
      this.currentMonth_no = this.search_val.month
      this.currentYear = this.search_val.year 
    }
    if (this.searchData.selectedUser && this.searchData.selectedDate && this.searchData.from == 'attendence') {
      this.backButton = true;
      console.log('in the 1 if condition')

      this.search_val.created_by = this.searchData.selectedUser;
      this.search_val.date_created = this.searchData.selectedDate;
    }
    
    else if(this.searchData.selectedUser && this.searchData.selectedDate && this.searchData.company_name && this.searchData.from == 'checkin'){
      this.backButton = true;
      this.search_val.created_by = this.searchData.selectedUser;
      this.search_val.date_created = this.searchData.selectedDate;
      this.search_val.company_name = this.searchData.company_name;
      this.orderList('',this.currentMonth_no,this.currentYear);

    }
    else {
      if (this.login_data.access_level != '1') {
        this.login_dr_id = this.login_data.id;
      }

    }
    this.orderList('',this.currentMonth_no,this.currentYear);

  }

  
  inputValue(value){
    if(value > this.total_page){
      this.start = this.total_page;
    }
    else if(value == '' || value <= 0){
      this.start= 0;
    }
    else{
      this.start= (this.pagenumber*this.page_limit)-this.page_limit;
    }
    
    this.orderList('',this.currentMonth_no,this.currentYear)
  }
  
  pervious(blank,month,year){
    this.start = this.start - this.page_limit;
    this.orderList(blank,month,year);
  }
  
  nextPage(blank,month,year){
    this.start = this.start + this.page_limit;
    this.orderList(blank,month,year);
  }
  
  calenderInfo:any = []
  orderList(action: any = '',month,year) {
    if (action == "refresh") {
      this.search_val = {};
      this.orderlist = [];
      this.start = 0;
    }
    this.loader = 1;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start < 0){
      this.start = 0;
    } 
    this.OrderMonth = month;
    this.OrderYear = year;
    this.search_val.order_status = this.active_tab
    this.search_val.year = this.OrderYear
    this.search_val.month = this.OrderMonth
    this.serve.post_rqst({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id,'month':month,'year':year }, "Order/secondaryOrderList")
    .subscribe((result => {
      if(result['statusCode']==200){
      this.tmp_orderlist = result['result'];
      this.calenderInfo = result['calenderInfo'];
      this.count = result['count'];
      this.filter_order_data(this.tabStatus);
      for (let index = 0; index < this.calenderInfo.length; index++) {
        const date = new Date();
        date.setMonth(this.calenderInfo[index].month - 1);
        let MonthName = ''
        MonthName = date.toLocaleString('en-US', { month: 'short' })
        this.calenderInfo[index].month_name = MonthName
      }
      if(this.active_tab == 'Pending'){
        this.pageCount =  this.count.Pending;
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        
      }
      else if(this.active_tab == 'Approved'){
        this.pageCount =  this.count.Approved;
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        
      }
      else if(this.active_tab == 'Reject'){
        this.pageCount =  this.count.Reject;
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        
      }
      else if(this.active_tab == 'Hold'){
        this.pageCount =  this.count.Draft;
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
      }
      else if(this.active_tab == 'Partially'){
        this.pageCount =  this.count.Partial_Dispact;
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
      }
      else{
        this.pageCount =  this.count.Dispact;
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        
      }
      if(this.pagenumber > this.total_page){
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      else{
        this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      }
      this.sr_no = this.pagenumber - 1;
      this.sr_no = this.sr_no * this.page_limit;
      
      
      
      setTimeout(() => {
        this.loader = '';
        
      }, 700);
      if (this.tmp_orderlist.length == 0) {
        this.datanotfound = true;
      } else {
        this.datanotfound = false;
        
      }
    }else{
      
      setTimeout(() => {
        this.loader = '';
        
      }, 700);
      this.toast.errorToastr(result['statusMsg'])
    }
    }))
    this.serve.count_list();
  }
  
  filter_order_data(status) {
    this.tabStatus = status;
    if (status == 'Partial Dispatch') {
      this.orderlist = this.tmp_orderlist;
      this.secorder_list = this.orderlist.filter(row => row.order_status == 'Partial Dispatch');
      this.orderlist = this.secorder_list;
    }
    if (status == 'Dispatch') {
      this.orderlist = this.tmp_orderlist;
      this.secorder_list = this.orderlist.filter(row => row.order_status == 'Dispatch');
      this.orderlist = this.secorder_list;
    }
    else if (this.active_tab == 'Pending') {
      this.orderlist = this.tmp_orderlist;
      this.secorder_list = this.orderlist.filter(row => row.order_status == 'Pending');
      this.orderlist = this.secorder_list;
      
    }
    
    else if (status == 'all') {
      this.orderlist = this.tmp_orderlist;
    }
    
    else if (status == 'Modified') {

      this.orderlist = this.tmp_orderlist;
      this.secorder_list = this.orderlist.filter(row => row.flag == '1');
      this.orderlist = this.secorder_list;

      
    }
  }
  
  refresh(blank,month,year) {
    this.search_val = {}
    this.serve.setData(this.search_val)
    this.serve.currentUserID = ''
    this.orderList(blank,month,year);
  }
  
  
  lastBtnValue(value){
    this.fabBtnValue = value;
  }  
  exp_loader: any = false;
  
  public onDate(event,month,year): void {
    this.search_val.date_created = moment(event.value).format('YYYY-MM-DD');
    this.orderList('',month,year);
  }
  
  back(): void {

    this.location.back()
  }
  
  
  goTODetail(id,status){
    this.route.navigate(['/secondary-order-detail/'+id],{ queryParams: { id, status} });
  }
  
  
  exportAsXLSX(month, year)
  {
    this.serve.post_rqst({ 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search_val, 'login_user': this.login_dr_id,'month':month,'year':year }, "Excel/secondary_order_list")
    .subscribe((result => 
      {
        if(result['msg'] == true){
          window.open(this.downurl + result['filename'])
          this.orderList('', this.OrderMonth, this.OrderYear);
        }else{
        }
      }));
    }
  }
  
  
  
  