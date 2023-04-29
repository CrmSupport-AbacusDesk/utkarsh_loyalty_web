import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';


@Component({
  selector: 'app-bonus-update',
  templateUrl: './bonus-update.component.html'
})


export class BonusUpdateComponent implements OnInit {
  savingFlag:boolean = false;
  segment:any={};
  category:any={};
  login:any={};
  delivery_from:any;
  userData: any;
  userId: any;
  userName: any;
  modelType:any;
  formData:any ={};
  assign_login_data:any={};
  logined_user_data:any={};
  minDate:any;
  filter:any ={};
  pointCategories_data:any=[];
  lastPageProduct:any =[];
  influencerUser:any =[];
  

  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public service:DatabaseService, public session: sessionStorage,public toast:ToastrManager, public dialogRef: MatDialogRef<BonusUpdateComponent>) { 
   this.getInfluencer();
    this.minDate = new Date();
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.modelType = data['type'];
    this.formData = data['data'];
    console.log(this.formData)
    this.lastPageProduct = this.formData['product_data'];
    if(this.formData.types == 'Retailer'){
      this.pointCategory_data('Master Box');
    }
    else{
      this.pointCategory_data('Item Box');
    }
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
  }
  
  ngOnInit() {
    this.login=JSON.parse(localStorage.getItem('login'));
  }

  blankArray(){
    this.newProdcut =[];
  }
  
  pointCategory_data(status)
  {
    this.filter.point_type = status; 
    this.service.post_rqst({'filter':this.filter},'Master/pointCategoryMasterList').subscribe((resp)=>
    {
      this.pointCategories_data=resp['point_category_list'];
      this.compareArray();
    })
  }
  
  newProdcut:any =[];
  compareArray(){
    for (let i = 0; i < this.pointCategories_data.length; i++) {
      for (let j = 0; j < this.lastPageProduct.length; j++) {
        if(this.pointCategories_data[i]['id'] == this.lastPageProduct[j]['product_id']){
          this.pointCategories_data[i]['scheme_influencer_point'] = this.lastPageProduct[j]['point'];          
        }
      }
    }
    this.newProdcut.push(this.pointCategories_data);
  }
  
  getInfluencer()
  {
    this.filter.scanning_rights = 'Yes'; 
    this.service.post_rqst({'filter':this.filter},'Bonus/influencerMasterList').subscribe((resp)=>
    {
      this.influencerUser=resp['result'];

      
    })
  }

  selInfluencer(typeid)
  {
    let Index = this.influencerUser.findIndex(row => row.id == typeid)
            if(Index != -1){
                this.formData.influencer_type = this.influencerUser[Index].type;
            }else {
            }
            console.log(this.formData)
            console.log(this.formData.influencer_type)
  }
  
  
  submitDetail() {
    
    
    let productPoint =[]
    for (let i = 0; i < this.pointCategories_data.length; i++) {
      const element = this.pointCategories_data[i];
      productPoint.push({'product_id':element.id, 'product_name':element.point_category_name, 'influencer_point':element.scheme_influencer_point})
    }
    
    
    this.data.types = this.formData.types;
    if(this.formData.types == 'Influencer'){
      this.data.influencer_type = this.formData.influencer_type
    }
    
    
    
    this.data.update_id =  this.formData.id;
    this.data.tittle = this.formData.tittle
    this.data.types = this.formData.types
    this.data.start_date = this.formData.start_date;
    this.data.end_date = this.formData.end_date;
    this.data.created_by_id = this.logined_user_data.id;
    this.data.created_by_name = this.logined_user_data.name;
    
    if(this.formData.start_date){
      this.formData.start_date = moment(this.formData.start_date).format('YYYY-MM-DD');
      this.data.start_date=this.formData.start_date;
    }
    if(this.formData.end_date){
      this.formData.end_date = moment(this.formData.end_date).format('YYYY-MM-DD');
      this.data.end_date=this.formData.end_date;
    }
    this.savingFlag = true;
    
    
    this.service.post_rqst( {'scheme':this.data,  'productPoint':productPoint, 'action':'basic'}, 'Bonus/updateBonus').subscribe((resp)=>
    {
      if(resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
        this.dialogRef.close(true);
      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
    });
  }
}
