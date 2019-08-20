import { snapshotChanges } from 'angularfire2/database';
import { Component, ViewChild} from '@angular/core';
import { Nav, Platform, NavController, ShowWhen } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from './../pages/login/login';
import { GrupoPage } from '../pages/grupo/grupo';

@Component({
  templateUrl: 'app.html'
})
export class MyApp{
  //Recuperar o componente
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;

  opcao: boolean;
  //Variável para pegar o ra Temporario
  raTemp:any;
  //Cria coleção de páginas do Menu com os parâmetros necessários
  pages: Array<{title: string, component: any, raAluno:number}>;

  constructor(public plataforma: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
  }

  initializeApp() {
    this.plataforma.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.alunoMenu();
  }

  openPage(page) {
    // Muda Tela
    this.nav.push(page.component,{opcao:page.title, raAluno:page.raAluno});
  }

  alunoMenu(){
     //Array de Menu Aluno
     this.pages = [
      //Grupos de Atividades que o aluno cadastra seus comprovantes
      { title: 'Atividades Fora da Universidade', component: GrupoPage, raAluno:this.raTemp},
      { title: 'Atividades de Extensão', component: GrupoPage, raAluno:this.raTemp},
      { title: 'Atividades de Iniciação Científica', component: GrupoPage, raAluno:this.raTemp},
      { title: 'Atividades de Monitoria', component: GrupoPage, raAluno:this.raTemp},
      { title: 'Atividades Especiais', component: GrupoPage, raAluno:this.raTemp},
    ];
  }
  //Logout da página
  logout(){
  this.nav.setRoot('LoginPage');
  }
}
