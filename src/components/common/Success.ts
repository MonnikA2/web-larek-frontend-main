import { ISuccess, ISuccessActions } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";


export class Success extends Component<ISuccess> {

  protected _closeButton: HTMLElement;
  protected _totalElement: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this._closeButton = ensureElement<HTMLElement>('.order-success__close', container);
    this._totalElement = ensureElement<HTMLElement>('.order-success__description', container);

    // Подключение обработчика события закрытия окна
    if (actions?.onClick) {
      this._closeButton.addEventListener('click', actions.onClick);
    }
  }

  set total(value: string) {
    this._totalElement.textContent = `Списано ${value} синапсов`;
  }
}