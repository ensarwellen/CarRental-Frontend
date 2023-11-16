import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css']
})
export class NaviComponent implements OnInit {

  login:boolean=false;
  constructor(private authService:AuthService, private toastrService:ToastrService){}

  ngOnInit(): void {
    this.isUserAuthenticated();
  }
  isUserAuthenticated(){
    this.authService.isAuthenticatedObservable().subscribe(response=>{     
      this.login = response;
    })
  }

  logout() {
    this.authService.logout();
    this.toastrService.success("Çıkış yapıldı","Başarılı") 
  }

}
