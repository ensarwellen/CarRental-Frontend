import { Injectable } from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from "../services/auth.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn:'root'
})

export class IsAddableGuard implements CanActivate {

  constructor(private authService:AuthService,private toastrService:ToastrService, private router:Router){}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const userRole = await this.authService.getUserRole();
    if (userRole === "admin") {
      return true;
    } else {
      console.log(userRole);
      this.router.navigate(["/login"]);
      this.toastrService.info("Yetkiniz Yok");
      return false;
    }
  }
}