import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController } from 'ionic-angular';
import { LoginDTO } from '../../models/login.dto';
import { AuthService } from '../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  login : LoginDTO = {
    username: "",
    password: ""
  };

  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public auth: AuthService) {
    
  }

  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }
  
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }
  

  loginAction(){
    this.auth.authenticate(this.login)
      .subscribe(response => {
        console.log(response.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage')
      },
      error => {});
  }

}
