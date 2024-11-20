//-------------- Модели данных --------------

export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
}

export interface IPaymentForm {
  payment: string;
  address: string;
}

export interface IContactsForm {
  email: string;
  phone: string;
}

export interface IOrder extends IPaymentForm, IContactsForm {
  items: string[];
  total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>

export interface IAppState {
  // Загрузка данных с сервера
  catalog: IProduct[];
  basket: string[];
  preview: string | null; // id продукта для предпросмотра
  order: IOrder | null; 
  paymentForm: IPaymentForm | null;
  contact: IContactsForm | null;
  formErrors: FormErrors;
}

//-------------- Компоненты и их состояния --------------

export interface ICard extends IProduct {
  index?: string;
  buttonText?: string;
}

export interface IPage {
  cuounter: number;
  catalog: HTMLElement[];
}

export interface IModelData {
  content: HTMLElement;
}

export interface IBasketView {
  items: HTMLElement[];
  total: number;
}

export interface IFormState {
  valid: boolean;
  errors: string[]
}

export  interface ISuccess {
  total: number;
}

export interface IActions {
  onClick: (event: MouseEvent) => void;
}

export interface ISuccessActions {
  onClick: () => void;
}

//-------------- API и сетевое взаимодействие --------------

export interface ILarekApi {
  getProductList: () => Promise<IProduct[]>;
  getProductItem: (id: string) => Promise<IProduct>;
  orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

export interface IOrderResult {
  id: string;
  total: number;
}