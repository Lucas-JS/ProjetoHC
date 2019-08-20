import { FirebaseProvider } from './../../providers/firebase/firebase';
import { User } from './../../models/user.model';
import { Component, animate } from '@angular/core';
import { NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})

export class SplashPage {

  //Splash
  splash = true;
  tabBarElement:any;
  user={} as User;
  tipo: string;
  //Cria uma referência da coleção de Aluno
  aluno: Observable<any>;
  professor: Observable<any>;

  error: boolean = false;

  //FormBuilder é o responsável pela criação do formulário
  constructor(public firebaseService:FirebaseProvider,public toatsCtrl:ToastController, public formBuilder:FormBuilder, public navCtrl: NavController,
   public navParams: NavParams, public msgToastController:ToastController, public menu:MenuController) {

    //Splash
    this.tabBarElement = document.querySelector('.tabbar');
    this.menu.enable(false);

  }

  ionViewDidLoad(){
    setTimeout(()=>{
      this.splash = false;
      this.navCtrl.push(LoginPage);
    },2000);
  }
}
