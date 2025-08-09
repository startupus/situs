# Схемы баз данных для продуктов Situs

## Общие принципы

1. **Изоляция данных**: Каждый продукт имеет свои таблицы
2. **Связь через Product**: Все сущности продукта связаны с `Product.id`
3. **Уникальность в рамках продукта**: slug, названия уникальны только внутри продукта
4. **Общие поля**: created_at, updated_at для всех сущностей

## Основная схема (общие сущности)

```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  email     String   @unique
  password  String
  role      UserRole @default(BUSINESS)
  status    UserStatus @default(ACTIVE)
  
  subscriptionPlan String? @default("basic")
  limits          String? @default("{\"projects\":1,\"products\":2,\"aiTokens\":1000}")
  profile         String? @default("{\"name\":\"\",\"avatar\":\"\",\"bio\":\"\"}")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  ownedProjects    Project[] @relation("ProjectOwner")
  projectAccesses  ProjectAccess[]
  grantedAccesses  ProjectAccess[] @relation("GrantedAccess")
  media            Media[]
  
  // Product-specific relations
  blogPosts        Post[]

  @@map("users")
}

model Project {
  id          String      @id @default(cuid())
  name        String
  description String?
  slug        String      @unique
  
  domain       String?
  customDomain String?
  isPublished  Boolean     @default(false)
  
  settings String? @default("{\"theme\":\"auto\",\"language\":\"ru\"}")
  theme    String? @default("{\"primaryColor\":\"#3B82F6\",\"secondaryColor\":\"#8B5CF6\"}")
  
  ownerId   String
  status    ProjectStatus @default(ACTIVE)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  owner     User   @relation("ProjectOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  products  Product[]
  accesses  ProjectAccess[]
  media     Media[]
  
  @@map("projects")
}

model ProjectAccess {
  id        String           @id @default(cuid())
  projectId String
  userId    String
  role      ProjectRole
  grantedBy String
  grantedAt DateTime         @default(now())
  
  project       Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user          User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  grantedByUser User    @relation("GrantedAccess", fields: [grantedBy], references: [id])
  
  @@unique([projectId, userId])
  @@map("project_accesses")
}

model Product {
  id          String      @id @default(cuid())
  name        String
  description String?
  type        ProductType
  status      ProductStatus @default(DRAFT)
  
  subdomain    String?
  pathPrefix   String?
  
  settings     String?     @default("{}")
  pricingPlan  String?     @default("basic")
  
  projectId   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  // Product-specific relations
  pages              Page[]
  ecommerceProducts  EcommerceProduct[]
  categories         Category[]
  carts              Cart[]
  orders             Order[]
  customers          Customer[]
  posts              Post[]
  blogCategories     BlogCategory[]
  comments           Comment[]
  tags               Tag[]
  
  @@unique([projectId, name])
  @@map("products")
}

model Media {
  id          String    @id @default(cuid())
  filename    String
  originalName String
  mimeType    String
  size        Int
  url         String
  thumbnailUrl String?
  
  alt         String?
  title       String?
  description String?
  
  projectId   String
  uploadedBy  String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [uploadedBy], references: [id], onDelete: Cascade)
  
  @@map("media")
}
```

## Продукт: WEBSITE

```prisma
model Page {
  id          String     @id @default(cuid())
  title       String
  slug        String
  content     String?    // Redaktus content blocks as JSON string
  pageType    PageType   @default(PAGE)
  status      PageStatus @default(DRAFT)
  isHomePage  Boolean    @default(false)
  
  // SEO
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  
  // Template and Layout
  template    String?
  layout      String?
  
  productId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([productId, slug])
  @@map("pages")
}

// Блоки контента можно вынести в отдельную таблицу для более гибкой работы
model Block {
  id      String @id @default(cuid())
  pageId  String
  type    String // hero-block, text-block, image-block, etc
  props   String // JSON with block configuration
  order   Int    // Display order
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  page Page @relation(fields: [pageId], references: [id], onDelete: Cascade)
  
  @@map("blocks")
}
```

## Продукт: ECOMMERCE

```prisma
model EcommerceProduct {
  id          String @id @default(cuid())
  name        String
  description String?
  slug        String
  sku         String?
  
  price      Decimal
  salePrice  Decimal?
  
  stockQuantity Int     @default(0)
  manageStock   Boolean @default(true)
  
  images     String? // JSON array of image URLs
  attributes String? // JSON with product attributes
  
  status    ProductStatus @default(DRAFT)
  featured  Boolean       @default(false)
  
  // SEO
  metaTitle       String?
  metaDescription String?
  
  productId  String
  categoryId String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  product  Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  cartItems Cart[]
  
  @@unique([productId, slug])
  @@unique([productId, sku])
  @@map("ecommerce_products")
}

model Category {
  id          String @id @default(cuid())
  name        String
  slug        String
  description String?
  image       String?
  
  parentId   String?
  sortOrder  Int     @default(0)
  isVisible  Boolean @default(true)
  
  productId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  product  Product           @relation(fields: [productId], references: [id], onDelete: Cascade)
  parent   Category?         @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[]        @relation("CategoryHierarchy")
  products EcommerceProduct[]
  
  @@unique([productId, slug])
  @@map("categories")
}

model Cart {
  id        String @id @default(cuid())
  sessionId String?
  userId    String?
  
  ecommerceProductId String
  quantity           Int
  price              Decimal // Price at time of adding
  
  productId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  product         Product          @relation(fields: [productId], references: [id], onDelete: Cascade)
  ecommerceProduct EcommerceProduct @relation(fields: [ecommerceProductId], references: [id], onDelete: Cascade)
  
  @@map("carts")
}

model Order {
  id          String @id @default(cuid())
  orderNumber String @unique
  
  // Customer info
  customerEmail String
  customerName  String
  customerPhone String?
  
  // Addresses
  shippingAddress String // JSON
  billingAddress  String // JSON
  
  // Order details
  items           String  // JSON array of order items
  subtotal        Decimal
  taxAmount       Decimal @default(0)
  shippingAmount  Decimal @default(0)
  discountAmount  Decimal @default(0)
  totalAmount     Decimal
  
  // Status
  status        OrderStatus        @default(PENDING)
  paymentStatus OrderPaymentStatus @default(PENDING)
  
  // Methods
  paymentMethod  String?
  shippingMethod String?
  
  notes String?
  
  productId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@map("orders")
}

model Customer {
  id        String @id @default(cuid())
  email     String
  name      String
  phone     String?
  
  addresses   String? // JSON array of addresses
  orderCount  Int     @default(0)
  totalSpent  Decimal @default(0)
  
  productId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([productId, email])
  @@map("customers")
}
```

## Продукт: BLOG

```prisma
model Post {
  id      String @id @default(cuid())
  title   String
  slug    String
  content String // HTML/Markdown content
  excerpt String?
  
  featuredImage String?
  status        PostStatus @default(DRAFT)
  publishedAt   DateTime?
  
  // SEO
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  
  // Stats
  viewCount    Int @default(0)
  commentCount Int @default(0)
  isFeatured   Boolean @default(false)
  
  tags String? // JSON array of tags
  
  productId  String
  authorId   String
  categoryId String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  product  Product      @relation(fields: [productId], references: [id], onDelete: Cascade)
  author   User         @relation(fields: [authorId], references: [id], onDelete: Cascade)
  category BlogCategory? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  comments Comment[]
  
  @@unique([productId, slug])
  @@map("posts")
}

model BlogCategory {
  id          String @id @default(cuid())
  name        String
  slug        String
  description String?
  image       String?
  
  parentId  String?
  postCount Int     @default(0)
  sortOrder Int     @default(0)
  
  productId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  product  Product       @relation(fields: [productId], references: [id], onDelete: Cascade)
  parent   BlogCategory? @relation("BlogCategoryHierarchy", fields: [parentId], references: [id])
  children BlogCategory[] @relation("BlogCategoryHierarchy")
  posts    Post[]
  
  @@unique([productId, slug])
  @@map("blog_categories")
}

model Comment {
  id      String @id @default(cuid())
  postId  String
  
  authorName    String
  authorEmail   String
  authorWebsite String?
  content       String
  
  status   CommentStatus @default(PENDING)
  parentId String?
  
  ipAddress String?
  userAgent String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  post   Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  parent Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies Comment[] @relation("CommentReplies")
  
  @@map("comments")
}

model Tag {
  id        String @id @default(cuid())
  name      String
  slug      String
  postCount Int    @default(0)
  
  productId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  @@unique([productId, slug])
  @@map("tags")
}
```

## Enums

```prisma
enum UserRole {
  BUSINESS
  AGENCY
  ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  BANNED
}

enum ProjectStatus {
  ACTIVE
  SUSPENDED
  ARCHIVED
  DELETED
}

enum ProjectRole {
  OWNER
  ADMIN
  EDITOR
  VIEWER
}

enum ProductType {
  WEBSITE
  ECOMMERCE
  BLOG
  LANDING
  CRM
  TASK_MANAGER
  ANALYTICS
  API
}

enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
  DELETED
}

enum PageType {
  HOME
  PAGE
  LANDING
}

enum PageStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
  ARCHIVED
  DELETED
}

enum PostStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
  ARCHIVED
  DELETED
}

enum CommentStatus {
  PENDING
  APPROVED
  SPAM
  TRASH
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum OrderPaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}
```

## Правила валидации

1. **Уникальность slug**: В рамках одного продукта
2. **Обязательная связь**: Все сущности продукта должны быть связаны с `Product.id`
3. **Каскадное удаление**: При удалении продукта удаляются все его данные
4. **Мягкое удаление**: Статус `DELETED` вместо физического удаления
5. **Версионирование**: При изменении схемы продукта создается миграция
