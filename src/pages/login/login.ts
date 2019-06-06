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
import { empty } from 'rxjs/Observer';
import { MyApp } from '../../app/app.component';


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

  error: boolean = false;
  raAluno:string;
  //FormBuilder é o responsável pela criação do formulário
  constructor(private firebaseauth: AngularFireAuth, public firebaseService:FirebaseProvider,
  public toatsCtrl:ToastController, public formBuilder:FormBuilder, public navCtrl: NavController,
   public navParams: NavParams, public msgToastController:ToastController) {

  this.loginForm = this.formBuilder.group({
       //Objeto que irá configurar os campos do formulário
       email: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
       senha: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
     });
  }

  //Método de autentificação de Login
  async login(user:User){

    try{
        //Verifica o tipo de usuário ( Aluno ou Professor)
        this.aluno = this.firebaseService.getLogin(user.email, this.tipo='aluno');
        this.aluno.subscribe(a => {
          if(a!=""){
            //Verificar se o usuário está cadastrado na Autentificação
            var valid=this.firebaseauth.auth.signInWithEmailAndPassword(user.email,user.senha).then(() => {
                this.navCtrl.push(AlunoPage, {ColAluno:this.aluno});
                //Retorna Condição verdadeira
                this.msgErro(this.error=false);
              })
              .catch((erro: any) => {
                this.msgErro(this.error=true);
              });

          }else{
            this.professor = this.firebaseService.getLogin(user.email, this.tipo='professor');
            this.professor.subscribe(p => {
              if(p!=""){
             //Verificar se o usuário está cadastrado na Autentificação
             var valid=this.firebaseauth.auth.signInWithEmailAndPassword(user.email,user.senha).then(() => {
              this.navCtrl.push(ProfessorPage, {ColProfessor:this.professor});
              //Retorna Condição verdadeira
              this.msgErro(this.error=false);
              })
            .catch((erro: any) => {
              this.msgErro(this.error=true);
              });
            }else{
              //Caso nenhuma das duas opções seja preenchida
              this.msgErro(this.error=true);
            }
            });
          }
        });
    }catch(e){
      console.log(e);
  }}

  msgErro(errorReceb){
    if(errorReceb!=false){
    //Mensagem de erro
    const toast = this.msgToastController.create({
      message: 'Usuário ou Senha Incorreto!!!',
      position: 'top',
      duration: 5000
    })
    toast.present();
    this.error=false;
   }
  }
   setRa(user:User ){
    this.raAluno = user.email.substr(0,8);
    console.log('ra LoginPage: '+this.raAluno);

  }
  getRa(){
    return this.raAluno;
  }
}



