import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';



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

  files: Observable<any>;

  //Mostrar O Avanço da Barra de Progresso
  uploadProgress:Number=70;

  constructor(public firebaseService:FirebaseProvider,public navCtrl: NavController,
    public navParams: NavParams,private document:DocumentViewer, private file:File,
    private transfer:FileTransfer,private platform:Platform) {
    //Captura a opção selecionada e seleciona o grupo e atividades
    this.grupo = this.firebaseService.getGrupo(navParams.get('opcao'));
    this.atividade = this.firebaseService.getAtividade(navParams.get('opcao'));
  }

  mudaCor(){
    this.selected=false;
    return this.cor = "anhembiColor";
  }

  cadCert(){
    this.uploadInformation('C:\atividades.pdf');
  }

  uploadInformation(url){
    let upload = this.firebaseService.uploadFile(url);
    upload.then().then(res=>{
      console.log(res);
    })
  }

  //Visualizador dos PDF'S
  openPDF():void{
    let path = null;

    if(this.platform.is('ios')){
      path = this.file.documentsDirectory;
    }else{
      path = this.file.dataDirectory;
    }

    const transfer = this.transfer.create();
    transfer.download('https://mail-attachment.googleusercontent.com/attachment/u/0/?ui=2&ik=dca2a2f8fb&attid=0.1&permmsgid=msg-f:1614756903984652898&th=1668c4d94c9d6262&view=att&disp=inline&saddbat=ANGjdJ-y31zfstt0_pdVzIHjh4Rq6y87RrSdXcszLxQpkj1dZ7Cn4dvJaIHuaXMfNVjM4NWAl8b1auIjT9__YfPEPyg9RWYV6WLyFdfF3BI3_t6BwXuLmMjWE03TwxmztW599YBadLsRz2sItqOwg8w7Oa02mPVXhWQsrG1JV6MoSBk4SDUAJ9CTkMuKmM9mZH2D-zi47Rad3CgOVetPr283J3yj8jUFAeDEjmIy3H9GRfVtIBErNY1BAw-aFgT1j32eylAJnLoOeWVOC6ECN65zsy4RYrutIwZ7MzsmIpDasGhDQXxv83hJPXYhoPvLKA2dpB8lncM1ehlQLatnujc0N88hHP8rNzsu7cmYf3KktbnHQ9HUpBC8Q6ECmddql_mkJF_FjMLDIF700mASDOPxFxbiZfzeGiRRF_rpmlyqHkMZbg0UPVYn3rtoFj_qZYWDG7Mv09gt6mjupVI1nBQyJtD6eo-EEpo0yeD-sS8IpdCXRbwcFKk7x9VW57RdCckjYcYXh3hLbmVmdDG72R2jSFl8RIGGojreVWzMiZt2IfUsaZubz8cXRqS8mb5Y-lh1NeFCpdUdOP6TmcwCkEXFoiN4MjhncEYuvH58YZB9Tb9OGw5GVtoGK1Wcneg6ezSlugrHGthzoMTGQqvslG_ML54FAkkFIbG5oqe8vw',
    path + 'myfile.pdf').then(e=>{ let url = e.toURL();
    this.document.viewDocument(url,'application/pdf',{});
    });
  }
}
