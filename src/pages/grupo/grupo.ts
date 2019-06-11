import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { FirebaseApp } from 'angularfire2';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FirebaseProvider } from './../../providers/firebase/firebase';
import { LoginPage } from '../login/login';
import { AlunoPage } from '../aluno/aluno';


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
  //Pega valor da atividade selecionada pelo Select em tempo real
  ativ:string;
  //Pega valor da atividade selecionada pelo Select em tempo real
  categoria:Observable<any>;
  certificado:Observable<any>;
  files: Observable<any>;
  //Observador que recebe todos os dados do aluno
  alunoObs: Observable<any>;
  //condição dos ícones dos certificados
  corIcon:string;
  nomeIcon:string;
  //Objeto que escuta os dados no banco
  aluno:Observable<any>;

  constructor(public firebaseService:FirebaseProvider,public navCtrl: NavController,
    public navParams: NavParams, public docs:DocumentViewer, public file:File, public filetransfer:FileTransfer, public app:InAppBrowser, public platform:Platform, @Inject(FirebaseApp) fb: any, public msgToastController:ToastController) {
    //Captura a opção selecionada e seleciona o grupo e atividades
    this.grupo = this.firebaseService.getGrupo(navParams.get('opcao'));
    this.atividade = this.firebaseService.getAtividade(navParams.get('opcao'));
    //Cria referência no Firebase Storage
    this.referencia = fb.storage().ref();
    //Busca certificados pelo RA do aluno
    this.getCertificado(this.firebaseService.getRA());
  }

  mudaCor(ativ:string){
    this.ativ=ativ;
    this.selected=false;
    return this.cor = "anhembiColor";
  }

  atualizaArquivo(event):void{
    //Atualiza informação de acordo com a opção selecionada em tempo real
    this.arquivo = event.srcElement.files[0];
  }

  enviarArquivo(grupo: string, arquivo: string) {
    //Direciona a referência pela qual o arquivo vai percorrer no Firebase Storage

     try {
      arquivo = this.arquivo.name;

    let caminho = this.referencia.child('certificados');
    //Cria uma variante para o arquivo selecionado
    let tarefa = caminho.child(arquivo).put(this.arquivo);
    tarefa.on('state_changed', (snapshot) => {
      // Acompanha os estados do upload (progresso, pausado,...)
      console.log('snapshot', snapshot);
    }, error => {
      // Tratar possíveis erros
      if(error){
        this.msgToastController.create({ message: 'Erro ao inserir certicado, certifique-se de inserir arquivo!', duration: 5000 }).present();
      }
    }, () => {
      // Função de retorno quando o upload estiver completo
      caminho.child(arquivo).getDownloadURL().then(url => {
        // cria objeto certificado para enviar pra coleção
        let certificadoJson = {
          categoria: this.ativ,
          status: 'pendente',
          horasValidadas: 0,
          ra: this.firebaseService.getRA(), //MacGyver approves
          url: url
        }
        // salva objeto certificado na coleção
        this.firebaseService.saveCert(certificadoJson);
      });
      this.msgToastController.create({ message: 'Certificado enviado com sucesso.', duration: 3000 }).present();
  })} catch (error) {
      console.log('falta arquivo',error);
      this.msgToastController.create({ message: 'Erro ao inserir certificado, certifique-se de inserir arquivo!', duration: 5000 }).present();
    };

 }

  baixarArquivo(nome: string){
   this.docs.viewDocument('https://expoforest.com.br/wp-content/uploads/2017/05/exemplo.pdf','application/pdf',{});
  }

  //verificar ícone do certificado
  verCorIcon(refCor:string){
    //certificado aprovado
    if(refCor=="ios-checkmark-circle"){
      this.corIcon = "anhembiColor";
    }else{
      //certificado pendente
      if(refCor=="information-circle"){
        this.corIcon="pendente";
      }else{
        //certificado reprovado
        this.corIcon="danger";
      }
  }
  //retorna nome do icone
  return this.corIcon;
}


  //Busca certificado no Provider
  getCertificado(ra): void {
    this.certificado = this.firebaseService.getCertificadoAluno(ra);
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

  //Volta para tela do aluno
  backHome(){
    this.aluno = this.firebaseService.getAluno();
    this.aluno.subscribe(a=> this.navCtrl.push(AlunoPage,{ColAluno:this.aluno}));
  }
  //Logout do Professor
  logoutGrupo(){
    this.navCtrl.setRoot(LoginPage);
  }
}
