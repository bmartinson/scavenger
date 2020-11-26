import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { QFButtonComponent } from './components/button/button.component';
import { QFElementWrapperComponent } from './components/element-wrapper/element-wrapper.component';
import { QFFormComponent } from './components/form/form.component';
import { QFTextInputComponent } from './components/text-input/text-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    QFButtonComponent,
    QFElementWrapperComponent,
    QFFormComponent,
    QFTextInputComponent,
  ],
  entryComponents: [
    QFButtonComponent,
  ],
  providers: [
  ],
  exports: [
    FormsModule,
    RouterModule,
    QFButtonComponent,
    QFElementWrapperComponent,
    QFFormComponent,
    QFTextInputComponent,
  ],
})
export class QuickFormsModule {
}
