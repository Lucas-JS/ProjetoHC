import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { File } from '@ionic-native/file';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';

import { FirebaseApp } from 'angularfire2';


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

  files: Observable<any>;

  //Mostrar O Avanço da Barra de Progresso
  uploadProgress:Number=70;

  constructor(public firebaseService:FirebaseProvider,public navCtrl: NavController,
    public navParams: NavParams, private document:DocumentViewer, private file:File,
    private platform:Platform, @Inject(FirebaseApp) fb: any, public msgToastController:ToastController) {

    //Captura a opção selecionada e seleciona o grupo e atividades
    this.grupo = this.firebaseService.getGrupo(navParams.get('opcao'));
    this.atividade = this.firebaseService.getAtividade(navParams.get('opcao'));
    //Cria referência no Firebase Storage
    this.referencia = fb.storage().ref();

    this.getCertificado(20881190);
  }

  mudaCor(){
    this.selected=false;
    return this.cor = "anhembiColor";
  }

  atualizaArquivo(event):void{
    //Atualiza informação de acordo com a opção selecionada em tempo real
    this.arquivo = event.srcElement.files[0];
  }

  enviarArquivo(dir: string, arquivo: string) {
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
        //console.log('string para download', url);
        let raAluno: number = 20881195; //MacGyver approves
        let statusIni: string = "pendente";
        let horasIni: number = 0;
        // cria objeto certificado para enviar pra coleção
        let certificado = {
          categoria: dir,
          status: statusIni,
          horas: horasIni,
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
 //  nome = 'testeatividades.pdf';
  // let caminho = this.referencia.child('Atividades Fora da Universidade/'+nome);
  // caminho.getDownloadURL().then(url => {
   //});

   this.document.viewDocument('https://expoforest.com.br/wp-content/uploads/2017/05/exemplo.pdf','application/pdf',{});
  }

  getCertificado(ra): void {
    this.certificado = this.firebaseService.getCertificadoAluno(ra);
    this.certificado.subscribe(arg => console.log(arg));
  }

  openPDF(){

  }
}
