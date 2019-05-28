import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';

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

  files: Observable<any>;

  //Mostrar O Avanço da Barra de Progresso
  uploadProgress:Number=70;

  constructor(public firebaseService:FirebaseProvider,public navCtrl: NavController,
    public navParams: NavParams,private document:DocumentViewer, private file:File,
    private transfer:FileTransfer,private platform:Platform, @Inject(FirebaseApp) fb: any, public msgToastController:ToastController) {
    //Captura a opção selecionada e seleciona o grupo e atividades
    this.grupo = this.firebaseService.getGrupo(navParams.get('opcao'));
    this.atividade = this.firebaseService.getAtividade(navParams.get('opcao'));
    //Cria referência no Firebase Storage
    this.referencia = fb.storage().ref();
  }

  mudaCor(){
    this.selected=false;
    return this.cor = "anhembiColor";
  }

  atualizaArquivo(event){
    //Atualiza informação de acordo com a opção selecionada em tempo real
    this.arquivo = event.srcElement.files[0];
  }

  enviarArquivo(dir:string, arquivo){
    //Direciona a referência pela qual o arquivo vai percorrer no Firebase Storage
    let caminho = this.referencia.child(dir+'/'+this.arquivo.name);
    //Cria uma variante para o arquivo selecionado
    let tarefa = caminho.put(this.arquivo);
    tarefa.on('state_changed', (snapshot)=>{
       // Acompanha os estados do upload (progresso, pausado,...)
    }, error => {
       // Tratar possíveis erros
    }, () => {
       // Função de retorno quando o upload estiver completo
    });

    const toast = this.msgToastController.create({
      message: 'Certificado foi enviado com sucesso!!!',
      position: 'end',
      duration: 5000
    })
    toast.present();
 }

  baixarArquivo(nome: string){
    nome = 'atividades.pdf';
   let caminho = this.referencia.child('dir/'+nome);
   caminho.getDownloadURL().then(url => {
      console.log(url); // AQUI VOCÊ JÁ TEM O ARQUIVO
   });
  }


}
