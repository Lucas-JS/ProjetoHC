import { FirebaseProvider } from './../../providers/firebase/firebase';
import {  AfterViewInit ,Component} from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-professor',
  templateUrl: 'professor.html',
})
export class ProfessorPage{
  professor: Observable<any>;
  aluno: Observable<any>;
  //firebaseService: any;

  constructor(public menuctrl:MenuController, public firebaseService:FirebaseProvider,public navCtrl: NavController, public navParams: NavParams) {
    //Captura os dados do login para manipular no FormProfessor
    this.professor = navParams.get('ColProfessor');
    //this.aluno = navParams.get('ColAluno');
  }



}
