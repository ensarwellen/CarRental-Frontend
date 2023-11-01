import { Injectable } from '@angular/core';
import { LoginModel } from '../models/loginModel';
import { HttpClient } from '@angular/common/http';
import { SingleResponseModel } from '../models/singleResponseModel';
import { TokenModel } from '../models/tokenModel';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl='https://localhost:7183/api/auth/';

  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isAdminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient:HttpClient, private jwtHelper: JwtHelperService) {
    this.isAuthenticatedSubject.next(this.isAuthenticated());
  }
  
  // Kullanıcı Rol Kontrolü /////////////////
  updateAdminState(isAdmin: boolean): void {
    this.isAdminSubject.next(isAdmin);
  }
  getIsAdminSubject(): BehaviorSubject<boolean> {
    return this.isAdminSubject;
  }
  public getToken(): string | null {
    return localStorage.getItem('token'); 
  }
  public getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      return this.jwtHelper.decodeToken(token); 
    }
    return null;
  }

  public async getUserRole(): Promise<string | null> {
    let decodedToken = null;
    let retryCount = 0;
    const maxRetries = 10; // deneme sayısı
    const retryInterval = 50; // milisaniye cinsinden deneme sıklığı (1000ms=1saniye)
  
    while (!decodedToken && retryCount < maxRetries) {
      decodedToken = this.getDecodedToken();
      await new Promise(resolve => setTimeout(resolve, retryInterval)); 
      retryCount++;
    }
  
    if (decodedToken) {
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return userRole ? userRole : null; // Token içerisindeki rol bilgisine erişir
    }

    return null;
  }
  //////////////////////////////

  // Giriş Kontrolü ///////////////
  private updateAuthState(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
  login(loginModel: LoginModel): Observable<SingleResponseModel<TokenModel>> {
    return this.httpClient.post<SingleResponseModel<TokenModel>>(this.apiUrl + 'login', loginModel)
      .pipe(
        tap(response => {         
          this.updateAuthState(true);
        })
      );
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  isAuthenticatedObservable(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // isAuthenticated(){
  //   if(localStorage.getItem("token")){
  //     return true;
  //   }else{
  //     return false;
  //   }
  // }

  // Çıkış //////////////////
  logout(): void {
    // Çıkış işlemleri burada gerçekleşir, örneğin localStorage'dan token'ı kaldırabilirsiniz.
    localStorage.removeItem('token');
    this.updateAuthState(false); // Çıkış yapıldığında durumu günceller.
    this.updateAdminState(false);
  }
  // logOut() {
  //   localStorage.removeItem("token");  
  // }
}
