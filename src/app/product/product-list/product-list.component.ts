import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ProductUploadComponent } from 'src/app/product-upload/product-upload.component';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  animations: [slideToTop()]
})
export class ProductListComponent implements OnInit {
  segmentList:any =[];
  SubcategoryList:any =[];
  productlist: any = [];
  filter: any = false;
  data: any = [];
  page_limit: any;
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
  scheme_active_count: any;
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
  
  
  
  constructor(public dialog: DialogComponent,  public dialogs: MatDialog, public alert: DialogComponent, public service: DatabaseService, public rout: Router, public toast: ToastrManager,public session: sessionStorage,) {
    this.page_limit = service.pageLimit;
    this.downurl = service.downloadUrl
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;    
    this.today_date = new Date();
    this.getProductList('');
    this.getSegment();
  }
  
  ngOnInit() {
    this.filter_data = this.service.getData()
  }
  
  pervious(){
    this.start = this.start - this.page_limit;
    this.getProductList('');
  }
  
  nextPage(){
    this.start = this.start + this.page_limit;
    this.getProductList('');
  }
  
  
  getProductList(data) {
    if(this.pagenumber > this.total_page){
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if(this.start<0){
      this.start=0;
    }
    let header = this.service.post_rqst({'filter' : this.filter_data, 'start':this.start,'pagelimit':this.page_limit},"Master/productList")
    
    this.loader = true;
    header.subscribe((result) => {
      if(result['statusCode'] == 200){
        
        this.productlist = result['product_list'];
        this.pageCount = result['count'];
        this.scheme_active_count = result['scheme_active_count'];
        this.loader = false;
        if (this.productlist.length == 0) {
          this.datanotofound=false;
        }else{
          this.datanotofound=true;
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
        
        
        for(let i=0;i<this.productlist.length;i++)
        {
          if(this.productlist[i].status == '1')
          {
            this.productlist[i].newStatus = true
          }
          else if(this.productlist[i].status == '0')
          {
            this.productlist[i].newStatus=false;
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
  
  
  upload_excel(type) {
    const dialogRef = this.dialogs.open(ProductUploadComponent, {
      width: '500px',
      panelClass:'cs-modal',
      data: {
        'from': 'beat',
        'modal_type':type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result != false){
        this.getProductList('');
      }
    });
  }
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
  
  
  
  
  deleteProduct(id) {
    this.dialog.delete('Product Data !').then((result) => {
      if (result) {
        let value = { "id": id }
        this.service.post_rqst(value, "Master/delete_product").subscribe((result) => {
          if (result) {
            this.getProductList('');
          }
        });
      }
    });
  }
  
  
  refresh() {
    this.start = 0;
    this.filter_data={};
    this.getProductList('');
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
    
    this.filter_data.date_created=moment(this.filter_data.date_created).format('YYYY-MM-DD'); 
    this.getProductList('');
  }
  
  
  updateStatus(index,id,event)
  {
    if(event.checked == false)
    {
      this.alert.confirm("You Want To Change Status !").then((result)=>{
        if(result){
          if (event.checked == false) {
            this.productlist[index].status = "0";
          }
          else {
            this.productlist[index].status = "1";
          }
          let value = this.productlist[index].status;
          this.service.post_rqst({'product_id': id, 'status': value,'status_changed_by':this.logined_user_data.id, 'status_changed_by_name':this.logined_user_data.name}, "Master/productStatusChange")
          .subscribe(resp => {
            if(resp['statusCode'] == '200'){
              if(resp['statusMsg'] == "Status Updated Successfully"){
                this.toast.successToastr("Status Changed Successfully");
              }else{
                this.toast.errorToastr("OOPs ! Failed To Status Changed");
              }
              this.getProductList('');
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
            this.productlist[index].status = "0";
          }
          else {
            this.productlist[index].status = "1";
          }
          let value = this.productlist[index].status;
          this.service.post_rqst({'product_id': id, 'status': value,'status_changed_by':this.logined_user_data.id, 'status_changed_by_name':this.logined_user_data.name}, "Master/productStatusChange")
          .subscribe(resp => {
            if(resp['statusCode'] == '200'){
              if(resp['statusMsg'] == "Status Updated Successfully"){
                this.toast.successToastr("Status Changed Successfully");
              }else{
                this.toast.errorToastr("OOPs ! Failed To Status Changed");
              }
              this.getProductList('');
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
    this.service.post_rqst({'filter' : this.filter_data}, "Excel/product_list_for_excel").subscribe((result => {
      if(result['msg'] == true){
        window.open(this.downurl + result['filename'])
        this.getProductList('');
      }else{
      }
    }));
  }
  
}
