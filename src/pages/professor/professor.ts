import { FirebaseProvider } from './../../providers/firebase/firebase';
import { AfterViewInit, Component } from '@angular/core';
import { IonicPage, NavController, NavParams/*, MenuController */} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-professor',
  templateUrl: 'professor.html',
  providers: [
    FirebaseProvider
  ]
})
export class ProfessorPage {
  professor: Observable<any>;
  aluno: Observable<any>;
  selectCurso: any;



  constructor(
    //public menuctrl: MenuController,
    public firebaseService: FirebaseProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    //Captura os dados do login para manipular no FormProfessor
    this.professor = navParams.get('ColProfessor');

    //this.aluno = this.firebaseService.getAll();

  }

  buscaAlunoCurso(curso: string): void {
    curso = this.selectCurso;
    this.aluno = this.firebaseService.getAlunoCurso(curso);

  }

  logoutProf(): void{
    this.navCtrl.push(LoginPage);
  }



}
