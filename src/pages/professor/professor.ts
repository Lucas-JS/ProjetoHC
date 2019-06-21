import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,/*, MenuController */
ToastController,Platform} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { LoginPage } from '../login/login';
import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { FileTransfer } from '@ionic-native/file-transfer';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

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
  curso: any;
  certificado: any;
  html: any;
  certVal: any;
  horas: number;
  selecAluno: Observable<any>;
  msgObs: string;

  cor:string;
  corFixa:string = "anhembiColor";
  selectCor:boolean;
  teste: Observable<any>;



  constructor(
    //public menuctrl: MenuController,
    public firebaseService: FirebaseProvider, public navCtrl: NavController,public navParams: NavParams,private toast: ToastController, public platform:Platform, public file:File,public filetransfer:FileTransfer,public docs:DocumentViewer,public app:InAppBrowser
  ) {
    //Captura os dados do login para manipular no FormProfessor
    this.professor = navParams.get('ColProfessor');
  }

  //Muda cor para cor padrão
  mudaCor(){
    this.selectCor=false;
    return this.cor = "anhembiColor";
  }

  //Busca curso no banco
  buscaAlunoCurso(){
    this.aluno = this.firebaseService.getAlunoCurso(this.curso);
    this.certVal = "";
    this.certificado = "";
  }

  //Verifica opção do curso
  optCurso(optCurso:string):void{
   this.curso = optCurso;
  }

  // busca somente o certificado expecífico
  buscaCertificadoExp(key: string){
    this.msgObs = "";
    this.horas = null;
    this.certVal = this.firebaseService.getCertificadoKey(key);
  }

  getCertificado(ra:string): void {
    //Atualiza certificados do aluno
    this.certificado = this.firebaseService.getCertificadoAluno(ra);
    //Atualiza os dados do aluno local
    this.selecAluno = this.firebaseService.getAlunoRA(ra);
    this.certVal = "";
  }

  //Abrir arquivos PDF Mobile
  openMobPDF(certUrl:string):void{
    //Cria variável com caminho de acordo com a plataforma
    let path = null;
    if(this.platform.is('ios')){
     path = this.file.documentsDirectory;
    }else{
     path = this.file.dataDirectory;
    }

    //Cria uma constante para receber a criação da instância do arquivo
    const ft = this.filetransfer.create();

    //Abre o arquivo
    ft.download(certUrl, path + 'myFile.pdf').then(
      res => {
        let url = res.toURL();this.docs.viewDocument(url,'application/pdf',{});
      })
  }

  //Abir arquivos PDF Web
  openPDF(certUrl:string):void{
    //Abre a guia com o arquivo escolhido
    const browser = this.app.create(certUrl,'_system',"location=yes");
  }


 // valida certificado atribuindo horas, FALTA ATRIBUIR A DATA DE AVALIACAO
 validaCert(key:string) {
  this.firebaseService.validaCert(this.horas, key, this.msgObs)
  .then(() => {
    this.toast.create({ message: 'Certificado avaliado com sucesso.', duration: 3000 }).present();
  })
  .catch((e) => {
    this.toast.create({ message: 'Erro ao validar certificado. É necessário inserir a quantidades de horas e observação!', duration: 3000 }).present();
    console.error(e);
  });
}

  // altera status do certificado p recusado, FALTA ATRIBUIR A DATA DE AVALIACAO
  // altera status do certificado p recusado
  recusaCert(key: string) {
    this.firebaseService.recusaCert(key, this.msgObs)
      .then(() => {
        this.toast.create({ message: 'Certificado avaliado com sucesso.', duration: 3000 }).present();
      })
      .catch((e) => {
        this.toast.create({ message: 'Erro ao validar certificado.', duration: 3000 }).present();
        console.error(e);
      });
    }

  logoutProf(): void {
    this.navCtrl.push(LoginPage);
  }
}
