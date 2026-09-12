export interface PurchaseItem {
  id: number;
  itemName: string;
  batch: string;
  standardCost: number;
  standardPrice: number;
  margin: number;
  qty: number;
  freeQty: number;
  discount: number;
  totalCost: number;
  totalSelling: number;
}

export interface PurchaseSummary {
  totalItems: number;
  totalQuantity: number;
}

export const ITEM_OPTIONS = [
  'Mango',
  'Apple',
  'Banana',
  'Orange',
  'Grapes',
  'Kiwi',
  'Strawberry'
];
