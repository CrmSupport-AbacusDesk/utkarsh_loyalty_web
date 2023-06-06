import { Component, OnInit, Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })



export class DialogComponent implements OnInit {
  deletebanner(arg0: string) {
    throw new Error("Method not implemented.");
  }
  
  constructor() { }
  
  ngOnInit() {
  } 
  
  deletebanners(msg:any){
    return Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this ',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        return true;
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your '+ msg +' data is safe :)',
          'error'
          )
          return false;
          
        }
      })
    }


  delete(msg:any){
    return Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this '+msg,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        return true;
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your '+ msg +' data is safe',
          'error'
          )
          return false;
          
        }
      })
    }

    
    confirm(msg:any){
      return Swal.fire({
        title: 'Are you sure?',
        text: msg,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, do it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
        if (result.value) {
          return true;
          // For more information about handling dismissals please visit
          // https://sweetalert2.github.io/#handling-dismissals
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            '',
            'error'
            )
            return false;
            
          }
        })
      }

      reset_att(){
        return Swal.fire({
          title: 'Confirm',
          text: 'Are you sure to reset stop attendance data?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, do it!',
          cancelButtonText: 'No, keep it'
        }).then((result) => {
          if (result.value) {
            return true;
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelled',
              '',
              'error'
              )
              return false;
              
            }
          })
        }
    
    success(title:any,msg:any){
      Swal.fire({
        position: 'top-right',
        type: 'success',
        title: title+ "  "+msg,
        showConfirmButton: false,
        timer: 1500
      })
      }

      success_att(title:any,msg:any){
        Swal.fire({
          position: 'center',
          type: 'success',
          title: title+ "  "+msg,
          showConfirmButton: false,
          timer: 1500
        })
        }
      
      error(msg:any){
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: msg,
          // footer: '<a href>Why do I have this issue?</a>'
        })
      }
      
      update(msg:any)
      {
        // Swal.fire({
        //   title: 'Are you sure?',
        //   text: "You won't be able to revert this!",
        //   type: 'question',
        //   showCancelButton: true,
        //   confirmButtonColor: '#3085d6',
        //   cancelButtonColor: '#d33',
        //   confirmButtonText: 'Yes, update it!'
        // }).then((result) => {
        //   if (result.value) {
        //     Swal.fire(
        //       'Updated!',
        //       'Your file has been Updated.',
        //       'success'
        //     )
        //   }
        // })
        return Swal.fire({
          title: 'Are you sure?',
          text: 'You will not be able to recover this '+msg,
          type: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, Update it!',
          cancelButtonText: 'No, keep it'
        }).then((result) => {
          if (result.value) {
            return true;
            
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelled',
              'Your '+ msg +' data is safe :)',
              'error'
              )
              return false;
              
            }
          })
      }
      
    }