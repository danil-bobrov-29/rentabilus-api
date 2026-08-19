# Rentabilus API

Backend-приложение Rentabilus, построенное на NestJS в формате модульного монолита.

## Технологии

- **Node.js** — среда выполнения.
- **TypeScript** — основной язык разработки.
- **NestJS 11** — HTTP API, dependency injection и система модулей.
- **PostgreSQL** — основная реляционная база данных.
- **Prisma** — описание схемы, миграции и типизированный доступ к данным.
- **@prisma/adapter-pg** — PostgreSQL driver adapter для Prisma Client.
- **JWT** — аутентификация запросов с помощью access-токенов.
- **Argon2id** — хеширование секретов и паролей.
- **class-validator / class-transformer** — валидация и преобразование DTO.
- **Swagger/OpenAPI** — документация HTTP API.
- **Jest** — unit- и e2e-тестирование.
- **ESLint / Prettier** — статический анализ и форматирование.

## Архитектура

Проект является модульным монолитом: приложение собирается, разворачивается и запускается как единое целое, но бизнес-функциональность разделена на изолированные модули.

```text
src/
├── app.module.ts
├── main.ts
├── modules/
│   ├── <module-a>/
│   ├── <module-b>/
│   └── <module-c>/
└── shared/
    └── infrastructure/
```

`AppModule` является точкой композиции: подключает конфигурацию, общую инфраструктуру и бизнес-модули. Бизнес-логика в нём не размещается.

## Структура бизнес-модуля

Каждая бизнес-область располагается в `src/modules/<module>` и оформляется как самостоятельный NestJS-модуль.

```text
src/modules/<module>/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── errors/
├── application/
│   ├── ports/
│   └── use-cases/
├── infrastructure/
│   ├── persistence/
│   └── integrations/
├── presentation/
│   └── http/
│       ├── controllers/
│       ├── decorators/
│       ├── dto/
│       ├── guards/
│       └── types/
├── <module>.module.ts
└── index.ts
```

Необязательные директории создаются только при реальной необходимости.

### Domain

Содержит бизнес-модель модуля:

- сущности и value objects;
- интерфейсы репозиториев;
- доменные ошибки;
- бизнес-инварианты.

Domain не зависит от NestJS, Prisma, HTTP, PostgreSQL и внешних сервисов.

### Application

Содержит сценарии использования приложения:

- команды и запросы;
- use cases;
- входные и выходные контракты;
- порты для внешних механизмов;
- координацию доменных объектов.

Application зависит от domain, но не от конкретных реализаций базы данных, транспорта или внешних интеграций.

### Infrastructure

Содержит технические реализации контрактов:

- Prisma-репозитории;
- реализации криптографических сервисов;
- клиенты внешних API;
- файловые и сетевые адаптеры;
- реализацию application-портов.

Зависимость направлена к контракту: infrastructure реализует интерфейс, объявленный в domain или application.

### Presentation

Отвечает за внешний интерфейс приложения:

- HTTP-контроллеры;
- request и response DTO;
- валидацию входных данных;
- guards и decorators;
- Swagger-описания;
- преобразование ошибок в HTTP-ответы.

Контроллеры должны вызывать application use cases и не содержать бизнес-логику или Prisma-запросы.

## Направление зависимостей

```text
presentation ──────► application ──────► domain
                           ▲
                           │
                    infrastructure
```

Основные правила:

- domain ни от кого не зависит;
- application зависит только от domain и собственных портов;
- infrastructure зависит от контрактов application/domain;
- presentation обращается к application;
- конкретные реализации связываются с контрактами в NestJS-модуле через DI.

## Границы модулей

Каждый модуль владеет своей бизнес-логикой и данными. Другие модули не должны импортировать его внутренние use cases, репозитории и infrastructure-классы.

Публичный API объявляется в `index.ts`:

```ts
export { ExampleModule } from './example.module';
export { ExamplePublicService } from './application/example-public.service';
export type { ExampleResult } from './application/example.types';
```

Потребитель использует только публичную точку входа:

```ts
import { ExampleModule, ExamplePublicService } from '@example';
```

Взаимодействие модулей возможно через:

- публичные application-сервисы;
- явно экспортированные DI-токены;
- события;
- стабильные входные и выходные контракты.

Прямое обращение к таблицам, принадлежащим другому модулю, не допускается.

## Shared

`src/shared` содержит переиспользуемую техническую инфраструктуру, не связанную с конкретной бизнес-областью.

Допустимые примеры:

- подключение к базе данных;
- логирование;
- конфигурация;
- технические HTTP-компоненты;
- общие утилиты без бизнес-правил.

В `shared` нельзя переносить код только потому, что он используется в двух местах. Если код выражает бизнес-понятие, он должен принадлежать соответствующему модулю.

## Prisma и PostgreSQL

Prisma-схема находится в [`prisma/schema.prisma`](prisma/schema.prisma), миграции — в `prisma/migrations`.

Общий `PrismaModule` расположен в `src/shared/infrastructure/prisma` и предоставляет `PrismaService`. Сервис:

- получает настройки подключения через `ConfigService`;
- создаёт PostgreSQL driver adapter;
- открывает соединение при старте приложения;
- закрывает соединение при завершении работы.

`PrismaService` предоставляет только доступ к Prisma Client. Бизнес-запросы размещаются в infrastructure-репозиториях соответствующих модулей.

```text
Prisma schema
     │
     ▼
Prisma Client
     │
     ▼
module/infrastructure/persistence
     │
     ▼
domain repository interface
```

Prisma-типы не должны использоваться как доменные сущности или HTTP DTO.

## Алиасы импортов

Алиасы настраиваются в `tsconfig.json` и дублируются в `moduleNameMapper` для Jest.

```text
@shared/*   → src/shared/*
@<module>   → src/modules/<module>
@<module>/* → src/modules/<module>/*
```

Точный алиас модуля указывает на директорию с `index.ts`, а не на файл `index.ts`. Это необходимо для корректного разрешения скомпилированного `index.js` в Node.js.

Короткие относительные импорты допустимы между соседними файлами. Для переходов между слоями и модулями используются алиасы.

## Конфигурация

Установите зависимости и создайте `.env`:

```bash
npm install
cp .env.example .env
```

Основные переменные окружения:

```env
HTTP_PORT=3000
HTTP_HOST="http://localhost:3000"
GLOBAL_PREFIX="/api"

DATABASE_HOST="localhost"
DATABASE_PORT=5432
DATABASE_USER="postgres"
DATABASE_PASSWORD="postgres"
DATABASE_NAME="rentabilus"
DATABASE_SCHEMA="public"

JWT_ACCESS_SECRET="replace-with-long-random-secret"
JWT_ACCESS_TTL_SECONDS=900
```

Сгенерировать случайный секрет:

```bash
openssl rand -base64 48
```

Файл `.env` и реальные секреты нельзя добавлять в Git.

## Работа с Prisma

```bash
# генерация Prisma Client
npx prisma generate

# создание и применение миграции в development
npx prisma migrate dev

# применение существующих миграций в production
npx prisma migrate deploy

# форматирование схемы
npx prisma format
```

Изменение структуры базы выполняется через новую миграцию. Уже применённые миграции не редактируются.

## Запуск

```bash
# development с автоматической пересборкой
npm run start:dev

# обычный запуск
npm run start

# production
npm run build
npm run start:prod
```

Swagger UI доступен после запуска по адресу:

```text
http://localhost:3000/docs
```

## Проверка качества

```bash
npm run lint          # статический анализ
npm run format:check  # проверка форматирования
npm run test          # unit-тесты
npm run test:e2e      # e2e-тесты
npm run build         # production-сборка
npm run check         # полный набор проверок
```

## Добавление модуля

1. Создайте `src/modules/<module>`.
2. Определите бизнес-модель и интерфейсы репозиториев в domain.
3. Реализуйте сценарии и порты в application.
4. Добавьте реализации репозиториев и интеграций в infrastructure.
5. Добавьте HTTP-контроллеры и DTO в presentation.
6. Свяжите реализации с контрактами через DI в `<module>.module.ts`.
7. Объявите минимальный публичный API в `index.ts`.
8. Подключите модуль в `AppModule`.

При разработке соблюдайте ограничения:

- контроллер не обращается к Prisma напрямую;
- use case не импортирует HTTP DTO и infrastructure;
- модуль не обращается к внутренним компонентам другого модуля;
- `shared` не содержит бизнес-логику;
- секреты, пароли и токены не записываются в логи.
