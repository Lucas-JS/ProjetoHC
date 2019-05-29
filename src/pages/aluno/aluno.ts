import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component, AfterViewInit, TestabilityRegistry } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Item } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-aluno',
  templateUrl: 'aluno.html',
})
export class AlunoPage implements AfterViewInit {
  //Objeto que escuta os dados no banco
  aluno: Observable<any>
  //Barra de Progresso
  uploadProgress;


  constructor(public menuctrl: MenuController, public navCtrl: NavController, public navParams: NavParams) {
    //Captura os dados do login para manipular no FormAluno
    this.aluno = navParams.get('ColAluno');

  }

  //raAlunoLogado = this.aluno.get('ra');

  ngAfterViewInit() {
    this.menuctrl.toggle('menuAluno');

  }

}
