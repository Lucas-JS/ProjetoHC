import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { FileTransfer} from '@ionic-native/file-transfer';
import { File} from '@ionic-native/file';

import { Component, AfterViewInit, TestabilityRegistry} from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Platform} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { FirebaseProvider } from '../../providers/firebase/firebase';
import { LoginPage } from '../login/login';

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
  urlWeb:string;
  //RA Aluno para busca
  raAluno:string;

  constructor(public menuctrl:MenuController,public navCtrl: NavController,public navParams: NavParams,public docs:DocumentViewer,public filetransfer:FileTransfer, public file:File, public platfotm:Platform, public app:InAppBrowser, public firebaseService:FirebaseProvider) {
    //Captura os dados do login para manipular no FormAluno
    this.aluno = navParams.get('ColAluno');
    //Torna as informações do aluno Global
    this.tempAluno();
  }

  //Verifica o RA do aluno para buscar certificados
  tempAluno(){
    this.aluno.subscribe(e=>{e=(e["0"].ra);this.firebaseService.setRA(e)});
  }

  //Método para enviar o ra
  envRA(){
    return this.raAluno;
  }

  //Abre PDF para dispositivos Móveis
  openMobPDF(tipoArquivo:string):void{
    //Cria variável com caminho de acordo com a plataforma
    let path = null;
    if(this.platfotm.is('ios')){
     path = this.file.documentsDirectory;
    }else{
     path = this.file.dataDirectory;
    }

    //Cria uma constante para receber a criação da instância do arquivo
    const ft = this.filetransfer.create();
    //Verifica qual arquivo a ser chamado
    if(tipoArquivo == 'Regulamento'){
    ft.download('https://firebasestorage.googleapis.com/v0/b/projetohc-9700d.appspot.com/o/Manual%2Fregulamento.pdf?alt=media&token=e2bbcab6-c976-4ac7-9b32-04ffa7667cf5', path + 'myFile.pdf').then(
      res => {
        let url = res.toURL();this.docs.viewDocument(url,'application/pdf',{});
      })
    }else{
      ft.download('https://firebasestorage.googleapis.com/v0/b/projetohc-9700d.appspot.com/o/Manual%2Fmanual.pdf?alt=media&token=c7da9e9e-4184-43ff-a80f-87a49736b9e9', path + 'myFile.pdf').then(
        res => {
          let url = res.toURL();this.docs.viewDocument(url,'application/pdf',{});
      })
    }
  }

  openPDF(tipoArquivo:string):void{
    //Verificar qual arquivo escolhido (Manual/Regulamento)
    if(tipoArquivo == 'Regulamento'){
      this.urlWeb = 'https://firebasestorage.googleapis.com/v0/b/projetohc-9700d.appspot.com/o/Manual%2Fregulamento.pdf?alt=media&token=e2bbcab6-c976-4ac7-9b32-04ffa7667cf5';
    }else{
      this.urlWeb = 'https://firebasestorage.googleapis.com/v0/b/projetohc-9700d.appspot.com/o/Manual%2Fmanual.pdf?alt=media&token=c7da9e9e-4184-43ff-a80f-87a49736b9e9';
    }
    //Abre a guia com o arquivo escolhido
    const browser = this.app.create(this.urlWeb,'_system',"location=yes");
  }

  logoutAluno(){
    this.navCtrl.setRoot(LoginPage);
  }
}


