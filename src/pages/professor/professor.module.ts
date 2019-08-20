import { SearchPipe } from './../../pipes/search/search';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfessorPage } from './professor';

@NgModule({
  declarations: [
    ProfessorPage,
    SearchPipe,
  ],
  imports: [
    IonicPageModule.forChild(ProfessorPage),
  ],
})
export class ProfessorPageModule {}
