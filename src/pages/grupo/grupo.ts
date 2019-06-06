import { LoginPage } from './../login/login';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';

import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FirebaseProvider } from './../../providers/firebase/firebase';



@IonicPage()
@Component({
  selector: 'page-grupo',
  templateUrl: 'grupo.html',
})
export class GrupoPage {
  grupo: Observable<any>;
  atividade: Observable<any>;
  public cor:string;
  selected: boolean = true;

  referencia;
  arquivo;

  certificado: any;
  //Pega o RA pelo App Component
  raAluno:string;
  files: Observable<any>;

  constructor(public firebaseService:FirebaseProvider,public navCtrl: NavController,
    public navParams: NavParams, public docs:DocumentViewer, public file:File, public filetransfer:FileTransfer, public app:InAppBrowser, public platform:Platform, @Inject(FirebaseApp) fb: any, public msgToastController:ToastController,
    loginPage: LoginPage) {

    //Captura a opção selecionada e seleciona o grupo e atividades
    this.grupo = this.firebaseService.getGrupo(navParams.get('opcao'));
    this.atividade = this.firebaseService.getAtividade(navParams.get('opcao'));
    //Cria referência no Firebase Storage
    this.referencia = fb.storage().ref();
    //Captura os dados do login para manipular no FormAluno
    this.raAluno = loginPage.getRa();
    this.getCertificado(20881190);
    console.log('teste grupo'+this.raAluno);
  }

  mudaCor(){
    this.selected=false;
    return this.cor = "anhembiColor";
  }

  atualizaArquivo(event):void{
    //Atualiza informação de acordo com a opção selecionada em tempo real
    this.arquivo = event.srcElement.files[0];
  }

  enviarArquivo(atividade: string, arquivo: string) {
    //Verifica qual tipo de categoria pertence a atividade
    this.verCategoria(atividade);
    //Direciona a referência pela qual o arquivo vai percorrer no Firebase Storage
    arquivo = this.arquivo.name;
    let caminho = this.referencia.child('certificados');
    //Cria uma variante para o arquivo selecionado
    let tarefa = caminho.child(arquivo).put(this.arquivo);
    tarefa.on('state_changed', (snapshot) => {
      // Acompanha os estados do upload (progresso, pausado,...)
      console.log('snapshot', snapshot);
    }, error => {
      // Tratar possíveis erros
    }, () => {
      // Função de retorno quando o upload estiver completo
      caminho.child(arquivo).getDownloadURL().then(url => {
        let raAluno: number = 20881190; //MacGyver approves
        // cria objeto certificado para enviar pra coleção
        let certificado = {
          categoria: 'AtivMonit_Idiomas',
          atividade: atividade,
          status: 'Pendente',
          horasValidadas: 0,
          ra: raAluno,
          url: url
        }
        // salva objeto certificado na coleção
        this.firebaseService.saveCert(certificado);

      });

    });

    const toast = this.msgToastController.create({
      message: 'Certificado foi enviado com sucesso!!!',
      position: 'end',
      duration: 5000
    })
    toast.present();
 }

  baixarArquivo(nome: string){
   this.docs.viewDocument('https://expoforest.com.br/wp-content/uploads/2017/05/exemplo.pdf','application/pdf',{});
  }

  //Verificar qual categoria pertence a atividade
  verCategoria(ativ:string){

  }

  getCertificado(ra): void {
    this.certificado = this.firebaseService.getCertificadoAluno(ra);
    this.certificado.subscribe(arg => console.log(arg));
  }

  //Abrir arquivos PDF Mobile
  openMobPDF(certUrl:string):void{
    //Cria variável com caminho de acordo com a plataforma
    let path = null;
    if(this.platform.is('ios')){
     path = this.file.documentsDirectory;
    }else{
     path = this.file.dataDirectory;
     console.log(path);
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
}
