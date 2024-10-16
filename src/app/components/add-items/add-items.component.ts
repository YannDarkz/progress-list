import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-items',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-items.component.html',
  styleUrl: './add-items.component.scss'
})
export class AddItemsComponent {

  @Output() itemUpdated = new EventEmitter<void>()
  @Output() notifyAddItem = new EventEmitter<void>()
  @Output() notifyEditItem = new EventEmitter<void>()
  
  currentItemIndex: number | null = null
  
  addItemForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0)]],
    quantity: [1, [Validators.required, Validators.min(1)] ]
  });

  editing: boolean = false

  constructor(private formBuilder: FormBuilder) { }

  addItem(): void {
    if (this.addItemForm.valid) {
      const newItem = this.addItemForm.value
      const currentList = JSON.parse(localStorage.getItem('listaCompras') || '[]');

      if (this.editing && this.currentItemIndex !== null) {
        currentList[this.currentItemIndex] = newItem
      } else {
        currentList.push(newItem)
      }

      localStorage.setItem('listaCompras', JSON.stringify(currentList));
      this.addItemForm.reset();
      
      if (this.editing && this.currentItemIndex !== null) {
        this.notifyEditItem.emit();
      } else {
        this.notifyAddItem.emit();

      }
      this.editing = false;
      this.currentItemIndex = null
      this.itemUpdated.emit()
    }
  }

  startEdit(item: any, index: number): void {

    this.addItemForm.patchValue(item);
    this.editing = true;
    this.currentItemIndex = index;

  }

  cancelEdit() {
    this.addItemForm.reset();
    this.editing = false;
    this.currentItemIndex = null
  }

  get itemName() {
    return this.addItemForm.get('name')!;
  }

  get itemPrice() {
    return this.addItemForm.get('price')!;
  }

  get itemQuantity() {
    return this.addItemForm.get('quantity')!;
}





}
