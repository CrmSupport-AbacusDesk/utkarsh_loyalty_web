import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { ExpenseModalComponent } from '../expense-modal/expense-modal.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common'
import { sessionStorage } from 'src/app/localstorage.service';
import * as XLSX from 'xlsx';
import { ToastrManager } from 'ng6-toastr-notifications';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';




@Component({
  selector: 'app-list-expense',
  templateUrl: './list-expense.component.html',
  styleUrls: ['./list-expense.component.scss']
})
export class ListExpenseComponent implements OnInit {
  @ViewChild('table') table: ElementRef;
  
  food_expense_list: any = [];
  out_expense_list: any = [];
  hotel_expense_list: any = [];
  misc_expense_list: any = []
  local_expense_list: any = []
  user_list: any = []
  rsmData: any
  rsmname: any
  rsmrole: any
  user: any = []
  name: any
  designation: any
  out: any = 0
  local: any = 0
  misc: any = 0
  food: any = 0
  hotel: any = 0
  total: any
  expense_list: any = [];
  search: any = {};
  active_tab = 'Pending';
  loader: any;
  datanotfound = false;
  skelton: any;
  searchData: any;
  search_val: any = {}
  backButton: boolean = false;
  list1: any = []
  assign_login_data: any = [];
  assign_login_data2: any = [];
  view_edit: boolean = true;
  view_add: boolean = true;
  view_delete: boolean = true;
  tabCount: any;
  sr_no: any = 0;
  total_page: any;
  pageCount: any;
  page_limit: any;
  pagenumber: any = 1;
  start: any = 0;
  today_date: any = new Date()
  status_count: any;
  downurl: any = '';
  
  constructor(public toast: ToastrManager, private bottomSheet: MatBottomSheet, public serve: DatabaseService, public location: Location, public navparams: ActivatedRoute, public dialog: MatDialog, public session: sessionStorage) {
    this.downurl = serve.downloadUrl;
    this.page_limit = serve.pageLimit;
    this.skelton = new Array(7);
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
  }
  
  ngOnInit() {
    this.search = this.serve.getData()
    if (this.search.status) {
      this.active_tab = this.search.status
    }
    this.searchData = (this.navparams['params']['_value']);
    if (this.searchData.selectedUser && this.searchData.selectedDate) {
      this.backButton = true;
      this.search.userName = this.searchData.selectedUser;
      this.search.dateCreated = this.searchData.selectedDate;
      this.expenseList();
    }
    this.expenseList();
  }
  
  refresh() {
    this.search = {}
    this.serve.setData(this.search)
    this.serve.currentUserID = ''
    this.expenseList();
  }
  
  
  pervious() {
    this.start = this.start - this.page_limit;
    this.expenseList('');
  }
  
  nextPage() {
    
    this.start = this.start + this.page_limit;
    this.expenseList('');
  }
  
  expenseList(action: any = '') {
    if (action == "refresh") {
      this.search = {};
    }
    this.loader = true;
    
    if (this.search.dateCreated) {
      this.search.dateCreated = moment(this.search.dateCreated).format('YYYY-MM-DD');
    }
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;
    this.search.status = this.active_tab
    this.serve.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'expenseStatus': this.active_tab, 'user_type': this.assign_login_data2.type }, "Expense/expenseList").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.expense_list = result['result'];
        this.pageCount = result['count'];
        this.tabCount = result['sub_count'];
        
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit
        if (this.expense_list.length == 0) {
          this.datanotfound = true;
        }
        else {
          this.datanotfound = false;
        }
        
        setTimeout(() => {
          this.loader = false;
          
        }, 100);
      } else {
        this.loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    })
    
    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }
    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    }
  }
  
  
  expModal(type, id, totalAmt) {
    const dialogRef = this.dialog.open(ExpenseModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        type,
        id,
        totalAmt
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.expenseList();
    });
    
  }
  
  back(): void {
    this.location.back()
  }
  
  
  
  
  
  
  
  
  public date(date) {
    if (this.search.date_from) {
      this.search.date_from = moment(this.search.date_from).format('YYYY-MM-DD');
    }
    if (this.search.date_to) {
      this.search.date_to = moment(this.search.date_to).format('YYYY-MM-DD');
    }
  }
  
  
  
  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent,{
      data: {
        'filterPage': 'Expense',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data)=> {
      this.search.date_from = data.date_from;
      this.search.date_to = data.date_to;
      this.search.userId = data.user_id;
      this.exportAsXLSX('');
    })
  }
  
  
  exportAsXLSX(status) {
    this.search.status = status;
    this.serve.post_rqst({ 'user_id': this.assign_login_data2.id, 'start': this.start, 'pagelimit': this.page_limit, 'search': this.search, 'expenseStatus': this.active_tab, 'user_type': this.assign_login_data2.type }, "Excel/expense_list").subscribe((result => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.expenseList();
      } else {
        this.toast.errorToastr('Data not found');
      }
      
    }));
    
  }
}
