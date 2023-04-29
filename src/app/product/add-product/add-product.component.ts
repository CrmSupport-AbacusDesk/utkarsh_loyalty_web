import { Component, OnInit, Renderer2 } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../../dialog.component';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common'
import { ToastrManager } from 'ng6-toastr-notifications';



@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  animations: [slideToTop()]
})
export class AddProductComponent implements OnInit {
  savingFlag:boolean = false;
  segmentList: any = [];
  SubcategoryList:any =[];
  category_list: any = [];
  brandList:any =[];
  colorList:any =[]; 
  data: any = {};
  feature: any = {};
  value: any = [];
  formData = new FormData();
  loader: boolean = false;
  errorMsg:boolean = false;
  showMRP = false;
  showSize = false;
  userData: any;
  userId: any;
  userName:any;
  image = new FormData();
  product_id:any;
  image_id:any;
  url:any;
  selected_image :any = [];
  state:any =[];
  pointCategories_data:any = [];
  
  
  
  constructor(
    private renderer: Renderer2,
    public location: Location,
    public service: DatabaseService,
    public rout: Router,
    public toast:ToastrManager,
    private route: ActivatedRoute,
    public dialog: DialogComponent,
    public dialog2: MatDialog) {
      this.url = this.service.uploadUrl+ 'product_image/';
      this.getSegment();
      this.getBrand();
      this.getColor();
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      this.userId = this.userData['data']['id'];
      this.userName = this.userData['data']['name'];
    }
    
    ngOnInit() {
      this.route.params.subscribe(params => {
        this.product_id = params['id'];
        this.image_id = params['id'];
        
        if (this.product_id)
        {
          this.loader = true;
          this.getProductDetail();
        }
      });
    }
    
    
    
    
    
    
    getSegment() {
      this.service.post_rqst({}, "Master/getProductCategoryList").subscribe((result => {
        if(result['category_list']['statusCode'] ==  200){
          this.segmentList = result['category_list']['segment_list'];
        }
      }))
    }
    
    
    getSubCatgory(id) {
      this.service.post_rqst({'id':id}, "Master/subCategoryList").subscribe((result => {
        if(result['statusCode'] ==  200){
          this.SubcategoryList = result['result'];
        }
      }))
    }
    
    getBrand() { 
      this.service.post_rqst({}, "Master/brandList").subscribe((result => {
        if(result['statusCode'] ==  200){
          this.brandList = result['result'];
        }
        else{
          this.toast.errorToastr(result['statusMsg'])
        }
      }));
    }
    getColor(){
      this.service.post_rqst({}, "Master/colorList").subscribe((result => {
        if(result['statusCode'] ==  200){
          this.colorList = result['result'];
          console.log(this.colorList);
        }
        else{
          this.toast.errorToastr(result['statusMsg'])
        }
      }));
    }
    
    
    
    getProductDetail()
    {
      this.getSegment();
      this.service.post_rqst({'product_id':this.product_id},"Master/productDetail").subscribe((result=>
        {
          this.data = result.product_detail;
          this.data.segment_id =  this.data.category_id.toString();
          this.data.sub_segment_id =  this.data.sub_category_id.toString();
          
          if(this.data.category_id){
            this.getSubCatgory(this.data.segment_id)
          }
          
          if(this.data.gst == 0){
            this.data.gst = '';
          }
          
          this.selected_image =  result.product_detail.product_image_data;
          this.loader = false;
        }
        ));
      }
      findId(id){
        let index=  this.pointCategories_data.findIndex(row=>row.id==id)
        if(index!= -1){
          this.data.point_category_id= this.pointCategories_data[index].id;
          this.data.point_category_name= this.pointCategories_data[index].point_category_name;
        }
        
      }
      filter:any ={};
      pointCategory_data(searcValue)
      {
        this.filter.point_type = 'Item Box';
        this.filter.point_category_name = searcValue;
        this.service.post_rqst({'filter':this.filter,},'Master/pointCategoryMasterList').subscribe((resp)=>
        {   
          if(resp['statusCode']== 200){
            this.pointCategories_data=resp['point_category_list'];
          }
          else{
            this.toast.errorToastr(resp['statusMsg'])
          }
        }, error => {
        })
      }
      
      
      
      showMRPFunction() {
        this.showMRP = true;
        this.showSize = false;
      }
      
      showSizeFunction() {
        this.showMRP = false;
        this.showSize = true;
      }
      
      deleteProductImage(arrayIndex,id, name) {
        
        if(this.product_id){
          this.service.post_rqst({'image_id':id, 'image':name}, "Master/productImageDeleted").subscribe((result => {
            if(result['status_code'] == '200'){
              if(result['msg'] == "Product Image Deleted Successfully"){
                this.toast.successToastr(result['msg']);
                this.selected_image.splice(arrayIndex, 1);
              }
              else{
                this.toast.errorToastr(result['msg']);
              }
            }
          }
          ))
        }
        else{
          this.selected_image.splice(arrayIndex, 1);
        }
        
        
      }
      
      // add image 
      onUploadChange(data: any)
      {
        this.errorMsg = false;
        this.image_id ='';
        for(let i=0;i<data.target.files.length;i++)
        {
          let files = data.target.files[i];
          if (files) 
          {
            let reader = new FileReader();
            reader.onload = (e: any) => {
              this.selected_image.push({"image":e.target.result});
            }
            reader.readAsDataURL(files);
          }
          this.image.append(""+i,data.target.files[i],data.target.files[i].name);
        }
      }
      
      
      submit() {
        this.data.image = this.selected_image ? this.selected_image : [];
        this.savingFlag = true;
        let header
        if(this.product_id){
          this.data.last_updated_by_name = this.userName;
          this.data.last_updated_by = this.userId;
          header =  this.service.post_rqst({'data':this.data}, "Master/updateProduct")
        }
        else{
          this.data.created_by_name = this.userName;
          this.data.created_by = this.userId;
          header =  this.service.post_rqst({'data':this.data}, "Master/addProduct")
        }
        
        header.subscribe((result => {
          if(result['statusCode'] == 200){
            this.rout.navigate(['/product-list']);
            this.toast.successToastr(result['statusMsg']);
          }
          else{
            this.toast.errorToastr(result['statusMsg']);
            this.savingFlag = false;
          }
        }))
        
        
        
        
      }
      
      
      back(): void {
        this.location.back()
      }
    }
    