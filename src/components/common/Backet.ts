import { IBasketView } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

export class Basket extends Component<IBasketView> {

  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    // Инициализация основных элементов корзины
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = container.querySelector('.basket__price');
    this._button = container.querySelector('.basket__button');

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open')
      });
    }

    // Инициализация корзины в пустом состоянии и деактивация кнопки
    this.items = [];
    this.toggleCheckoutButton(true);
  }

  // Включает/выключает кнопку оформления заказа
  toggleCheckoutButton(isDisabled: boolean): void {
    this._button.disabled = isDisabled;
  }

  // Обновить список товаров корзины
  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(createElement<HTMLParagraphElement> ('p', {
        textContent: 'Корзина пуста'
      }));
    }
  }

  set total(total: number) {
    this.setText(this._total, `Итого: ${total} синапсов`);
  }
}