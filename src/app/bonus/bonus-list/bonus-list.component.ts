import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';


@Component({
  selector: 'app-bonus-list',
  templateUrl: './bonus-list.component.html'
})
export class BonusListComponent implements OnInit {

  fabBtnValue:any ='add';
  active_tab:any ='active'
  filter:any = {};
  count:any = {};
  tabCount:any;
  loader:boolean = false;

  // pegination
  pageCount:any;
  total_page:any;
  page_limit: any;
  pagenumber:any =1;
  start: any = 0;
  bonusList_data:any =[];
  sr_no: number;
  userData: any;
  userId: any;
  assign_login_data: any = [];
  assign_login_data2: any = [];
  userName: any;
  noResult:boolean = false;
  downurl:any ='';
  constructor(public service:DatabaseService,public toast:ToastrManager,public alert: DialogComponent,public session:sessionStorage) {
    this.downurl = service.downloadUrl;
    this.page_limit = service.pageLimit;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
  }

  ngOnInit() {
    this.filter = this.service.getData()
    if(this.filter.status){
      this.active_tab = this.filter.status
    }
    this.bonusList();

  }

  pervious(){
    this.start = this.start - this.page_limit;
    this.bonusList();
  }

  nextPage(){
    this.start = this.start + this.page_limit;
    this.bonusList();
  }

  bonusList(){
    this.loader = true;
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
    }
    if(this.start<0){
      this.start=0;
    }

    if (this.filter.date_created){

      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.end_date){

      this.filter.end_date = moment(this.filter.end_date).format('YYYY-MM-DD');
    }
    if (this.filter.start_date){

      this.filter.start_date = moment(this.filter.start_date).format('YYYY-MM-DD');
    }
    this.filter.status = this.active_tab

    this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit,'status':this.active_tab},'Bonus/bonusList').subscribe((resp)=>
    {
      if (resp['data']['statusCode'] == 200){

        this.bonusList_data = resp['data']['result']
        this.tabCount=resp['data']['tabCount'];
        this.pageCount=resp['data']['count'];


        this.loader = false;
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          if(this.pageCount!=0){

            this.start = this.pageCount - this.page_limit;
          }
          else{
            this.start=0
          }
        }

        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        setTimeout(() => {
          if(this.bonusList_data.length == 0){
            this.noResult = true;
          }
        }, 500);
      }
      else{
        this.toast.errorToastr(resp['data']['statusMsg']);
      }
    })
  }


  lastBtnValue(value){
    this.fabBtnValue = value;
  }
  refresh(){
    this.filter={}
    this.service.setData(this.filter)
    this.service.currentUserID = ''
    this.bonusList();

  }
  change_status(id,index){
    this.alert.confirm("You Want To Change Status !").then((result)=>{
      if(result){

        if (this.bonusList_data[index].status == "Active") {
          this.bonusList_data[index].status = "Inactive";
        }
        else {
          this.bonusList_data[index].status = "Active";
        }
        let status=  this.bonusList_data[index].status
        this.service.post_rqst({'uid':this.userId,'id':id,'status':status},'Bonus/bonusStatusUpdate').subscribe((resp)=>
        {
          if (resp['statusCode'] == 200){
            this.toast.successToastr(resp['statusMsg']);
            this.bonusList();
          }
          else{
            this.toast.errorToastr(resp['statusMsg']);
          }
        }, error => {
        })
      }

    })
  }



  exportAsXLSX()
  {
    this.service.post_rqst({'filter':this.filter, 'start':this.start,'pagelimit':this.page_limit,'status':this.active_tab},'Excel/bonus_list').subscribe((result)=>{
      if(result['msg'] == true){
        window.open(this.downurl + result['filename'])
        this.bonusList();
      }else{
      }
    });
  }

}
