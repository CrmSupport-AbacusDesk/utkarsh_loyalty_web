import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DatabaseService } from 'src/_services/DatabaseService'
import { ElementSchemaRegistry } from '@angular/compiler';
import { sessionStorage } from './localstorage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  pearluser:any=[];
  constructor(public session:sessionStorage,public rout:Router,public db:DatabaseService)
  {

  }
  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      
    this.session.getSession()
      .subscribe((response)=>{
        console.log(response);
        console.log("auth g");
        
        this.pearluser=response;
        console.log(this.pearluser);
      },error=>{
        console.log("error");        
      });


      if(this.pearluser.st_log)
      {
        if(state.url!='/')
        {

        }
         else if(this.pearluser.data.id !=1)
        {
          this.rout.navigate(['/dashboard']);

        }
        else{
          this.rout.navigate(['/dashboard']);
        }
        this.db.can_active='1';
        return false;
      }
      else
      {

        console.log('hello');
        this.db.can_active='';
        return true;
      }
  }
}
