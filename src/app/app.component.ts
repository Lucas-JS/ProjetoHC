import { Component, ViewChild} from '@angular/core';
import { Nav, Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlunoPage } from './../pages/aluno/aluno';
import { LoginPage } from './../pages/login/login';
import { GrupoPage } from '../pages/grupo/grupo';


@Component({
  templateUrl: 'app.html'
})
export class MyApp{
  //Recuperar o componente
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    this.alunoMenu();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Muda Tela
    this.nav.push(page.component,{opcao:page.title});
  }

  alunoMenu(){
     //Array de Menu Aluno
     this.pages = [
      { title: 'Minha Área', component: AlunoPage },
      //Grupos de Atividades que o aluno cadastra seus comprovantes
      { title: 'Atividades Fora da Universidade', component: GrupoPage },
      { title: 'Atividades de Extensão', component: GrupoPage },
      { title: 'Atividades de Iniciação Científica', component: GrupoPage },
      { title: 'Atividades de Monitoria', component: GrupoPage },
      { title: 'Atividades Especiais', component: GrupoPage },
      //Logout para voltar a tela de Login
      { title: 'Sair', component: LoginPage}
    ];
  }
  //Logout da página
  logout(){
  this.nav.setRoot('LoginPage');
  }
}
