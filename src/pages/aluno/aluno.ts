import { DocumentViewer } from '@ionic-native/document-viewer';
import { Component, AfterViewInit, TestabilityRegistry} from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-aluno',
  templateUrl: 'aluno.html',
})
export class AlunoPage{
  //Objeto que escuta os dados no banco
  aluno:Observable<any>;
  //Barra de Progresso
  uploadProgress;

  constructor(public menuctrl:MenuController,public navCtrl: NavController, public navParams: NavParams, public docs:DocumentViewer) {
    //Captura os dados do login para manipular no FormAluno
    this.aluno = navParams.get('ColAluno');
  }
}
