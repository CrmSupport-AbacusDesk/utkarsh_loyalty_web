import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
// import { PearlService } from 'src/app/pearl.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';



import { PopGiftIssueModalComponent } from '../pop-gift-issue-modal/pop-gift-issue-modal.component';

@Component({
  selector: 'app-pop-gift-detail',
  templateUrl: './pop-gift-detail.component.html'
})
export class PopGiftDetailComponent implements OnInit {
  skelton:any={};
  id:any={};
  popData:any={};
  stockList:any =[];
  loader:any;
  data_not_found=false;
  incoming_data_not_found=false;
  logIN_user: any;
  skLoading:boolean = false;
  
  
  constructor(public dialog: MatDialog, public session: sessionStorage ,public serve: DatabaseService,public route:Router,public routes:ActivatedRoute) {
    this.routes.params.subscribe( params => {
      this.id = params.id;
      this.serve.currentUserID =  params.id
      this.logIN_user = JSON.parse(localStorage.getItem('user'));
    });
    
  }
  
  ngOnInit() 
  {
    this.gift_detail();
  }
  
  
  
  gift_detail()
  {
    this.skLoading = true;
    this.serve.post_rqst({"id":this.id},"PopGift/popDetail").subscribe((result=>{
      this.popData=result['result']['data'];
      this.stockList=result['result']['incoming'];
      this.skLoading = false;
    }))
  }
  
}
