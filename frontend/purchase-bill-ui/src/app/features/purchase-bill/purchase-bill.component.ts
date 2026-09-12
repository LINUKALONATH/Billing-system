import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PurchaseItem, PurchaseSummary, ITEM_OPTIONS } from '../../core/models/purchase.models';
import { LocationDetail } from '../../core/models/auth.models';

@Component({
  selector: 'app-purchase-bill',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-bill.component.html',
  styleUrls: ['./purchase-bill.component.css']
})
export class PurchaseBillComponent implements OnInit {
  itemOptions = ITEM_OPTIONS;
  filteredItems: string[] = [];
  locations: LocationDetail[] = [];

  selectedItem: string = '';
  selectedBatch: string = '';
  standardCost: number = 0;
  standardPrice: number = 0;
  margin: number = 0;
  qty: number = 0;
  freeQty: number = 0;
  discount: number = 0;
  totalCost: number = 0;
  totalSelling: number = 0;

  items: PurchaseItem[] = [];
  summary: PurchaseSummary = { totalItems: 0, totalQuantity: 0 };

  showItemDropdown: boolean = false;
  itemSearchTerm: string = '';
  activeTab: string = 'Items';

  formErrors: { [key: string]: string } = {};
  submitted: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const user = this.authService.getCurrentUser();
    this.locations = user?.locations || [];
    if (this.locations.length > 0) {
      this.selectedBatch = this.locations[0].locationName;
    }

    this.filteredItems = [...this.itemOptions];
  }

  validateForm(): boolean {
    this.formErrors = {};

    if (!this.selectedItem || !this.itemSearchTerm.trim()) {
      this.formErrors['item'] = 'Item is required.';
    }

    if (!this.selectedBatch) {
      this.formErrors['batch'] = 'Batch is required.';
    }

    if (this.standardCost <= 0) {
      this.formErrors['standardCost'] = 'Standard Cost must be greater than 0.';
    }

    if (this.standardPrice <= 0) {
      this.formErrors['standardPrice'] = 'Standard Price must be greater than 0.';
    }

    if (this.standardPrice < this.standardCost) {
      this.formErrors['standardPrice'] = 'Standard Price cannot be less than Standard Cost.';
    }

    if (this.qty <= 0 || !Number.isInteger(this.qty)) {
      this.formErrors['qty'] = 'Quantity must be a positive whole number.';
    }

    if (this.freeQty < 0 || !Number.isInteger(this.freeQty)) {
      this.formErrors['freeQty'] = 'Free Qty cannot be negative.';
    }

    if (this.discount < 0 || this.discount > 100) {
      this.formErrors['discount'] = 'Discount must be between 0 and 100.';
    }

    return Object.keys(this.formErrors).length === 0;
  }

  isFieldInvalid(field: string): boolean {
    return this.submitted && !!this.formErrors[field];
  }

  filterItems(): void {
    if (!this.itemSearchTerm.trim()) {
      this.filteredItems = [...this.itemOptions];
    } else {
      this.filteredItems = this.itemOptions.filter((item: string) =>
        item.toLowerCase().includes(this.itemSearchTerm.toLowerCase())
      );
    }
    this.showItemDropdown = true;
  }

  selectItem(item: string): void {
    this.selectedItem = item;
    this.itemSearchTerm = item;
    this.showItemDropdown = false;
    this.formErrors['item'] = '';
    this.calculateTotals();
  }

  onCostPriceChange(): void {
    this.margin = this.standardPrice - this.standardCost;
    this.calculateTotals();
  }

  calculateTotals(): void {
    const discountAmount = (this.standardCost * this.qty * this.discount) / 100;
    this.totalCost = (this.standardCost * this.qty) - discountAmount;
    this.totalSelling = this.standardPrice * this.qty;
  }

  addItem(): void {
    this.submitted = true;

    if (!this.validateForm()) {
      return;
    }

    const newItem: PurchaseItem = {
      id: this.items.length + 1,
      itemName: this.selectedItem,
      batch: this.selectedBatch,
      standardCost: this.standardCost,
      standardPrice: this.standardPrice,
      margin: this.margin,
      qty: this.qty,
      freeQty: this.freeQty,
      discount: this.discount,
      totalCost: this.totalCost,
      totalSelling: this.totalSelling
    };

    this.items.push(newItem);
    this.updateSummary();
    this.resetForm();
    this.submitted = false;
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
    this.updateSummary();
  }

  updateSummary(): void {
    this.summary = {
      totalItems: this.items.length,
      totalQuantity: this.items.reduce((sum, item) => sum + item.qty, 0)
    };
  }

  resetForm(): void {
    this.selectedItem = '';
    this.itemSearchTerm = '';
    this.standardCost = 0;
    this.standardPrice = 0;
    this.margin = 0;
    this.qty = 0;
    this.freeQty = 0;
    this.discount = 0;
    this.totalCost = 0;
    this.totalSelling = 0;
    this.formErrors = {};
    this.submitted = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  hideDropdown(): void {
    setTimeout(() => { this.showItemDropdown = false; }, 200);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}
