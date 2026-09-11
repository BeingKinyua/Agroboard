import { Product } from '../../types';
import { INITIAL_PRODUCTS } from '../../mock/initialData';

export interface ProductService {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  createProduct(product: Omit<Product, 'id' | 'sku'>): Promise<Product>;
  updateProduct(product: Product): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
}

class MockProductService implements ProductService {
  private products: Product[] = [...INITIAL_PRODUCTS];

  async getProducts(): Promise<Product[]> {
    return [...this.products];
  }

  async getProductById(id: string): Promise<Product | null> {
    const p = this.products.find(item => item.id === id);
    return p || null;
  }

  async createProduct(data: Omit<Product, 'id' | 'sku'>): Promise<Product> {
    const catCode = data.category.substring(0, 3).toUpperCase();
    const sku = `PROD-${catCode}-${String(this.products.length + 1).padStart(3, '0')}`;
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      sku
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(product: Product): Promise<Product> {
    this.products = this.products.map(p => p.id === product.id ? product : p);
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const initialLen = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    return this.products.length < initialLen;
  }
}

export const productService: ProductService = new MockProductService();
