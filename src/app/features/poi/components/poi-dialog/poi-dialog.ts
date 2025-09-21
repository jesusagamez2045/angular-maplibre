import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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
  public poiData = input<PoiInput | null>(null);

  private formBuilder = inject(FormBuilder);

  public save = output<PoiInput>();
  public close = output<void>();
  public delete = output<void>();

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

    effect(() => {
      if (this.poiData()) {
        this.form.patchValue({
          name: this.poiData()!.name,
          category: this.poiData()!.category,
        });
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

  public deletePoi(): void {
    if (!this.poiData()) return;

    const confirmDelete = confirm(
      `¿Estás seguro de que deseas eliminar el POI "${this.poiData()?.name}"?`
    );
    if (confirmDelete) this.delete.emit();
  }

  public onCancel(): void {
    this.close.emit();
    this.form.reset();
  }
}
