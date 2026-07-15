# ProjectHub — Fullstack Project Management System

> **Current status:** Phase 0 — chưa bắt đầu
> *(Cập nhật dòng này mỗi khi sang phase mới, để AI agent biết bạn đang ở đâu.)*

---

## Project Goal

Xây dựng một hệ thống quản lý công việc và dự án tương tự Jira/Trello ở quy mô nhỏ, nhằm học và thực hành toàn bộ quy trình phát triển phần mềm thực tế: database, backend, frontend và deployment.

Mục tiêu chính là phát triển kỹ năng **Backend Developer** với hệ sinh thái NodeJS, đồng thời làm đủ frontend để tạo ra một sản phẩm hoàn chỉnh có thể đưa vào CV và dùng khi phỏng vấn.

---

## Nguyên tắc thực thi

**1. Cơ bản trước, phức tạp sau.**
Làm phần lõi chạy được trước (DB → backend → frontend), rồi mới đắp dần tính năng phức tạp. Không đụng tới Redis / WebSocket / microservices / AI cho tới khi MVP xong và deploy được.

**2. Phân biệt "cơ bản" với "cẩu thả".**
Có một nhóm nhỏ quyết định **rẻ để làm đúng ngay bây giờ, nhưng rất đắt để sửa về sau**. Những thứ này làm đúng từ đầu — chúng không phải là "phức tạp", chỉ là làm cơ bản cho tử tế:

| Làm đúng ngay từ đầu | Vì sao đắt nếu sửa sau |
|---|---|
| Kiến trúc 3 lớp (Controller/Service/Repository) | Retrofit = viết lại toàn bộ |
| TypeScript | Nhét vào sau rất đau |
| Migrations (không sửa DB bằng tay) | Rủi ro mất dữ liệu |
| Format response/lỗi thống nhất | Sửa sau = đụng mọi endpoint |
| Validation ở biên (Zod) | Đụng mọi endpoint + lỗ hổng bảo mật |
| Secret trong `.env`, không commit | Git history là vĩnh viễn |
| `created_at` / `updated_at` | Data cũ sẽ trống |
| Hash password + refresh token đúng cách | Lỗi bảo mật nghiêm trọng |

**3. Ngược lại, chủ động HOÃN những thứ này** (thêm lúc nào cũng rẻ như nhau):
Redis, WebSocket, background jobs, email, file upload, NestJS/CQRS/microservices, AI features, search nâng cao.

**4. "Scale" ở đây nghĩa là gì.**
Không phải chịu tải triệu user. Nghĩa là: *thêm được tính năng mới mà không phải viết lại*. Thứ mang lại điều đó là **kiến trúc phân lớp sạch**, không phải hạ tầng.

**5. Vertical slice.**
Có một lát cắt mỏng chạy xuyên suốt DB → backend → frontend càng sớm càng tốt (Phase 2), rồi mới đắp dày. Thấy sản phẩm sống sớm = giữ được động lực + phát hiện sớm lỗi tích hợp.

**6. Luôn giữ `main` chạy được.** Xong phase nào thì phase đó phải hoạt động end-to-end.

---

## Technology Stack

> Stack đã **chốt**, chọn theo tiêu chí *phổ biến nhất thị trường* + *nhiều tài liệu nhất cho người học*.

### Backend
- **NodeJS** + **ExpressJS** + **TypeScript**
- **Zod** — validation
- **jsonwebtoken** (JWT + Refresh Token), **bcrypt** — password hashing
- **helmet**, **cors**, **express-rate-limit** — bảo mật cơ bản
- REST API

### Database
- **PostgreSQL** — mặc định của hệ sinh thái Node, tooling mượt nhất, cộng đồng lớn nhất.
- **Prisma** — ORM phổ biến nhất cho Node/TS, tài liệu tốt nhất, có Prisma Studio để xem data, migration tự động.
  - *Tradeoff:* **Drizzle** nhanh hơn và đang lên rất nhanh; nhưng tài liệu ngắn gọn và ecosystem trẻ hơn → bất lợi cho người mới. Chọn Prisma **để học**.
  - Tránh **TypeORM**: tốc độ bảo trì đã chậm lại, rủi ro cho dự án mới.

### Frontend
- **React** + **TypeScript** + **Vite**
- **React Router** — routing
- **Axios** — HTTP client (kèm interceptor refresh token)
- **TanStack Query** — server state
- **Tailwind CSS** — styling

### Testing
- **Jest** — unit test cho Service (business logic)
- **Supertest** — integration test cho endpoint quan trọng (auth, phân quyền)

### Development Tools
- **Git / Github** (Conventional Commits)
- **Postman**, **Swagger / OpenAPI**
- **ESLint** + **Prettier**
- **GitHub Actions** — CI chạy lint + test

### Deployment
- **Docker** + **Docker Compose**
- **Nginx** — reverse proxy

---

## Project Architecture

```
Controller   → nhận request, validate input, gọi Service, trả response
   ↓            (KHÔNG chứa business logic, KHÔNG gọi DB)
Service      → business logic
   ↓            (KHÔNG phụ thuộc vào req/res của Express)
Repository   → truy cập dữ liệu, bọc quanh Prisma
   ↓            (Service KHÔNG gọi thẳng Prisma)
Database     → PostgreSQL
```

**Mục tiêu học:** Separation of Concerns, Clean Architecture principles, Service Layer Pattern, Repository Pattern.

**Quy ước xuyên suốt:** một format response/lỗi thống nhất, global error handler, config qua biến môi trường (`.env`, có `.env.example`).

---

## Development Phases

### Phase 0 — Foundation & Setup
**Goals:** Dựng nền tảng trước khi viết code nghiệp vụ.

- Khởi tạo repo, README, `.env.example`, `.gitignore`
- Cấu trúc thư mục theo 3 lớp
- Docker Compose chạy PostgreSQL cho dev local
- Cài Prisma, kết nối DB, chạy migration đầu tiên
- ESLint + Prettier + chuẩn commit

**Learning Objectives:** Project bootstrapping, tooling, kết nối DB, migration.

---

### Phase 1 — Authentication (Backend)
**Goals:** Xây nền tảng auth cho toàn hệ thống.

**Features**
- Register, Login, Logout
- JWT access token + Refresh Token (lưu DB, có rotation, thu hồi khi logout)
- Authorization middleware
- User profile
- Validation (Zod), helmet, cors, rate-limit cho login/register
- Global error handling + format response thống nhất

**Database Entities**

`User` — id, email, password_hash, full_name, avatar_url, created_at, updated_at
`RefreshToken` — id, user_id, token, expired_at, created_at

**Index:** `email` (unique)
**Testing:** unit + integration test cho toàn bộ luồng auth.

**Learning Objectives:** Express structure, authentication flow, middleware, password hashing, token lifecycle, validation, error handling.

---

### Phase 2 — Frontend cơ bản (Vertical Slice) ⭐
**Goals:** Có một lát cắt chạy xuyên suốt DB → backend → frontend. **Đây là cột mốc quan trọng nhất giai đoạn đầu.**

**Pages:** Register, Login, Dashboard (rỗng)

**Features**
- Gọi API thật, đăng ký/đăng nhập chạy được end-to-end
- Lưu token, protected route
- Axios interceptor tự refresh token khi gặp 401
- Xử lý loading / error cơ bản

**Learning Objectives:** React fundamentals, API integration, authentication flow phía client, CORS, token handling.

> Sau phase này bạn đã có **một sản phẩm sống**. Mọi phase sau chỉ là đắp thêm.

---

### Phase 3 — Workspace & RBAC
**Goals:** Tạo không gian làm việc và quản lý thành viên.

**Features**
- Create / Update / Delete workspace
- Invite / Remove member
- List workspaces
- Middleware phân quyền tái sử dụng được

**Database Entities**

`Workspace` — id, name, description, owner_id, created_at, updated_at
`WorkspaceMember` — workspace_id, user_id, role

**Roles:** OWNER, ADMIN, MEMBER — kèm **permission matrix** (vai trò nào làm được gì)
**Index:** workspace_id, user_id

**Learning Objectives:** Many-to-many relationship, authorization, RBAC, permission design, transaction (tạo workspace + gán owner phải cùng thành công).

---

### Phase 4 — Project Management
**Goals:** Tạo và quản lý project trong workspace.

**Features**
- Create / Update / Delete / Archive project
- List projects
- Kế thừa quyền từ workspace

**Database Entities**

`Project` — id, workspace_id, name, description, status, created_at, updated_at, deleted_at

**Index:** workspace_id

**Learning Objectives:** Business logic organization, resource ownership, permission inheritance, soft delete.

---

### Phase 5 — Task Management (cơ bản)
**Goals:** CRUD task chạy được. **Chưa làm search/pagination ở phase này.**

**Features**
- Create / Update / Delete task
- Assign user, change status, set priority, due date

**Database Entities**

`Task` — id, project_id, assignee_id, title, description, priority, status, due_date, created_at, updated_at, deleted_at

**Task Status:** TODO, IN_PROGRESS, REVIEW, DONE
**Task Priority:** LOW, MEDIUM, HIGH
**Index:** project_id, assignee_id

**Learning Objectives:** API design, business rules, quan hệ nhiều bảng.

---

### Phase 6 — Task nâng cao
**Goals:** Đắp thêm độ phức tạp lên phần task đã chạy được.

**Features**
- Pagination (offset trước — đơn giản; hiểu tradeoff với cursor)
- Filtering, Sorting, Search
- Phát hiện và xử lý N+1 query

**Learning Objectives:** Pagination strategies, query optimization, indexing, N+1.

---

### Phase 7 — Comment System
**Goals:** Thảo luận trên từng task.

**Features**
- Create / Update / Delete / List comments
- Ownership validation (chỉ chủ comment mới sửa/xóa)

**Database Entities**

`Comment` — id, task_id, user_id, content, created_at, updated_at
**Index:** task_id

**Learning Objectives:** Nested resources, ownership validation, relationship handling.

---

### Phase 8 — Frontend hoàn thiện
**Goals:** Giao diện đủ dùng toàn bộ hệ thống.

**Pages:** Workspace List, Project List, Task List, Task Detail (bổ sung vào phần đã có ở Phase 2)

**Features**
- Form handling, state management (TanStack Query)
- Hiển thị/quản lý task, comment
- Xử lý loading / error tử tế

**Learning Objectives:** Frontend architecture, server state management, API communication.

---

### Phase 9 — Production Preparation
**Goals:** Đưa dự án lên mức production-ready cơ bản.

**Features**
- Dockerize backend / frontend / database
- Docker Compose (chạy full stack bằng 1 lệnh)
- Nginx reverse proxy
- Logging có cấu trúc (pino)
- Healthcheck endpoint
- Environment management
- GitHub Actions: lint + test
- README hướng dẫn chạy đầy đủ

**Learning Objectives:** Containers, deployment, reverse proxy, infrastructure basics, CI.

---

## ✅ MVP kết thúc ở Phase 9

**Chỉ khi Phase 0–9 đã xong và deploy được** mới xét tới phần dưới. Một dự án hoàn thành 70% tính năng nhưng chạy được, deploy được, có test **luôn ăn đứt** dự án 100% tính năng dang dở.

---

## Optional Advanced Features

Chọn **tối đa 1–2** làm điểm nhấn, đừng ôm hết.

**Backend:** Redis caching, background jobs, email notifications, file upload, **WebSocket realtime cho task** *(ấn tượng nhất với interviewer)*.

**Nghiệp vụ:** Labels/tags, activity log, kéo-thả sắp xếp task (thêm cột `position`).

**Architecture:** NestJS migration, CQRS, event-driven, microservices — *để rất sau; với quy mô này rất dễ thành over-engineering.*

**AI Features:** tóm tắt task, báo cáo tuần, chat với dữ liệu project, dự đoán deadline, ước lượng workload.

---

## Expected Learning Outcomes

**Backend:** REST API design, Authentication & Authorization, Service Layer, Repository Pattern, Middleware, Validation, Error Handling.

**Database:** Database design, relationships, indexing, query optimization, migrations, transactions.

**Testing:** Unit test, integration test, viết code dễ test.

**Frontend:** React fundamentals, API integration, authentication flow, server state.

**DevOps:** Docker, deployment, environment management, CI cơ bản.

**Software Engineering:** Project organization, Git workflow, architecture thinking, production mindset, đánh giá tradeoff.

---

## Ghi chú

- Sau mỗi phase: cập nhật Swagger, viết test cho phần vừa xong, cập nhật dòng **Current status** ở đầu file.
- Ghi lại mọi quyết định kỹ thuật ("chọn X thay vì Y vì Z") vào `DECISIONS.md` — đây là kho câu trả lời phỏng vấn của bạn sau này.
- Hướng dẫn dành cho AI agent nằm ở `AGENTS.md`.
