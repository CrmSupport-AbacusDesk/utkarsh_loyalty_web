import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-system-user-list',
  templateUrl: './system-user-list.component.html',
  animations: [slideToTop()]
})
export class SystemUserListComponent implements OnInit {

  system_user_list:any=[];
  value:any=[];
  total_page:any;
  pagenumber:any;
  count:any;
  start=0;
  tmp_UserList:any=[];
  page_limit=10;
  loader:any;

  constructor(public rout:Router,public serve:DatabaseService,public alert:DialogComponent) {
    this.systemUserList();
   }

  ngOnInit() {
  }
  active:any = {};
  toggleterritory(key,action)
  {
    if(action == 'open')
    { this.active[key] = true; }
    if(action == 'close')
    { this.active[key] = false;}
  }


  systemUserList()
  {
    this.loader=1;
    this.serve.post_rqst({"start":this.start,"pagelimit":this.page_limit},"User/system_user_list").subscribe((result)=>{
       this.system_user_list=result['system_user_list'];
       this.tmp_UserList=this.system_user_list;
      this.count=this.system_user_list.length;
      this.total_page = Math.ceil(this.count/this.page_limit);
      this.pagenumber = Math.ceil(this.start/this.page_limit)+1;
      setTimeout (() => {
        this.loader='';
    }, 700);
  });
}
userDetail(id)
{
      let data={'id':id};
      this.serve.post_rqst(data,"User/user_detail").subscribe((result)=>{
      this.rout.navigate(['/system-user-detail/'+id]);
    })
}
refresh()
{
  this.systemUserList();
}
deleteUser(id)
{
  this.alert.delete('User Data !').then((result) => {
    if(result){
    let data={'id':id};
    this.serve.post_rqst(data,"User/delete_user").subscribe((result)=>{
        if(result)
        {
          this.systemUserList();
        }
    })
  }
  });

}
tmp:any=[];
getItemsList()
  {
    this.system_user_list=[];
    for(var i=0;i<this.tmp_UserList.length; i++)
    {
      this.value.search=this.value.search.toLowerCase();
      this.tmp=this.tmp_UserList[i]['name'].toLowerCase();
      if(this.tmp.includes(this.value.search))
      {
        this.system_user_list.push(this.tmp_UserList[i]);
      }     
    }    
  }

  userStatus(index,id)
  {
    console.log(id);
    console.log(index);
    
    console.log(this.system_user_list[index].status);
    if(this.system_user_list[index].status=="true")
    { 
      this.system_user_list[index].status="false";
      console.log(this.system_user_list[index].status);
   }
    else
    { 
      this.system_user_list[index].status="true";
      console.log(this.system_user_list[index].status);
    }
      let value={"status":this.system_user_list[index].status}
      this.serve.post_rqst({'user_id':id,'data':value },"User/update_user")
        .subscribe(resp=>{
        console.log(resp);
        this.systemUserList();
      })
  }

}
