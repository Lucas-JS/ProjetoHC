import { FirebaseProvider } from './../../providers/firebase/firebase';
import { User } from './../../models/user.model';
import { ProfessorPage } from './../professor/professor';
import { AlunoPage } from './../aluno/aluno';
import { Component, animate } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { SERVER_TRANSITION_PROVIDERS } from '@angular/platform-browser/src/browser/server-transition';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  loginForm:FormGroup;

  user={} as User;
  tipo: string;
  //Cria uma referência da coleção de Aluno
  aluno: Observable<any>;
  professor: Observable<any>;

  //FormBuilder é o responsável pela criação do formulário
  constructor(private firebaseauth: AngularFireAuth, public firebaseService:FirebaseProvider, public toatsCtrl:ToastController, public formBuilder:FormBuilder, public navCtrl: NavController, public navParams: NavParams) {

    this.loginForm = this.formBuilder.group({
       //Objeto que irá configurar os campos do formulário
       email: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
       senha: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
     });
  }

  //Método de autentificação de Login
  async login(user:User){
    try{
      var valid=this.firebaseauth.auth.signInWithEmailAndPassword(user.email,user.senha);
      if(valid){
        //Cria o retorno do form Aluno apenas com um objeto escolhido
        this.aluno = this.firebaseService.getLogin(user.email, this.tipo='aluno');
        this.professor = this.firebaseService.getLogin(user.email, this.tipo='professor');
        if(this.tipo=="aluno"){
          console.log(this.tipo);
          this.navCtrl.push(AlunoPage, {ColAluno:this.aluno});
        }else{
          console.log(this.tipo)
          this.navCtrl.push(ProfessorPage, {ColProfessor:this.professor});
      }}

    }catch(e){
      console.error(e);
    }
  }
}
