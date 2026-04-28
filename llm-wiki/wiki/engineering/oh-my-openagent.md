---
topic: Engineering
title: Oh-My-OpenAgent (OmO)
summary: A multi-model agent orchestration harness for OpenCode to enable autonomous team-based execution.
updated: 2026-04-28
sources: code-yeongyu; OpenCode Community; ohmyopenagent.com
raw: [2026-04-28-code-yeongyu-oh-my-openagent.md](../../raw/engineering/2026-04-28-code-yeongyu-oh-my-openagent.md); [2026-04-28-oh-my-openagent-docs.md](../../raw/engineering/2026-04-28-oh-my-openagent-docs.md)
---

# Oh-My-OpenAgent (OmO)

Oh-My-OpenAgent (OmO) là một hệ thống điều phối (orchestration) được xây dựng như một **harness/plugin** dành cho **OpenCode**. 

**Quan hệ:**
- **OpenCode**: Là nền tảng cơ bản (giống như động cơ), cung cấp môi trường agent terminal.
- **Oh-My-OpenAgent**: Là bộ công cụ nâng cao (giống như bộ não điều phối), giúp OpenCode có khả năng chạy đa agent song song.

## Hướng dẫn cấu hình nâng cao

OmO được thiết kế theo dạng "opinionated" (có sẵn các thiết lập tối ưu) nhưng vẫn cho phép tùy chỉnh sâu thông qua các file JSONC.

### Vị trí File cấu hình
- **Cấp độ dự án**: `.opencode/oh-my-openagent.json` (Ưu tiên cao nhất)
- **Cấp độ người dùng**: `~/.config/opencode/oh-my-openagent.json`

### Quyền hạn Đặc vụ (Permissions)
Bạn có thể kiểm soát mức độ tự chủ của các đặc vụ:
| Quyền | Giá trị | Mô tả |
| --- | --- | --- |
| **edit** | ask / allow / deny | Khả năng chỉnh sửa file |
| **bash** | ask / allow / deny | Chạy lệnh terminal |
| **webfetch** | ask / allow / deny | Gửi yêu cầu HTTP/Web |
| **external_directory** | ask / allow / deny | Truy cập file ngoài dự án |

### Phân loại Đặc vụ (Categories)
Các nhóm cấu hình mặc định:
| Category | Model Mặc định | Mô tả |
| --- | --- | --- |
| **visual-engineering** | gemini-3.1-pro | Frontend, UI/UX, thiết kế |
| **ultrabrain** | gpt-5.3-codex | Tư duy logic cực sâu |
| **deep** | gpt-5.3-codex | Tự giải quyết vấn đề phức tạp |
| **quick** | claude-haiku-4-5 | Các tác vụ nhỏ, cần tốc độ |
| **writing** | gemini-3-flash | Viết tài liệu và văn bản |

### Kỹ năng & Công cụ chuyên biệt (Skills & Tools)
- **Skills**: Các bộ chỉ dẫn và công cụ đi kèm (ví dụ: `playwright` cho trình duyệt, `git-master` cho quản lý commit).
- **MCPs**: 
  - **Exa**: Tìm kiếm web chất lượng cao.
  - **Context7**: Tra cứu tài liệu chính thức.
  - **Grep.app**: Tìm kiếm code trên GitHub.
- **Comment Checker**: Tự động kiểm tra chất lượng comment trong code.
- **Tmux Integration**: Hỗ trợ môi trường terminal tương tác đầy đủ.

## Đặc điểm nổi bật
- **Điều phối đa mô hình (Multi-model Orchestration)**: Tự động định tuyến các tác vụ đến các model AI phù hợp nhất.
- **Đội ngũ Agent chuyên biệt**: Sử dụng các agent như Sisyphus (cho các tác vụ lặp lại/dài hạn) và Prometheus (cho tư duy/lập luận).
- **Lệnh `ultrawork` (ulw)**: Kích hoạt quy trình tự động hoàn toàn từ tìm hiểu, lập kế hoạch đến thực thi.

## Hướng dẫn cài đặt

Cách tốt nhất để cài đặt OmO là sử dụng trình cài đặt tương tác (interactive installer).

### 1. Chạy lệnh cài đặt
Bạn nên sử dụng **Bun** (khuyến nghị) hoặc **NPM**:

```bash
# Sử dụng Bun
bunx oh-my-opencode install

# Hoặc sử dụng NPM
npx oh-my-opencode install
```

### 2. Cấu hình Subscriptions
Trình cài đặt sẽ hỏi bạn về các gói đăng ký AI hiện có (Claude Pro, ChatGPT Plus, Gemini, v.v.). Việc này giúp agent tự động chọn model tối ưu nhất cho từng loại công việc.

### 3. Đăng nhập Provider
Sau khi cài đặt xong, bạn cần xác thực các nhà cung cấp AI:

```bash
opencode auth login
```
Chọn nhà cung cấp (Anthropic, Google, GitHub...) và làm theo hướng dẫn trên trình duyệt.

### 4. Kiểm tra
Đảm bảo file `opencode.json` của bạn đã có `"oh-my-openagent"` trong mảng `plugins`.

## Cách sử dụng
Sau khi cài đặt, bạn có thể dùng từ khóa **`ultrawork`** (hoặc viết tắt là **`ulw`**) trực tiếp trong terminal để bắt đầu quy trình điều phối đa agent.

## Mối liên hệ với GSD (Get Shit Done)

Mặc dù cả OmO và GSD đều hướng tới mục tiêu tăng cường khả năng tự chủ và độ tin cậy của AI agent, chúng là hai dự án độc lập:

| Đặc điểm | Oh-My-OpenAgent (OmO) | Get Shit Done (GSD) |
|----------|-----------------------|---------------------|
| **Target Agent** | OpenCode | Claude Code |
| **Trọng tâm** | Điều phối đội ngũ & đa mô hình | Quản lý ngữ cảnh & Workflow theo giai đoạn |
| **Lệnh chính** | `ultrawork` (ulw) | `/gsd-new-project`, `/gsd-plan-phase` |
| **Lưu trữ trạng thái** | JSONC Config | `.planning/` Markdown files |

### Có thể dùng chung không?
Về mặt kỹ thuật, chúng không có liên kết trực tiếp. Tuy nhiên, một kỹ sư có thể áp dụng **tư duy GSD** (chia giai đoạn, lập spec rõ ràng) khi ra lệnh cho **OmO** thông qua `ultrawork` để đạt được kết quả tốt nhất. GSD tập trung vào *cách soạn thảo yêu cầu và kế hoạch*, trong khi OmO tập trung vào *cách vận hành các agent để thực thi*.

## See Also
- [GSD (Get Shit Done) Workflow](gsd-workflow.md)
