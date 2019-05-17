import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GrupoPage } from './grupo';

@NgModule({
  declarations: [
    GrupoPage,
    ComponentsModule
  ],
  imports: [
    IonicPageModule.forChild(GrupoPage),
  ],
})
export class AtivForaUnivPageModule {}
