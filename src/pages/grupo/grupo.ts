import { AlunoPage } from './../aluno/aluno';
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
  public cor: string;
  selected: boolean = true;

  referencia;
  arquivo;

  files: Observable<any>;


  //Mostrar O Avanço da Barra de Progresso
  uploadProgress: Number = 70;

  constructor(public firebaseService: FirebaseProvider, public navCtrl: NavController,
    public navParams: NavParams, private document: DocumentViewer, private file: File,
    private transfer: FileTransfer, private platform: Platform, @Inject(FirebaseApp) fb: any, public msgToastController: ToastController) {
    //Captura a opção selecionada e seleciona o grupo e atividades
    this.grupo = this.firebaseService.getGrupo(navParams.get('opcao'));
    this.atividade = this.firebaseService.getAtividade(navParams.get('opcao'));
    //Cria referência no Firebase Storage
    this.referencia = fb.storage().ref();
    // pegar dados do aluno


  }


  exibeRa(raAluno) {

    console.log(raAluno);
  }
  mudaCor() {
    this.selected = false;
    return this.cor = "anhembiColor";
  }

  atualizaArquivo(event) {
    //Atualiza informação de acordo com a opção selecionada em tempo real
    this.arquivo = event.srcElement.files[0];
  }

  enviarArquivo(dir: string, arquivo: string) {
    //Direciona a referência pela qual o arquivo vai percorrer no Firebase Storage
    arquivo = this.arquivo.name;
    let caminho = this.referencia.child(/*dir*/'certificados'/*+'/'+this.arquivo.name*/);
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
        // cria objeto certificado para enviar pra coleção
        let certificado = {
          categoria: dir,
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

  baixarArquivo(nome: string) {
    nome = 'atividades.pdf';
    let caminho = this.referencia.child('dir/' + nome);
    caminho.getDownloadURL().then(url => {
      console.log(url); // AQUI VOCÊ JÁ TEM O ARQUIVO
    });
  }


}
