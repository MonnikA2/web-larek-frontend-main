import { IActions, IContactsForm, IPaymentForm } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class PaymentForm extends Form<IPaymentForm> {

  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents, actions?: IActions) {
    super(container, events);

    this.initializePaymentButtons(actions)
  }

  private initializePaymentButtons(actions?: IActions): void {
    this._cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this._cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this._cardButton.classList.add('button_alt-active');

    // Назначение обработчиков событий для кнопок
    if (actions?.onClick) {
      this._cardButton.addEventListener('click', actions.onClick.bind(this));
      this._cashButton.addEventListener('click', actions.onClick.bind(this));
    }
  }

  toggleStateButtons() {
    this._cardButton.classList.toggle('button_alt-active');
    this._cashButton.classList.toggle('button_alt-active');
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}

export class ContactsForm extends Form<IContactsForm> {

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  set email(value: string) {
    (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
  }

  set phone(value: string) {
    (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
  }
}