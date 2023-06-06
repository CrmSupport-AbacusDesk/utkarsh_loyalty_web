import {PageEvent} from '@angular/material/paginator';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ContractorMeetStatusModalComponent } from '../contractor-meet-status-modal/contractor-meet-status-modal.component';
import { DialogComponent } from 'src/app/dialog.component';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { Location } from '@angular/common'
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-contractor-meet-list',
  templateUrl: './contractor-meet-list.component.html'
})
export class ContractorMeetListComponent implements OnInit {
  tabActiveType:any={};
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  length=0;
  start=0;
  end=10;
  inc=0;
  pageEvent: PageEvent;
  companyType:any;
  login_data:any={};
  today_date:Date;
  searchData: any;
  backButton: boolean = false;
  data:any=[];
  allCount : any = {};
  contractorMeetListDetail : any = [];
  sendData : any = [];
  active_tab :any = 'Pending'
  assign_login_data: any = [];
  assign_login_data2: any = [];
  view_edit : boolean = true;
  view_add : boolean = true;
  view_delete : boolean = true;
  activePage_count:any;
  loader:boolean=false;
  datanotfound : boolean = false;
  // pagination
  total_page:any;
  pageCount:any;
  page_limit: any = 50;
  pagenumber:any =1;
  sr_no: number;

        constructor(public toast: ToastrManager, public route:ActivatedRoute,public dialog: MatDialog,public location: Location, public dialog1:DialogComponent,public session:sessionStorage, public serve: DatabaseService,public rout:Router) {

          this.page_limit = this.serve.pageLimit
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.assign_login_data = this.assign_login_data.assignModule;
    const index = this.assign_login_data.findIndex(row => row.module_name == 'Event');
    this.login_data = this.session.getSession();
    this.today_date = new Date();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    this.searchData = (this.route['params']['_value']);
    if(this.searchData.selectedUser && this.searchData.selectedDate){
      this.backButton = true;
      this.data.date_from = this.searchData.selectedDate;
      this.data.created_by = this.searchData.selectedUser;
  
        this.getContractorMeetList();
    }

    else{

      if(this.login_data.id)
      {
      
        this.getContractorMeetList();
      }
    }


  }
  ngOnInit() {
    this.data = this.serve.getData()
    if(this.data.status){
      this.active_tab = this.data.status
    }
    this.getContractorMeetList()
  }

  selectType(type){
    this.companyType=type;
    this.getContractorMeetList();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
      

    }
  }

  pervious(){
    this.start = this.start - this.page_limit;
    this.getContractorMeetList();
  }
  
  nextPage(){
    
    this.start = this.start + this.page_limit;
    this.getContractorMeetList();
  }

  open(){
    this.rout.navigate(['/contractor-meet-detail']);
  }

  public DateOfMeeting(event): void{

    this.data.dom_from=moment(event.value).format('YYYY-MM-DD');
    this.getContractorMeetList();
  }


  public onDate(event): void
  {
    this.data.date_from=moment(event.value).format('YYYY-MM-DD');
    this.getContractorMeetList();
  }


  getContractorMeetList(action:any='')
   {
    this.data.status -= this.active_tab
    if(action == "refresh")
    {
      this.data = {};
      this.contractorMeetListDetail = [];
    }

    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    this.sendData = {
      user_id: this.login_data.id,
      created_by_user :this.data.created_by,
      created_by_mobile:this.data.mobile_number,
      created_by_user_email:this.data.email,
      company_name:this.data.company_name,
      date_from: this.data.date_from,
      dom_from: this.data.dom_from,
      type:this.companyType, 
      status:this.active_tab,
    };
    this.loader=true;
    this.serve.post_rqst({'filter':this.sendData, start:this.start, pagelimit:this.page_limit}, "Event/eventList").subscribe((result) => {
      
      if(result['statusCode']==200){
      this.contractorMeetListDetail = result['result']['result'];
      this.allCount = result['result']['all_cont'];
      this.length = result['result'].length;
      this.activePage_count = this.allCount[this.active_tab];
      if(this.contractorMeetListDetail.length == 0){
        this.datanotfound = true
      }else{
        this.datanotfound= false
      }

      if(this.pagenumber > this.total_page){
        this.pagenumber = this.total_page;
        this.start = this.activePage_count - this.page_limit;
      }
      else{
        this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      }
      this.total_page = Math.ceil(this.activePage_count/this.page_limit);
      this.sr_no = this.pagenumber - 1;
      this.sr_no = this.sr_no * this.page_limit;
      this.loader = false;
    }else{
    this.loader=false;
      this.toast.errorToastr(result['statusMsg']);
  }

    },err=>{
    this.loader=false;

      this.toast.errorToastr('Something went wrong');
    })

  }

  refresh(){
    this.data={};
    this.sendData={};
    this.pagenumber=0;
    this.serve.setData(this.data)
    this.getContractorMeetList(this.active_tab);
  }

  statusModal(id,status){
    
    
    const dialogRef = this.dialog.open(ContractorMeetStatusModalComponent, {
      width:'500px',
      panelClass:'cs-modal',
      data:{
        'id': id,
        'status': status
      }});
      dialogRef.afterClosed().subscribe(result => {
        
        
        this.getContractorMeetList();
      });
    }

    public getServerData(event:PageEvent){
      this.sendData = {
        date_created: this.data.date_created,

        created_by_user :this.data.created_by,
        created_by_mobile:this.data.mobile_number,
        created_by_user_email:this.data.email,
        company_name:this.data.company_name,
        start:this.start,
        page_size:this.pageSize,
        end:this.end,
      };
      if(event.pageIndex != 0){
        this.inc =1;

      }
      else{
        this.inc =0;
      }

     // alert(event.pageIndex);
      this.start = event.pageIndex*10 ;
      this.end = (event.pageIndex+1)*10;
      this.getContractorMeetList();
    }

    back(): void {
      
      
      this.location.back()
    }


  }
