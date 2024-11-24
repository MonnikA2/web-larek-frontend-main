// Реализация базового компонента
export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {}

  toggleClass(element: HTMLElement, className: string, force?: boolean) {
    element.classList.toggle(className, force);
  }

  protected setText(element: HTMLElement, value: string) {
    if (element) {
      element.textContent = String(value);
    }
  }

  setDisabled(element: HTMLElement, state: boolean) {
    if (element){
      if(state) element.setAttribute('disabled', 'disabled');
      else element.removeAttribute('disabled');
    }
  }

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}