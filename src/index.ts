import './scss/styles.scss';
import { AppState, CatalogChangesEvent, Product } from './components/AppData';
import { Card } from './components/Card';
import { LarekApi } from './components/LarekApi';
import { ContactsForm, PaymentForm } from './components/Order';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/common/Backet';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';
import { IContactsForm, IOrder, IPaymentForm } from './types';
import { API_URL, CDN_URL, PaymentMethod } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Создание объектов для управления событиями и api
const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'); 
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модель данных приложения
const appDate = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events); 

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new PaymentForm(cloneTemplate(paymentTemplate), events, {
  onClick: (ev: Event) => events.emit('payment:toggle', ev.target) 
});
const contact = new ContactsForm(cloneTemplate(contactsTemplate), events);

//-------------- Бизнес-логика, обработка событий --------------

// Изменились элементы каталога
events.on<CatalogChangesEvent>('items:changed', () => {
  page.catalog = appDate.catalog.map(item =>
    new Card(cloneTemplate(cardCatalogTemplate), { onClick: () => events.emit('card:select', item)}).render(item));
  });

// Открыть товар
events.on('card:select', (item: Product) => {
  appDate.setPreview(item);
});

events.on('preview:changed', (item: Product) => {
  const card = new Card(cloneTemplate(cardPreviewTemplate), {
    onClick: () => { 
    events.emit('product:toggle', item);
    card.buttun = (appDate.basket.indexOf(item) < 0) ? 'Купить' : 'Удалить из корзины'
    }
  });
  modal.render({
    content: card.render({
      title: item.title,
      description: item.description,
      image: item.image,
      price: item.price,
      category: item.category,
      buttonText: (appDate.basket.indexOf(item) < 0) ? 'Купить' : 'Удалить из корзины'
    })
  });
});

// Переключение, добавление, удаление товара и обновление счетчика
events.on('product:toggle', (item: Product) => {
  if (appDate.basket.indexOf(item) < 0) {
    events.emit('product:add', item);
  } else {
    events.emit('product:delete', item);
  }
});

events.on('product:add', (item: Product) => {
  appDate.addToBasket(item);
});

events.on('product:delete', (item: Product) => {
  appDate.removeFromBasket(item);
});

// Обновление списка товаров в корзине и стоимость
events.on('basket:changed', (items: Product[]) => {
  basket.items = items.map((item, index) => {
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit('product:delete', item)
      }
    });

    return card.render({
      index: (index+1).toString(),
      title: item.title,
      price: item.price,
    });
  });
  const total = items.reduce((total, item) => total + item.price, 0);
  basket.total = total;
  appDate.order.total = total;
  basket.toggleCheckoutButton(total === 0);
});

events.on('counter:changed', (item: string[]) => {
  page.counter = appDate.basket.length;
});

events.on('basket:open', () => {
  modal.render({ content: basket.render({}) });
});

// Открыть форму выбора оплаты
events.on('order:open', () => {
  modal.render({
    content: delivery.render({
      payment: '',
      address: '',
      valid: false,
      errors: []
    })
  });
  appDate.order.items = appDate.basket.map(item => item.id);
});

// Сменить способ оплаты
events.on('payment:toggle', (target: HTMLElement) => {
  if (!target.classList.contains('button_alt-active')) {
    delivery.toggeStateButtons(target);
    appDate.order.payment = PaymentMethod[target.getAttribute('name')];
  }
});

// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
  const {payment, address, email, phone} = errors;
  delivery.valid = !payment && !address;
  contact.valid = !phone && !email;
  delivery.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
  contact.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

// Измененилось поле формы доставки
events.on(/^order\..*:change/, (data: { field: keyof IPaymentForm, value: string}) => {
  appDate.setPaymentField(data.field, data.value);
});

// Измененилось поле формы контактов
events.on(/^contacts\..*:change/, (data: { field: keyof IContactsForm, value: string}) => {
  appDate.setContactsField(data.field, data.value);
});

events.on('delivery:ready', () => {
  delivery.valid = true;
})

// Перейти к форме контактов
events.on('order:submit', () => {
  modal.render({
    content: contact.render({
      phone: '',
      email: '',
      valid: false,
      errors: []
    })
  });
});

events.on('contact:ready', () => {
  contact.valid = true;
})

// Оформить заказ
events.on('contacts:submit', () => {
  api.orderProducts(appDate.order)
    .then(res => {
      appDate.clearBasket();
      appDate.clearOrder();
      const success = new Success(cloneTemplate(successTemplate), { onClick: () => modal.close() });
      success.total = res.total.toString();
      modal.render({
        content: success.render({})
      });
    })
    .catch(err => {
      console.error('Ошибка при оформлении заказа: ', err);
    });
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// Разблокируем ...
events.on('modal:close', () => {
  page.locked = false;
});

// Получаем продукты с сервера
api.getProductList()
  .then(appDate.setCatalog.bind(appDate))
  .catch(err => {
    console.error('Ошибка при загрузке списка продуктов', err);
  });