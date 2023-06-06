import { Component, Renderer2 } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { AuthGuard } from './auth.guard';
import { sessionStorage } from './localstorage.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
// import
// import { LocalStorage } from './localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'abacusdesk';
  login_data:any={};
  kei_user:any;

  constructor(public serve:DatabaseService,public session:sessionStorage,public router:Router,public renderer:Renderer2,private bnIdle: BnNgIdleService){
    this.session.getSession()
    .subscribe(resp=>{
      this.login_data = resp.data;
    });
  }
  ngOnInit(): void {
    window.onload = (event) => {
      document.getElementById("splashScreen").classList.add("splashScreenFadeHide")
     }
     document.getElementById("splashScreen").addEventListener('transitionend', (e) => {
       document.getElementById("splashScreen").style.display = 'none'
     })
     
    this.bnIdle.startWatching(3600).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        this.session.LogOutSession();
        this.router.navigate(['']);
        this.kei_user = JSON.parse(localStorage.getItem('st_user')) || [];
        this.kei_user = {};
        this.kei_user.st_log = false;
        localStorage.removeItem('st_user');
      }

    });

  };
}
