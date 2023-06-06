import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ImageModuleComponent } from '../image-module/image-module.component';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-checkindocument',
  templateUrl: './checkindocument.component.html'
})
export class CheckindocumentComponent implements OnInit {

  url:any;
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public serve:DatabaseService,public session: sessionStorage) {  console.log(this.data);
    this.url  = serve.uploadUrl + 'checkin/'
  }
  

  ngOnInit() {
   
  }
  imageModel(image){
    console.log(image);
    

    const dialogRef = this.dialog.open( ImageModuleComponent, {
      panelClass:'Image-modal',
      data:{
        image,
        
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('The dialog was closed');  
    });
  }
}