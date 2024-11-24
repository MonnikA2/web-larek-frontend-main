import { IActions, ICard } from "../types";
import { productCategory } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export class Card extends Component<ICard> {

  protected _title: HTMLElement;
  protected _description?: HTMLElement;
  protected _category?: HTMLElement;
  protected _index?: HTMLElement;
  protected _price: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _button?: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IActions) {
    super(container);

    // Инициализация элементов карточки товара
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._description = container.querySelector('.card__text');
    this._category = container.querySelector('.card__category');
    this._index = container.querySelector('.basket__item-index');
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._image = container.querySelector('.card__image');
    this._button = container.querySelector('.card__button');

    // Подключение обработчиков событий
    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  // Сеттер и геттер для id карточки
  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set price(value: number) {
    if (value !== null) {
      this.setText(this._price, value ? `${value} синапсов` : '');
    } else {
      this.setText(this._price, 'Бесценно');
    } 
    this.disablePriseButton(value);
  }

  get price(): number {
    return Number(this._price.textContent?.replace(' синапсов', '')) || 0;
  }

  set category(value: string) {
    this.setText(this._category, value);
    this._category.classList.add(productCategory[value]);
  }

  get category(): string {
    return this._category.textContent || '';
  }

  set index(value: string) {
    if (this._index) {
      this._index.textContent = value;
    }
  }

  get index() {
    return this._index.textContent || '';
  }

  set image(value: string) {
    if (this._image) {
      this._image.src = value;
      this._image.alt = this.title;
    }
  }

  set description(value: string) {
    if (this._description) {
      this.setText(this._description, value);
    }
  }

  // Метод для отключения кнопки цены
  disablePriseButton(value: number) {
    if (!value && this._button) {
      this._button.disabled = true;
    }
  }

  // Сеттер для текста кнопки
  set button(value: string) {
    if (this._button) {
      this._button.textContent = value;
    }
  }
}