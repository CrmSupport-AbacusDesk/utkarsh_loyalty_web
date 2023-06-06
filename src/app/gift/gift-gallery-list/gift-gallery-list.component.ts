import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
@Component({
  selector: 'app-gift-gallery-list',
  templateUrl: './gift-gallery-list.component.html'
})
export class GiftGalleryListComponent implements OnInit {
  fabBtnValue: any = 'add';
  active_tab: any = 'Gift'
  filter: any = {};   
  excel_data: any = [];
  giftList:any=[];
  giftListItem: any = [];
  search_val: any = {}
  loader:boolean = false;
  login_dr_id: any;
  assign_login_data: any;
  logined_user_data2:any; 
  logined_user_data: any;
  datanotfound : boolean = false;
  pageCount:any;
  total_page:any; 
  page_limit: any;
  pagenumber:any =1;
  start: any = 0;
  sr_no: number;
  count:any={};
  tabCount:any={};
  today_date: Date;
  items_object: any = {}
  user_type: any = [];
  url:any;
  constructor(public serve: DatabaseService, public dialogs: MatDialog,public alert: DialogComponent,public toast:ToastrManager,public session: sessionStorage) {
    this.url = this.serve.uploadUrl + 'gift_gallery/'
    this.page_limit = this.serve.pageLimit;
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value;
    this.logined_user_data2 = this.logined_user_data.data;
    this.gift_gallery_list();
    this.today_date = new Date();

  }
  
  ngOnInit() {
  }
  public onDate(event): void {
    this.filter.date_created = moment(event.value).format('YYYY-MM-DD');
    this.gift_gallery_list();
  }
  
  
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.gift_gallery_list();
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.gift_gallery_list();
  }
  
  gift_gallery_list() {
    
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
    }
    if(this.start<0){
      this.start=0;
    }
    
    this.filter.gift_type = this.active_tab
    this.loader = true;
    this.serve.post_rqst({ 'filter': this.filter, 'start':this.start,'pagelimit':this.page_limit }, "GiftGallery/giftGalleryList")
    .subscribe((result => {
      if (result['statusCode'] == 200){
        this.giftList = result['gift_master_list'];
        this.count = result['count'];
        this.tabCount = result['tabCount'];
        this.pageCount=result['count'];
        if(this.giftList.length == 0){
          this.datanotfound = true
        }else{
          this.datanotfound= false
        }
        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          if(this.pageCount!=0){
            this.start = this.pageCount - this.page_limit;
          }
          else{
            this.start= 0
          }
        }
        
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;
        
        for (let index = 0; index < this.giftList.length; index++) {
          this.giftListItem = this.giftList[index]['item'];
          let val: any = '';
          for (let index = 0; index < this.giftListItem.length; index++) {
            val += this.giftListItem[index].user_type + ', '
          }
          this.giftList[index].object = val
        }
        setTimeout(() => {
          this.loader = false;
          
        }, 700);
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
    this.serve.count_list();
  }
  
  updateStatus(index,id,event)
  {
    if(event.checked == false)
    {
      this.alert.confirm("You Want To Change Status !").then((result)=>{
        if(result){
          if (event.checked == false) {
            this.giftList[index].status = "0";
          }
          else {
            this.giftList[index].status = "1";
          }
          let value = this.giftList[index].status;
          this.serve.post_rqst({ 'gift_gallery_id': id, 'status': value,'status_changed_by':this.logined_user_data.data.id, 'status_changed_by_name':this.logined_user_data.data.name}, "GiftGallery/giftGalleryStatusChange")
          .subscribe(resp => {
            if(resp['statusCode'] == 200){
              this.toast.successToastr(resp['statusMsg']);
              this.gift_gallery_list();
            }
            else{
              this.toast.errorToastr(resp['statusMsg']);
            }
          })
        }
      })
    }
    else if(event.checked == true){
      this.alert.confirm("You Want To Change Status !").then((result)=>{
        if(result){
          if (event.checked == false) {
            this.giftList[index].status = "0";
          }
          else {
            this.giftList[index].status = "1";
          }
          
          let value = this.giftList[index].status;
          this.serve.post_rqst({ 'gift_gallery_id': id, 'status': value,'status_changed_by':this.logined_user_data.data.id, 'status_changed_by_name':this.logined_user_data.data.name}, "GiftGallery/giftGalleryStatusChange")
          .subscribe(resp => {
            if(resp['statusCode'] == 200){
              this.toast.successToastr(resp['statusMsg']);
              this.gift_gallery_list();
            }
            else{
              this.toast.errorToastr(resp['statusMsg']);
            }
          })
        }
      })
    }  
  }
  
  
  
  goToImage(image)
  {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      panelClass:'Image-modal',
      data:{
        'image':image,
        'type':'base64'
      }});
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    
    refresh()
    {
      this.filter={};
      this.gift_gallery_list();
    }
    lastBtnValue(value) {
      this.fabBtnValue = value;
    }
    
    
  }
  