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
  //Captura data
  data = new Date();
  //Converte Data
  dataConv:string;
  teste:Observable<any>;
  nomeCatGlobal=[];
  horasCatGlobal=[];


  constructor(public firebaseService:FirebaseProvider,public navCtrl: NavController,
    public navParams: NavParams, public docs:DocumentViewer, public file:File, public filetransfer:FileTransfer, public app:InAppBrowser, public platform:Platform, @Inject(FirebaseApp) fb: any, public msgToastController:ToastController) {
    //Captura a opção selecionada e seleciona o grupo e atividades
    this.grupo = this.firebaseService.getGrupo(navParams.get('opcao'));
    this.atividade = this.firebaseService.getAtividade(navParams.get('opcao'));
    //Cria referência no Firebase Storage
    this.referencia = fb.storage().ref();
    //Busca certificados pelo RA do aluno
    this.getCertificado(this.firebaseService.getRA());
    this.verifAtividades(this.atividade);
  }

  mudaCor(ativ:string){
    this.ativ=ativ;
    this.selected=false;
    this.arquivo= "";
    return this.cor = "anhembiColor";
  }

  dataAtual(){
    //Captura Data Atual
    this.data.getDate();
    this.data.getMonth();
    this.data.getFullYear();
    this.dataConv = this.data.toString();
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
    //Pega data atual no sistema para salvar como data de envio
    this.dataAtual();
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
          url: url,
          data: this.dataConv
        }
        // salva objeto certificado na coleção
        this.firebaseService.saveCert(certificadoJson);
      });
      this.msgToastController.create({ message: 'Certificado enviado com sucesso.', duration: 3000 }).present();
  })} catch (error) {
      console.log('falta arquivo',error);
      this.msgToastController.create({ message: 'Erro ao inserir certificado, certifique-se de inserir arquivo!', duration: 5000 }).present();
    };
    //Desabilitar botão de enviar
    this.selected = true;
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

  //Atribui valores do banco para array loais
  verifAtividades(ativ:any){
    let contConv;
    let ativLocal:Observable<any> = ativ;
    //Nome e categoria das atividades locais
    let horasCat=[];
    let nomeCat=[];
    ativLocal.subscribe(a=>{for(let cont=0;cont<a.length;cont++){
      //Popula array de nome e horas
      contConv = cont.toString();
      nomeCat[cont] = a[contConv].nome;
      horasCat[cont] = a[cont].horasCadastradas;
  }this.populaAtividades(nomeCat,horasCat)});
  }

  //Método auxiliar para popular variáveis
  populaAtividades(nomeCat,horasCat){
    let contConv;
    //Looping para popular atividades globais
    for(let cont=0;cont<nomeCat.length;cont++){
      this.nomeCatGlobal[cont] = nomeCat[cont];
      this.horasCatGlobal[cont] = horasCat[cont];
    }

    this.certificado = this.firebaseService.getCertificadoAluno(this.firebaseService.getRA());
    this.certificado.subscribe(a=>{for(let cont=0;cont<a.length;cont++){
    contConv = cont.toString();
    //Soma as horas apenas das horas cadastradas em determinada atividade
    for(let cont2=0;cont2<this.nomeCatGlobal.length;cont2++){
      if(a[contConv].categoria == this.nomeCatGlobal[cont2]){
        this.horasCatGlobal[cont2] += Number(a[contConv].horasValidadas);
      }
    }}})
  }

  limitador(ch){
    if(ch>0){
      return false;
    }else{return true};
  }

  seqAtiv(categoria){
    for(let cont=0;cont<this.nomeCatGlobal.length;cont++){
      if(categoria==this.nomeCatGlobal[cont]){
        console.log(this.horasCatGlobal[cont]);
        return this.horasCatGlobal[cont];
      }
    }
    return null;
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
