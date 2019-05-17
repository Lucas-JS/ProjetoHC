import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { File } from '@ionic-native/file/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';

import firebase from 'firebase';


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

  constructor(public firebaseService:FirebaseProvider,public navCtrl: NavController, public navParams: NavParams,
    public fileChooser:FileChooser, public file:File) {
    //Captura a opção selecionada e seleciona o grupo e atividades
    this.grupo = this.firebaseService.getGrupo(navParams.get('opcao'));
    this.atividade = this.firebaseService.getAtividade(navParams.get('opcao'));
    //this.files = this.firebaseService.getFiles();
  }

  mudaCor(){
    this.selected=false;
    return this.cor = "anhembiColor";
  }

  cadCert(){
     // this.uploadInformation('teste123');
    //this.fileChooser.open().then((uri)=>{
      //alert(uri);

      //this.file.resolveLocalFilesystemUrl(uri).then((newUrl)=>{
        //alert(JSON.stringify(newUrl));
        //let dirPath= newUrl.nativeURL;
       // let dirPathSegments = dirPath.split('/');
        //dirPathSegments.pop();
        //dirPath = dirPathSegments.join('/');

        //console.log(dirPath);
        //this.file.readAsArrayBuffer(dirPath, newUrl.name).then(async(buffer)=>{
        //await this.upload(buffer,newUrl.name);
       // })
   // })
 // })
}

  async upload(buffer,name){
    let blob = new Blob( [buffer], {type: "image/jpeg"});
    let storage = firebase.storage();

    storage.ref('images/' + name).put(blob).then((d)=>{
      alert("Done");
    }).catch((error)=>{
      alert(JSON.stringify(error))
    })
  }

  uploadInformation(text){
    let upload = this.firebaseService.uploadFile(text);
    upload.then().then(res=>{
      console.log(res);
    })
  }

}
