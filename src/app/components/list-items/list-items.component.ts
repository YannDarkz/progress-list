import { Component, EventEmitter, OnInit, Input, ViewChild, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardListComponent } from '../card-list/card-list.component';
import { AddItemsComponent } from '../add-items/add-items.component';
import { BuyItemComponent } from '../buy-item/buy-item.component';

@Component({
  selector: 'app-list-items',
  standalone: true,
  imports: [CommonModule, CardListComponent, AddItemsComponent, BuyItemComponent],
  templateUrl: './list-items.component.html',
  styleUrl: './list-items.component.scss'
})
export class ListItemsComponent implements OnInit {
  items: Array<{ name: string, price: number }> = []

  totalPrice: number = 0

  // @Input() loadBuyItems = new EventEmitter<void>()
  @Output() notifyAddItem = new EventEmitter<void>()
  @Output() notifyUpdatedItem = new EventEmitter<void>()
  @Output() notifyRemoveItem = new EventEmitter<void>()
  @Output() notifyByuItem = new EventEmitter<void>()




  @ViewChild(AddItemsComponent) addItemsComponent!: AddItemsComponent;
  @ViewChild(BuyItemComponent) buyItemComponent!: BuyItemComponent;

  ngOnInit(): void {
    this.loadItems()
    // this.clearListBuy()
    // this.clearList()
  }

  ngAfterViewInit(): void {
    this.addItemsComponent.itemUpdated.subscribe(() => {
      this.loadItems();
    });
  }

  loadItems(): void {
    const storedItems = localStorage.getItem('listaCompras')
    if (storedItems) {
      this.items = JSON.parse(storedItems);
      this.calculateTotalPrice();
    }
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.items.reduce((acc, item) => acc + item.price, 0);

  }

  editItem(item: any, index: number): void {
    if (this.addItemsComponent) {
      this.addItemsComponent.startEdit(item, index);
      this.scrollToTop()
    } else {
      console.log('addItemsComponent não está inicializado');
    }
  }


  deleteItem(index: number): void {
    const storedItems = JSON.parse(localStorage.getItem('listaCompras') || '[]');
    storedItems.splice(index, 1);
    localStorage.setItem('listaCompras', JSON.stringify(storedItems));
    this.loadItems();
    this.notifyRemoveItem.emit()
  }

  buyItem(item: any, index: number) {
    const purchasedItems = JSON.parse(localStorage.getItem('listaComprados') || '[]');
    purchasedItems.push(item);
    localStorage.setItem('listaComprados', JSON.stringify(purchasedItems));
    
    const storedItems = JSON.parse(localStorage.getItem('listaCompras') || '[]');
    storedItems.splice(index, 1);
    localStorage.setItem('listaCompras', JSON.stringify(storedItems));
    this.loadItems();
    
    this.buyItemComponent.loadPurchasedItems();
    this.notifyByuItem.emit()

  }

  clearList(): void {
    localStorage.removeItem('listaCompras');
    this.items = [];
  }



  onNotifyAddItem(): void {
    this.notifyAddItem.emit()

  }

  onNotifyUpdatedItem(): void {
    this.notifyUpdatedItem.emit()
  }

  removeItemBuy(): void {
    this.notifyRemoveItem.emit()
  }


  clearListBuy(): void {
    localStorage.removeItem('listaComprados');
  }

  scrollToTop(): void {
    const scrollDuration = 30; // Tempo total em ms
    const startPosition = window.scrollY;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / scrollDuration, 1);
        const scrollPosition = startPosition * (1 - progress);
        
        window.scrollTo(0, scrollPosition);

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    };

    requestAnimationFrame(animateScroll);
}

}
