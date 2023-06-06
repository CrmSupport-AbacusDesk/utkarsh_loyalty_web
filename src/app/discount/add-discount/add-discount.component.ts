import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService'
import { DialogComponent } from 'src/app/dialog.component';
import {  sessionStorage} from 'src/app/localstorage.service';

@Component({
  selector: 'app-add-discount',
  templateUrl: './add-discount.component.html',
  animations: [slideToTop()]
})
export class AddDiscountComponent implements OnInit {

  detail:any={};
  discount_id;
  userData: any;
  userId: any;
  userName: any;

  constructor(
              public rout:Router,
              public serve:DatabaseService,
              public session: sessionStorage,
              public route:ActivatedRoute,
              public dialog:DialogComponent) 
  {
    
    this.route.params.subscribe( params => 
    {
      this.discount_id = params.id;
      console.log(this.discount_id);
      
      });

      if(this.discount_id != 0)
      {
        this.getDiscountData(this.discount_id)
      }
      this.userData = JSON.parse(localStorage.getItem('st_user'));
      this.userId=this.userData['data']['id'];
      this.userName=this.userData['data']['name'];
      // this.discountDetail(this.discount_id);
    // this.addDiscount();
   }

  ngOnInit() 
  {
    // this.detail=this.serve.get_data()
    // console.log(this.detail);  

  }

  MobileNumber(event: any) 
  {
    console.log(event);
    
    const pattern = /[0-9\+\-\.\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) 
    {event.preventDefault(); }
   }
total:any=0;
   getDiscountData(id)
   {
      this.serve.post_rqst({'id':id},"Discount/discount_detail").subscribe((result=>
      {
          console.log(result);
          this.detail=result['discount_detail'];
          console.log(this.detail);
      
          
      }))
   }
   total_discount()
   {
    this.detail.discount=(parseFloat(this.detail.basic_discount)+parseFloat(this.detail.sr_discount)+parseFloat(this.detail.dd_discount)+parseFloat(this.detail.family_discount)+
    parseFloat(this.detail.ss_discount)+parseFloat(this.detail.cd_discount)).toFixed(2);
    console.log(this.detail.discount);
       
   }
    submitDiscount()
    {
      this.serve.post_rqst(this.detail,"Discount/add_update_discount").subscribe((result=>
      {
            console.log(result)
            if(result)
            {
              this.dialog.success("Discount","Success");
              this.rout.navigate(['/discount-list'])
            }
      }))
    }



  // discountDetail(id)
  // {
  //   console.log(id);
  //   let value={"id":id}
  //   this.serve.post_rqst(value,"Discount/discount_detail").subscribe((result=>{
  //     console.log(result);
  //     this.detail=result['discount_detail'];
  //     // this.serve.setdiscountdata(result);
  //     // this.rout.navigate(['/add-discount/'+id]);
      
  //   }))
    
  // }

  addDiscount()
  {
    // let value={"detail":this.detail,"id":this.detail['id']}
    this.serve.post_rqst({"detail":this.detail,"id":this.detail['id'],'uid':this.userId,'uname':this.userName},"Discount/update_discount_detail").subscribe((result=>{
      console.log(result)
      if(result){
        this.rout.navigate(['/discount-list'])
      }
      
    }))
    
  }

}
