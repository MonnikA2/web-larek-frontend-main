import { ILarekApi, IOrder, IOrderResult, IProduct } from "../types";
import { Api, ApiListResponse } from "./base/api";

// Класс LarekAPI расширяет базовый Api класс для взаимодействия с сервером
export class LarekApi extends Api implements ILarekApi {
  readonly cdn: string;

  // Конструктор принимает адрес CDN и базовый URL для API
  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn; // Сохранение ссылки на CDN
  }

  // Получение списка товаров
  getProductList(): Promise<IProduct[]> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) => 
      data.items.map((item) => ({
        ...item,
        image: this.cdn + item.image // Добавление полного пути к изображению
      }))
    );
  }

  // Получение детальной информации о товаре по ID
  getProductItem(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then(
      (item: IProduct) => ({
        ...item,
        image: this.cdn + item.image
      })
    )
  }
  
  // Оформление заказа
  async orderProducts(order: IOrder): Promise<IOrderResult> {
    return await this.post(`/order`, order);
  }
}