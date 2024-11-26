import { FormErrors, IAppState, IContactsForm, IOrder, IPaymentForm, IProduct } from "../types";
import { Model } from "./base/Model";

// Тип события для обновления каталога
export type CatalogChangesEvent = {
  catalog: Product[];
}

export class Product extends Model<IProduct> {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
}

export class AppState extends Model<IAppState> {
  catalog: Product[];
  basket: Product[] = [];
  order: IOrder = {
    payment: 'online',
    address: '',
    email: '',
    phone: '',
    items: [],
    total: 0,
  }
  preview: string | null;
  formErrors: FormErrors = {};
  
  // Генератор событий об изменении состояния корзины
  private emitBasketChange() {
    this.emitChanges('counter:changed', { count: this.basket.length } );
    this.emitChanges('basket:changed', this.basket)
  }

  clearBasket() {
    this.basket = [];
    this.emitBasketChange();
  }
 
  addToBasket(item: Product) {
    if(this.basket.includes(item)) return; 
      this.basket.push(item);
      this.emitBasketChange(); 
  }

  removeFromBasket(item: Product) {
    this.basket = this.basket.filter(it => it !== item);
    this.emitBasketChange();
  }
  
  // Установить каталог товаров
  setCatalog(items: Product[]) {
    this.catalog = items.map(item => new Product(item, this.events));
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  // Предпросмотр товара
  setPreview(item: Product) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  clearOrder() {
    this.order = {
      payment: 'online',
      address: '',
      email: '',
      phone: '',
      items: [],
      total: 0,
    }
  }

  // Установить поля и проверить валидность формы Payment
  setPaymentField(field: keyof IPaymentForm, value: string) {
    this.order[field] = value;
    this.validatePayment();
  }
  
  private validatePayment() {
    const errors: typeof this.formErrors = {}; 

    if(!this.order.address) {
      errors.address = 'Укажите адрес'
    } 
    this.updateFormErrors(errors);
  }
  
  // Установить поля и проверить валидность формы Contacts
  setContactsField(field: keyof IContactsForm, value: string) {
    this.order[field] = value;
    this.validateContacts();
  }
  
  private validateContacts() {
    const errors: typeof this.formErrors = {}; 
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const phoneRegex = /^\+7[0-9]{10}$/;
    let emailValue = this.order.email;
    let phoneValue = this.order.phone;

    if(emailValue.length === 0) {
      errors.email = 'Укажите email'
    } else if (!emailRegex.test(emailValue)) { 
      errors.email = 'Некорректный адресс электронной почты'
    }
    if (phoneValue.startsWith('8')) {
      phoneValue = '+7' + phoneValue.slice(1);
    }
    if (phoneValue.length === 0) {
      errors.phone = 'Укажите телефон';
    } else if (!phoneRegex.test(phoneValue)) {
      errors.phone = 'Некорректный формат номера'
    } else {
      this.order.phone = phoneValue;
    }
    this.updateFormErrors(errors); 
  }
  
  // Обновить ошибки формы и сгенерировать соответствующие события
  private updateFormErrors(errors: FormErrors) {
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    if (Object.keys(errors).length === 0) {
      this.events.emit('order:ready', this.order);
    }
  }
}

