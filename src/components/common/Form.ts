import { IFormState } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

export class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement; // Кнопка отправки формы 
  protected _errors: HTMLElement; // Элемент для отображения ошибок формы

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);

    // Инициализация элементов формы
    this._submit = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

    // Подписка на события ввода и отправки формы
    this.container.addEventListener('input', this.handleInput.bind(this));
    this.container.addEventListener('submit', this.handleSubmit.bind(this));
  };

  protected handleInput(e: Event): void {
    const target = e.target as HTMLInputElement;
    const field = target.name as keyof T;
    const value = target.value;
    this.onInputChange(field, value);
  } 

  protected handleSubmit(e: Event): void {
    e.preventDefault();
    this.events.emit(`${this.container.name}:submit`);
  }
  
  protected onInputChange(field: keyof T, value: string): void {
    // Автокоррекция номера телефона
    if (field === 'phone' && value.startsWith('8')) {
      value = '+7' + value.substring(1);
  
      // Обновление значения в поле ввода
      const phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
      if (phoneInput) {
        phoneInput.value = value;
      }
    }
    
    // Логика обработки ввода для каждого поля
    this.events.emit(`${this.container.name}.${String(field)}:change`, {
      field, 
      value
    });
  }

  set inValid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }

  // Рендеринг формы с новым состоянием
  render(state: Partial<T> & IFormState): HTMLElement {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    // Применение изменений состояния к форме
    Object.assign(this, inputs);
    return this.container;
  }
}