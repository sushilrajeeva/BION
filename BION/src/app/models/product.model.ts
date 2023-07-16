export interface Product {
  _id: string;
  productName: string;
  productRibbon: string;
  productDescription: string;
  productCategory: string[];
  additionalInfo: AdditionalInfo[];
  productSellPrice: number;
  productCostPrice: number;
  productInventoryStatus: string;
  productWeight: number;
  productStockCount: number;
  imageURL: string;
}

interface AdditionalInfo {
  infoTag: string;
  infoDescription: string;
}
