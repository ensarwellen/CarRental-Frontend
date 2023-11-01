import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navi',
  templateUrl: './navi.component.html',
  styleUrls: ['./navi.component.css']
})
export class NaviComponent implements OnInit {

  login:boolean=false;
  constructor(private authService:AuthService){}

  ngOnInit(): void {
    this.authService.isAuthenticatedObservable().subscribe((isAuthenticated) => {
      this.login = isAuthenticated;
    });
  }

  logout() {
    this.authService.logout(); // AuthService içindeki logout fonksiyonunu çağırarak çıkış yapabilirsiniz.
  }

}
