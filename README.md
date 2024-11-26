# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура проекта и взаимодействия
В основе архитектуры проекта лежит событийно-ориентированный подход, обеспечивающий динамичное взамодействие между различными компонентами системы:
- ```Модели```: отвечают за управление и хранение данных;
- ```Слушатели событий```: расположены в основном коде проекта и реагируют на инициированные моделями события. Выполняют необходимые вычисления или обработку данных и передают их компонентам отображения для последующего визуального представления;
- ```Компоненты отображения```: отвечают за представление данных пользователю. Обновляются в ответ наизменения в моделях, отражая актуальное состояние сайта.

## Модели

### 1 Класс ```Model```

#### Структура и назначение
Абстракстный класс Model, который служит шаблоном для создания моделей данных с возможностью обработки событий.
- Функция ```isModel``` проверяет, является ли объект экземпляром ```Model```

#### Конструктор 
- принимает на вход объект данных неявного типа и объект события типа ```IEvents```; 

#### Методы 
- ```emitChanges``` - регистрирует входящее событие в ```EventEmitter```.

#### Типы данных
- ```IEvents``` - интерфейс для системы управления событиями;
- ```T``` - общий тип данных, представляющий структуру данных модели.
#### Взаимодействие с другими частями приложения и использование в архитектуре
Класс ```Model``` является центральным звеном в архитектуре проекта, обеспечивает хранение данных и управление ими.

### 2 Класс ```Product```

#### Структура и назначение
Является моделью хранения и доступа данных товара: ID, заголовка, оисания, изображения, категории, цены.
Расширяется класс абстрактным классом ```Model``` по интерфейсу ```IProduct```.
#### Поля
- ```id (string)``` - уникальный идентификатор продукта;
- ```title (string)``` - название продукта;
- ```description (string)``` - описание продукта;
- ```image (string)``` - ссылка на изображение продукта;
- ```category (string)``` - категория продукта;
- ```price (number)``` - цена продукта.

#### Конструктор 
Инициализирует экземпляр класса представленными данными.

#### Типы данных
- ```IProduct``` - интерфейс, описывающий структуру данных продукта.

#### Взаимодействие с другими частями приложения и использование в архитектуре 
Класс ```Product``` используется в различных компонентах приложения для отображения информации о продуктах. Может быть связан с компонентами отображения, такими как карточки продуктов или списки продуктов.

### 3 Класс ```AppState```

#### Структура и назначение
Является моделью данных приложения. Класс содержит в себе все основные группы данных страницы и методы работы с ними.
В классе распределяются данные частей приложения: каталог, превью, корзина, форма заказа и ошибки валидации.
Расширяется класс базовым абстрактным классом ```Model``` по интерфейсу ```IAppState```.

#### Поля 
- ```catalog``` - массив продуктов в каталоге. Каждый продукт представлен объектом, который соответствует типу ```IProduct```;
- ```basket``` - список ID продуктов, добавленных в корзину. Это позволяет отслеживать, какие продукты пользователь добавил в корзину для последующей покупки;
- ```preview``` - ссылка или ID на элемент, который в данный момент находится в режиме предварительного просмотра;
- ```order``` - данные текущего заказа. Может включать в себя информацию о продуктах в заказе, их количестве, цене и другие данные, необходимые для оформления заказа;
- ```paymentForm``` - форма заказа,включающая в себя выбор системы оплаты и адрес доставки;
- ```paymentForm``` - фрма заказа,включающая в себя контактные данные: email и телефон;
- ```formErrors``` - объект с ошибками формы заказа.

#### Конструктор 
Инициализирует модель начальными значениями состояния проекта.

#### Методы 
- ```emitBasketChange``` - Приватный метод, доступный только внутри самого класса, генерирует события об изменении состояния корзины;
- ```clearBasket``` - Очищает корзину, удаляя все элементы из массива basket;
- ```addToBasket``` - Добавляет продукт в текущий заказ, добавляя его ID в массив basket;
- ```removeFromBasket``` - Удаляет продукт из корзины, удаляя его из массива basket;
- ```setCatalog``` - Устанавливает каталог продуктов, преобразуя массив объектов ```IProduct``` в массив объектов ```Product```; После вызывается событие items:changed, чтобы уведомить другие части приложения об изменении каталога;
- ```setPreview``` - Устанавливает продукт для предварительного просмотра, обновляя свойство preview и вызывая событие preview:changed, чтобы уведомить другие части приложения об изменении предварительного просмотра; 
- ```clearOrder``` - Очищает заказ, удаляя все элементы из массива order.items;
- ```setPaymentField``` - Метод для установки значения поля заказа и проверки его валидности. Если заказ валидный, генерируется событие order:ready;
- ```setContactsField``` - Метод для установки значения контактного поля в заказе и проверке его валидности. Если контактные данные валидны, генерируется событие order:ready;
- ```validatePayment``` - Приватный метод для проверки валидности полей заказа. Если поле address пустое, появляется ошибка. Обновляется объект formErrors и генерируется событие formErrors:change;
- ```validateContacts``` - Приватный метод для валидности контактных данных. Если поля ```email``` и ```phone``` пустые, появляются соответствующие ошибки. Обновляется объект ```formErrors``` и генерируется событие formErrors:change;
- ```updateFormErrors``` - Приватный метод, который обновляет ошибки формы и генерирует соответствующие события.

#### Типы данных
- ```IAppState``` - интерфейс для общего состояния проекта. Включает в себя поля для каталога продуктов, корзины, текущего заказа, превью продукта и ошибок формы;
- ```IOrder``` - описывает структуру заказа в проекте. Включает информацию о способе оплаты, адресе доставки, электронной почте, номере телефона, общей стоимости и списка заказанных товаров;
- ```IPaymentForm``` - используется для определения полей формы заказа. Включает в себя поля, связанные с процессом оформления заказа, такие как адрес доставки и способ оплаты;
- ```IContactsForm``` - определяет поля для формы контактных данных пользователя. Включает такие поля, как электронная почта и номер телефона;
- ```IProduct``` - описывает структуру данных продукта. Он включает в себя идентификатор, название, описание, цену, категорию и ссылку на изображение продукта;
- ```FormErrors``` - представляет собой структуру для хранения ошибок валидации формы. Это может быть объект с ключами, соответствующими именами полей формы, и значениями, представляющими текст ошибок.

#### Взаимодействие с другими частями приложения и использование в архитектуре 
Класс ```AppState``` взаимодействует с компонентами отображения, предоставляя им данные о состоянии приложения, реагируя на действия пользователя. Модель генерирует события для обновления пользовательского интерфейса в ответ на изменения состояния.

## Слушатели событий

### 1 Класс ```Api```

#### Структура и назначение
Хранит основные поля и методы, необходимые при работк с сервером.\
Получает и хранит базовый url ```(baseUrl)``` и опции запроса ```(options)```.\
Методы позволяют обрабатывать запрос, отправить и получить данные.

##### Конструктор
Инициализирует класс с указанным базовым URL и настройками запросов.

##### Методы
- ```get(uri: string)``` - выполняет GET-запрос к указанному URI;
- ```post(uri: string, data: object, method: ApiPostMethods = 'POST')``` - выполняет POST-запрос с данными ```data``` по указанному URI.

#### Взаимодействие с другими частями приложения и использование в архитектуре 
Класс ```Api``` не взаимодействует напрямую с пользовательским интерфейсом, но предоставляет данные для моделей и компонентов отображения. Ответы от сервера, полученные через ```Api```, могут быть использованы для обновления состояния проекта и отображения информации пользователю.

### 2 Класс ```EventEmitter```

#### Структура и назначение
Обеспечивает работу событий. Функциональность класса: возможность установить или снять слушателей событий, вызвать слушателей при возникновении события. Функционирует как центральный брокер событий в проекте.
- ``` _events``` - приватное свойство, хранящее множество подписчиков для каждого события.

##### Конструктор
Инициализирует ``` _events``` как карту для управления подписками на события.

##### Методы
- ```on``` - подписывает обработчик на определенное событие. Если событие еще не существует в ``` _events```, оно инициализируется;
- ```emit``` - генерирует событие с указанным именем и опциональными данными. Вызывает все подписанные на это событие обработчики, передавая им данные;

#### Типы данных
- ```EventName``` - имя события;
- ```Subscriber``` - тип функции-обработчика события;
- ```IEvents``` - интерейс для управления событиями.

#### Взаимодействие с другими частями приложения и использование в архитектуре 
Класс ```EventEmitter``` используется во всем проекте для управления событиями между различными компонентами. Это позволяет создавать слабо связанные компоненты, которые могут взаимодействовать друг с другом через систему событий, улучшая модульность и гибкость проекта. Класс ```EventEmitter``` играет ключевую роль в событийно-ориентированной архитектуре проекта, обеспечивая централизованный механизм для обработки событий, что способствует эффективной коммуникации между различными частями проекта.

### 3 Класс ```LarekApi```

#### Структура и назначение
Расширяет базовый класс ```Api```, что бы взаимодействовать с конкретным API для получения списка продуктов и размещения заказов.

#### Поля
- ```cdn``` - хранит входящий ```url```.

#### Конструктор 
- принимает, передает в родительский конструктор ```Api``` поля ```(baseUrl)``` и ```(options)```;
- принимает, сохраняет входящий ```url``` запроса в ```cdn```.

#### Методы 
- ```getProductList``` - для получения списка продуктов с сервера;
- ```getProductItem``` - для получения детальной информации о продукте с сервера;
- ```orderProducts``` - для размещения заказа на сервере.

#### Типы данных
- ```IProduct`` - описывает структуру данных продукта;
- ```IOrder``` - описывает структуру заказа в проекте;
- ```IOrderResult``` - описывает структуру данных результата заказа;
- ```ApiListResponse``` - тип для ответа списка элементов от API;
- ```ILarekApi``` - интерфейс, описывающий методы ```LarekApi```.

#### Взаимодействие с другими частями приложения и использование в архитектуре 
Класс ```LarekApi``` взаимодействует непосредственно с серверным API для получения и отправки данных.


## Компоненты отображения

### 1 Класс```Component```

#### Структура и назначение
Абстракстный класс ```Component```, который служит шаблоном для создания компонентов пользовательского интерфейса. Класс предоставляет методы для манипулирования элементами HTML и отображения данных. 

#### Конструктор 
- принемает на вход ```container``` типа ```HTMLElement```;

#### Методы 
- ```toggleClass``` - переключает наличие указанного класса CSS у элемента. Если передан параметр force, то класс будет добавлен или удален в зависимости от значения этого параметра (true и false);
- ```setText``` - устанавливает текстовое содержимое элемента, преобразовывая значение в строку. Этот метод защищен (protected), то есть доступен только внутри класса и его наследникам;
- ```setDisabled``` - устанавливает или снимает атрибут disabled у элемента в зависимости от значения параметра state;
- ```render``` - обновляет свойства компонента на основе переданных данных и возвращает корневой DOM-элемент. Использует метод Object.assign для копирования свойств из объекта data в текущий экземпляр компонента.

#### Типы данных
- ```T``` - общий тип данных, представляющий структуру данных с которыми будет работать компонент.

#### Взаимодействие с другими частями приложения и использование в архитектуре
Класс ```Component``` служит основой для всех компонентов пользовательского интерфейса. Он предоставляет методы для управления DOM-элементами, что упрощает создание и обновление компонентов.

### 2 Класс```Modal```

#### Структура и назначение
Класс ```Modal``` управляет поведением всех модальных окон в приложении. Отвечает за открытие, закрытие, отображение контента в модальном окне. Он наследуется от базового класса  ```Component```, расширяя его функциональность для работы с модальными окнами.

#### Конструктор 
Инициализирует элементы управления модального окна.

#### Методы 
- ```set content``` - устанавливает содержимое модального окна;
- ```open``` - метод для открытия модального окна. Добавляет класс активности к контейнеру модального окна и инициирует событие открытия;
- ```close``` - метод для закрытия модального окна. Удаляет класс активности и очищает содержимое модального окна. Инициирует событие закрытия;
- ```render``` - метод для рендеринга модального окна.

#### Типы данных
- ```IModelData``` - интерфейс, представляющий информацию, необходимую для отображения в модальном окне.

#### Взаимодействие с другими частями приложения и использование в архитектуре
Класс ```Modal``` используется для отображения важной информации, форм или подтверждений во всплывающем окне,не переходя на другую страницу. Он взаимодействует с пользователем и может генерировать события, которые обрабатываются в других частях приложения.

### 3 Класс```Form```

#### Структура и назначение
Класс ```Form``` расширяет базовый компонент ```Component```, предоставляя функционал для управления формами в проекте.

#### Конструктор 
Инициализирует элементы управления формы и подписывается на события ввода и отправки формы.

#### Методы 
- ```handleInput``` - обрабатывает ввод в поля формы, вызывая ```onInputChange``` для каждого измененного поля;
- ```handleSubmit`` - обрабатывает событие отправки формы, предотвращая стандартное поведение и инициируя событие отправки;
- ```onInputChange``` - вызывается при изменении значений полей формы. Эмитирует событие изменения с новыми значениями;
- ```set disableBtn``` - устанавливает состояние валидности формы. Если форма валидна, кнопка отправки активируется, иначе она деактивируется;
- ```set errors``` - устанавливает текст ошибок формы. Если есть ошибки, они отображаются в предназначенном для этого элементе.
- ```render``` - рендерит форму с новым состоянием, обновляя валидность и ошибки.

#### Типы данных
- ```IFormState``` - тип данных, представляющий состояние формы, включая валидность и ошибки;
- ```T``` - обобщенный тип данных, представляющий структуру данных, с которой работает форма.

#### Взаимодействие с другими частями приложения и использование в архитектуре
Класс ```Form``` используется для сбора и обработки данных, вводимых пользователем. Он взаимодействует с системой событий для отправки данных и получения обратной связи от других компонентов проекта, таких как модели и слушатели событий. ```Form``` является ключевым компонентом для создания интерактивных форм, поддерживая двустороннее связывание данных и упрощая валидацию и обработку пользовательского ввода. 


### 4 Класс```Basket```

#### Структура и назначение
Класс ```Basket``` является компонентом пользовательского интерфейса, который управляет отображением корзины на странице. Он наследуется от базового класса ```Component``` и использует методы для управления состоянием корзины, включая список товаров, их общую стоимость и логику активации кнопки оформления заказа.

#### Поля
- ```_list``` - список товаров в корзине;
- ```_total``` - элемент для отображения общей стоимости товаров;
- ```_button``` - кнопка для перехода к оформлению заказа.

#### Конструктор 
Инициализирует элементы управления корзины и подписывается на события.

#### Методы 
- ```setButtonStatus``` - включает или выключает кнопку оформления заказа в зависимости от наличия товаров в корзине;
- ```set items``` - устанавливает элементы корзины. Показывает сообщение "Корзина пуста", если список товаров пуст;
- ```set total``` - устанавливает и отображает общую стоимость товаров в корзине.

#### Типы данных
- ```IBasketView``` - интерфейс, описывающий структуру данных, используемых для отображения корзины.

#### Взаимодействие с другими частями приложения и использование в архитектуре
Класс ```Basket``` необходим для предоставления пользователями интерактивного интерфейса управления товарами в корзине. Он взаимодействует с системой событий для уведомления о действиях пользователя, таких как переход к оформлению заказа. `Basket` функционирует как часть пользовательского интерфейса в проекте, сочетая в себе элементы отображения и взаимодействия.

### 5 Класс ```Card```

#### Структура и назначение
Представляет собой компонент пользовательского интерфейса, который используется для отображения карточек продуктов или других объектов с определенным набором данных. Он наследует от базового класса ```Component```, что позволяет ему использовать общие методы для работы с DOM-элементами.
Расширяется базовым абстрактным классом  ```Component``` по интерфейсу ```ICard```.

#### Поля
- ```_title``` - ссылка на DOM-элемент, который отображает заголовок карточки;
- ```_image``` - ссылка на элемент изображения ```(<img>)```, который отображает картинку карточки. При изменении свойств image обновляется ```src``` этого элемента;
- ```_category``` - ссылка на DOM-элемент, который отображает категорию карточки. Категория также используется для установки CSS-класса на элемент, чтобы изменить его стиль в зависимости от значения;
- ```_price``` - ссылка на DOM-элемент, который отображает цену товара. При изменении свойств price обновляется текст этого элемента;
- ```_index``` - порядковый номер карточки товара в корзине;
- ```_button``` - кнопка действия на карточке продукта;
- ```_buttonText``` - Текст кнопки при добавлении элемента в корзину.

#### Конструктор
Инициализирует элементы карточки и устанавливает обработчики событий для кнопок.

#### Методы
- ```disablePriseButton``` - отключает кнопку, если нет цены;
- ```get и set``` - Для управления свойствами карточки продукта, включая ```id```, ```title```, ```price```, ```category```, ```index```, ```image```, ```description```, ```buttonTitle```.

#### Типы данных
- ```IActions``` - интерфейс для действий, которые можно выполнить с карточкой продукта.
- ```ICard``` - интерфейс, описывающий структуру данных для карточки продукта.

#### Взаимодействие с другими частями приложения и использование в архитектуре
Класс ```Card``` используется для отображения данных о продукте в удобном формате. Он может быть интегрирован в списки продуктов или каталоги, предоставляя пользователю важную информацию и возможность взаимодействия.

### 6 Класс ```PaymentForm```

#### Структура и назначение
Класс ```PaymentForm``` наследует функциональность от базового класса ```Form``` и расширяет её, предоставляя специализированные возможности для управления формой заказа. Класс включает в себя элементы управления для выбора способа оплаты и ввода адреса доставки. 

### Поля
- ```_cardButton``` - кнопка выбора оплаты картой;
- ```_cashButton``` - кнопка выбора оплаты наличными.

#### Конструктор
Инициализирует элементы управления формы и устанавливает обработчики событий.

#### Методы
- ```initializePaymentButtons``` - инициализирует кнопки выбора способа оплаты и назначает им обработчики событий;
- ```toggeStateButtons``` - переключает активное состояние кнопок способа оплаты;
- ```set address``` - устанавливает значение в поле адреса доставки.

#### Типы данных
- ```IPaymentForm``` - интерфейс, описывающий структуру данных для формы заказа;
- ```IActions``` - интерфейс для определения действий, привязанных к элементам управления.

#### Взаимодействие с другими частями приложения и использование в архитектуре
Класс ```PaymentForm``` используется для создания интерактивной формы заказа, где пользователи могут выбрать способ оплаты и указать адрес доставки. Класс обеспечивает интеграцию с системой событий для обработки пользовательского ввода и действий.

### 7 Класс ```ContactsForm```

#### Структура и назначение
Класс ```ContactsForm``` наследует функциональность от базового класса ```Form``` и расширяет её. Предназначен для  управления формой контактных данных пользователя. Включает поля для ввода телефона и электронной почты.

#### Конструктор
Инициализирует форму контактных данных.

#### Методы
- ```set email``` - устанавливает значение в поле электронной почты;
- ```set phone`` - устанавливает значение в поле телефона.

#### Типы данных
- ```IContactsForm``` - интерфейс, описывающий структуру данных для формы заказа.

#### Взаимодействие с другими частями приложения и использование в архитектуре
Класс ```ContactsForm``` используется для создания формы, через которую пользователи могут ввести свои контактные данные, такие как телефон и электронная почта. Поддерживает интеграцию с системой событий для обработки ввода данных и их валидации.

### 8 Класс ```Page```

#### Структура и назначение
Класс ```Page``` управляет основными элементами интерфейса страницы, включая счетчик корзины, каталог продуктов и обертку страницы.  

### Поля
- ```_counter``` - элемент счетчика корзины;
- ```_catalog``` - контейнер для элементов каталога продуктов;
- ```_wrapper``` - обертка страницы;
- ```_basket``` - элемент корзины.

#### Конструктор
Инициализирует элементы страницы и назначает обработчики событий.

#### Методы
- ```set counter``` - обновляет счетчик товаров в корзине;
- ```set catalog`` - заполняет каталог продуктов;
- ```set locked``` - управляет блокировкой страницы.

#### Типы данных
- ```IPage``` - интерфейс, описывающий структуру данных для компонента.

#### Взаимодействие с другими частями приложения и использование в архитектуре
Класс ```PaymentForm``` является центральным компонентом для управления основными элементами интерфейса на странице. Он обеспечивает обновление элементов в ответ на действия пользователя или изменения в состоянии проекта.

### 9 Класс ```Success```

#### Структура и назначение
Класс ```Success``` расширяет базовый класс ```Component``` и управляет отображением сообщения об успешном выполнении операции, например, после оформления заказа.  

### Поля
- ```_closeButton``` - кнопка для закрытия сообщения об успехе;
- ```_totalElement``` - Элемент для отображения информации о списанных средствах.

#### Конструктор
Инициализирует элементы интерфейса и назначает обработчики событий.

#### Методы
- ```set total``` - Устанавливает текст, отображаемый в элементе ```_totalElement```. Используется для обновления информации о стоимости или других данных, связанных с успешным завершением операции.

#### Типы данных
- ```ISuccess`` - интерфейс, описывающий структуру данных для компонента.
- ```ISuccessActions` - интерфейс действий, которые могут быть выполнены в компоненте.
#### Взаимодействие с другими частями приложения и использование в архитектуре
Класс ```Success``` используется для информирования пользователя об успешно завершенных операциях, таких как оформление заказа. Этот компонент представляет четкую обратную связь о результате действий пользователя.