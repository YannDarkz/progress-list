import { Component, EventEmitter, OnInit, Input, ViewChild, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardListComponent } from '../card-list/card-list.component';
import { AddItemsComponent } from '../add-items/add-items.component';
import { BuyItemComponent } from '../buy-item/buy-item.component';

interface Item {
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface Category {
  name: string;
  items: Item[]; 
}

@Component({
  selector: 'app-list-items',
  standalone: true,
  imports: [CommonModule, CardListComponent, AddItemsComponent, BuyItemComponent],
  templateUrl: './list-items.component.html',
  styleUrl: './list-items.component.scss'
})
export class ListItemsComponent implements OnInit {
  items: Array<Item> = []

  itemCategories: Category[] = [
    { name: 'Cold', items: [] },
    { name: 'Cleaning', items: [] },
    { name: 'Perishables', items: [] },
    { name: 'Others', items: [] },
  ];

  itemsByCategory = {
    cold: [] as Item[],
    perishables: [] as Item[],
    cleaning: [] as Item[],
    others: [] as Item[],
  };

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
    const storedItems = localStorage.getItem('itensCategory')
    if (storedItems) {
      this.itemsByCategory = JSON.parse(storedItems);
      // this.organizetemsByCategory();
      this.calculateTotalPrice();
    }
  }

  organizetemsByCategory(): void {
    this.itemCategories.forEach(category => category.items = []);
    this.items.forEach(item => {
      // console.log('Item category:', item.category);
      const category = this.itemCategories.find(cat => cat.name.toLowerCase() === item.category.toLowerCase());
      console.log("cat", category);
      
      if(category){
        category.items.push(item);    
      }
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = Object.values(this.itemsByCategory)
    .flat()
    .reduce((acc, item) => acc + item.price * item.quantity, 0)

  }

  editItem(item: any, index: number, category: keyof typeof this.itemsByCategory): void {
    if (this.addItemsComponent) {
      this.addItemsComponent.startEdit(item, index, category);
      this.scrollToTop()
    } else {
      console.log('addItemsComponent não está inicializado');
    }
  }


  deleteItem(category: keyof typeof this.itemsByCategory, index: number): void {
    this.itemsByCategory[category].splice(index, 1)
    this.saveItems()
    this.loadItems();
    this.notifyRemoveItem.emit()
  }

  buyItem(item: any, category: keyof typeof this.itemsByCategory, index: number) {
    const purchasedItems = JSON.parse(localStorage.getItem('listaComprados') || '[]');
    purchasedItems.push(item);
    localStorage.setItem('listaComprados', JSON.stringify(purchasedItems));
    
    this.itemsByCategory[category].splice(index, 1);
    this.saveItems();
    this.loadItems();
    
    this.buyItemComponent.loadPurchasedItems();
    this.notifyByuItem.emit()

  }

  saveItems(): void {
    localStorage.setItem('itensCategory', JSON.stringify(this.itemsByCategory));

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
