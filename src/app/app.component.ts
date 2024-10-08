import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ListItemsComponent } from './components/list-items/list-items.component';
import { BuyItemComponent } from './components/buy-item/buy-item.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BuyItemComponent, ListItemsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  addTextNotify = '';
  removeTextNotify = ''

  notifyAddItem(): void {
    this.addTextNotify = 'adcionado com sucesso!'
    setTimeout(() => {
      this.addTextNotify = ''
    },1000)
  }

  notifyEditItem(): void {
    this.addTextNotify = 'Editado com sucesso!'
    setTimeout(() => {
      this.addTextNotify = ''
    },1000)
  }

  notifyRemoveItem(): void {
    this.removeTextNotify = 'Excluido com sucesso!'
    setTimeout(() => {
      this.removeTextNotify = ''
    },1000)
  }

}
