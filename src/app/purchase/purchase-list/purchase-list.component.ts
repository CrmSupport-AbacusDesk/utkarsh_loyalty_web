import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ChangeStatusComponent } from '../change-status/change-status.component';




@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {
  active_tab: any = 'Pending';
  segmentList:any =[];
  SubcategoryList:any =[];
  purchaselist: any = [];
  filter: any = false;
  data: any = [];
  page_limit: any=5;
  start: any = 0;
  brand_list: any = [];
  product_brand: any = [];
  count: any;
  category_list: any = [];
  subCategory_list: any = [];
  total_page:any=0;
  pagenumber:any =0;
  loader: boolean = false;
  tab_active = 'all';
  influencer_type='Dealer'
  filter_data:any={};
  assign_login_data:any={};
  logined_user_data:any={};
  today_date: Date;
  fabBtnValue:any ='add';
  excelLoader:boolean = false;
  pageCount: any;
  sr_no: number;
  datanotofound: boolean=false;
  downurl:any = ''
  imgUrl:any = '';
  tabCount:any;




  constructor(public dialog: DialogComponent,  public dialogs: MatDialog, public alert: DialogComponent, public service: DatabaseService, public rout: Router, public toast: ToastrManager,public session: sessionStorage,) {
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl
    this.imgUrl = service.purchaseUrl
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    this.today_date = new Date();
    this.getPurchaseList('');
    this.getSegment();
  }

  ngOnInit() {
    this.filter_data = this.service.getData();
    if (this.filter.status) {
      this.active_tab = this.filter_data.status
    }
  }

  pervious(){
    this.start = this.start - this.page_limit;
    this.getPurchaseList('');
  }

  nextPage(){
    this.start = this.start + this.page_limit;
    this.getPurchaseList('');
  }


  getPurchaseList(data) {
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }

    this.filter_data.status = this.active_tab;
    this.filter_data.influencer_type = this.influencer_type;


    let header = this.service.post_rqst({'filter' : this.filter_data, 'start':this.start,'pagelimit':this.page_limit},"RetailerRequest/get_retailer_request")

    this.loader = true;
    header.subscribe((result) => {
      if(result['statusCode'] == 200){

        this.purchaselist = result['request_list'];
        this.pageCount = result['count'];
        this.tabCount = result['tab_count'];

        this.loader = false;
        if (this.purchaselist.length == 0) {
          this.datanotofound=true;
        }else{
          this.datanotofound=false;
          this.loader = false;
        }

        if(this.pagenumber > this.total_page){
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else{
          this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
        }
        this.total_page = Math.ceil(this.pageCount/this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit


        for(let i=0;i<this.purchaselist.length;i++)
        {
          if(this.purchaselist[i].status == '1')
          {
            this.purchaselist[i].newStatus = true
          }
          else if(this.purchaselist[i].status == '0')
          {
            this.purchaselist[i].newStatus=false;
          }
        }
      }
      else{
        this.toast.errorToastr(result['statusMsg']);
        this.datanotofound=true;
        this.loader = false;
      }

    })
  }

  showItems(data){
    const dialogRef = this.dialogs.open(ChangeStatusComponent, {
      width: '500px',
      panelClass:'cs-modal',
      data:{
        itemData: data,
        from_Item: 'purchase-item'
      }

    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }


  // upload_excel(type) {
  //   const dialogRef = this.dialogs.open(ProductUploadComponent, {
  //     width: '500px',
  //     panelClass:'cs-modal',
  //     data: {
  //       'from': 'beat',
  //       'modal_type':type
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result != false){
  //       this.getPurchaseList('');
  //     }
  //   });
  // }
  excel_data: any = [];
  districtAppend:any;
  state4xl:any;

  lastBtnValue(value){
    this.fabBtnValue = value;
  }
  getSegment() {
    setTimeout(() => {
      this.service.post_rqst({}, "Master/getProductCategoryList").subscribe((result => {
        if(result['category_list']['statusCode'] ==  200){
          this.segmentList = result['category_list']['segment_list'];
        }
      }))
    }, 2000);

  }


  getSubCatgory() {
    setTimeout(() => {
      this.service.post_rqst({'id':this.filter_data.segment}, "Master/subCategoryList").subscribe((result => {
        if(result['statusCode'] ==  200){
          this.SubcategoryList = result['result'];
        }
      }))
    }, 2000);
  }

  goToDetailHandler(pId) {
    window.open(`/product-detail/` + pId);
  }






  refresh() {
    this.start = 0;
    this.filter_data={};
    this.getPurchaseList('');
  }


  productdetail: any = [];

  detailProduct(id) {
    let value = { "id": id }
    this.service.post_rqst(value, "Master/product_detail").subscribe((result => {
      this.productdetail = result['product_detail'];
      if (result) {
        this.rout.navigate(['/product-detail/' + id]);
      }
    }))
  }

  Filter() {
    this.filter = true;
  }
  close() {
    this.filter = false;
  }

  clear() {
    this.data.brand = "";
    this.data.category = "";
    this.data.sub_category = "";
    this.refresh();
  }




  date_format(): void
  {
      if(this.filter_data.date_created){
        this.filter_data.date_created=moment(this.filter_data.date_created).format('YYYY-MM-DD');
        this.getPurchaseList('');
      }
      else if(this.filter_data.bill_date){
        this.filter_data.bill_date=moment(this.filter_data.bill_date).format('YYYY-MM-DD');
        this.getPurchaseList('');

      }

  }
  goToImage(image) {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        'image': image,
        'type': 'base64'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

  changeStatus(id): void {
    const dialogRef = this.dialogs.open(ChangeStatusComponent, {
      width: '800px',
      panelClass:'cs-modal',
      data:{
        id : id,
        from: 'purchase-list'
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      // if(result != false){
      //   this.getPurchaseList(this.active_tab);
      // }
    });
  }


  updateStatus(index,id,event)
  {
    if(event.checked == false)
    {
      this.alert.confirm("You Want To Change Status !").then((result)=>{
        if(result){
          if (event.checked == false) {
            this.purchaselist[index].status = "0";
          }
          else {
            this.purchaselist[index].status = "1";
          }
          let value = this.purchaselist[index].status;
          this.service.post_rqst({'product_id': id, 'status': value,'status_changed_by':this.logined_user_data.id, 'status_changed_by_name':this.logined_user_data.name}, "Master/productStatusChange")
          .subscribe(resp => {
            if(resp['statusCode'] == '200'){
              if(resp['statusMsg'] == "Status Updated Successfully"){
                this.toast.successToastr("Status Changed Successfully");
              }else{
                this.toast.errorToastr("OOPs ! Failed To Status Changed");
              }
              this.getPurchaseList('');
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
            this.purchaselist[index].status = "0";
          }
          else {
            this.purchaselist[index].status = "1";
          }
          let value = this.purchaselist[index].status;
          this.service.post_rqst({'product_id': id, 'status': value,'status_changed_by':this.logined_user_data.id, 'status_changed_by_name':this.logined_user_data.name}, "Master/productStatusChange")
          .subscribe(resp => {
            if(resp['statusCode'] == '200'){
              if(resp['statusMsg'] == "Status Updated Successfully"){
                this.toast.successToastr("Status Changed Successfully");
              }else{
                this.toast.errorToastr("OOPs ! Failed To Status Changed");
              }
              this.getPurchaseList('');
            }
            else{
              this.toast.errorToastr(resp['statusMsg']);
            }
          })
        }
      })
    }
  }

  downloadExcel(){
    this.filter_data.status = this.active_tab;
    this.filter_data.influencer_type = this.influencer_type;
    this.service.post_rqst({'filter' : this.filter_data}, "Excel/purchase_list_for_excel").subscribe((result => {
      if(result['msg'] == true){
        window.open(this.downurl + result['filename'])
        this.getPurchaseList('');
      }else{
      }
    }));
  }

}
