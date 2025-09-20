import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PoiStoreService } from '../../services/poi-store-service';
import { PoiInput } from '../../models/poi-input.model';

@Component({
  selector: 'app-poi-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './poi-dialog.html',
  styleUrl: './poi-dialog.scss',
})
export class PoiDialog {
  public show = input<boolean>(false);
  public lat = input.required<number>();
  public lng = input.required<number>();

  private readonly _poiStore = inject(PoiStoreService);
  private formBuilder = inject(FormBuilder);

  public save = output<PoiInput>();
  public close = output<void>();

  public form = this.formBuilder.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      if (this.show()) {
        this.form.reset();
      }
    });
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.save.emit({
        name: this.form.value.name!,
        category: this.form.value.category!,
        coordinates: [this.lng(), this.lat()],
      });
      this.form.reset();
    }
  }

  public onCancel(): void {
    this.close.emit();
    this.form.reset();
  }
}
