import { Component, OnInit, Renderer2 } from '@angular/core';
import { sessionStorage } from '../localstorage.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { BottomSheetComponent } from '../bottom-sheet/bottom-sheet.component';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  searchData: any = {};
  login_data: any = {};
  dataList: any = [];
  constructor(private renderer: Renderer2, public session: sessionStorage, public toastCtrl: ToastrManager, public serve: DatabaseService, public router: Router, public dialog: DialogComponent) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
  }

  ngOnInit() {
  }

  colorMode: boolean = false;
  nightMode() {
    this.colorMode = !this.colorMode;
    if (this.colorMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    }
    else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }

  toggle: boolean = false;
  toggleNav() {
    this.toggle = !this.toggle;
    if (this.toggle) {
      this.renderer.addClass(document.body, 'active');
    }
    else {
      this.renderer.removeClass(document.body, 'active');
    }
  }

  filter_dr(search) {
    console.log(search);
    if (search.length > 3) {
      this.serve.post_rqst({ 'search': search }, "Master/masterSearch").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.dataList = result['result'];
        }
        else {
          this.toastCtrl.errorToastr(result['statusMsg']);
        }
      }))

    }
  }


      logout() {
        this.dialog.confirm("Logout").then((result) => {
          if (result) {
            this.session.LogOutSession();
            this.router.navigate(['']);
          }
        });

      }
    }
