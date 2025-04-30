# RESTful Job Portal 💼

A full-stack web application that allows employers to post job listings and candidates to apply, built with Java Spring Boot, React.js, PostgreSQL, and Docker. Designed for scalable, cloud-native deployment and built with modern DevOps practices in mind.

---

## 🚀 Features

- ✅ Employer and Applicant roles with profile management
- 📝 CRUD operations for job listings and applications
- 🔍 Search and filter jobs by title, location, and salary range
- 🔐 JWT-based authentication
- 🧩 RESTful API architecture using Spring Boot
- 📦 Containerized backend, frontend, and database with Docker Compose
- 📊 PostgreSQL database with JPA for ORM
- 🧪 Swagger UI for API documentation

---

## 🛠️ Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| **Frontend** | React.js, Node.js, Axios      |
| **Backend**  | Java, Spring Boot, Spring JPA |
| **Database** | PostgreSQL                    |
| **DevOps**   | Docker, Docker Compose        |
| **Docs & Tools** | Swagger, Postman, VSCode  |

---

## 📁 Project Structure

```
Job_Board_API/
├── backend/              # Spring Boot backend (REST APIs, DB integration)
│   ├── src/
│   └── Dockerfile
├── frontend/             # React frontend (job UI, API requests)
│   ├── src/
│   └── Dockerfile
├── docker-compose.yml    # Multi-container orchestration
└── README.md
```

---

## 🧪 Getting Started (Local Dev)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/job-board-api.git
cd job-board-api
```

### 2. Build backend JAR

```bash
cd backend
mvn clean package
```

### 3. Run full stack with Docker Compose

```bash
docker compose up --build
```

### 4. Access the app

- Frontend: http://localhost:3000  
- API: http://localhost:8080/api/jobs  
- Swagger UI: http://localhost:8080/swagger-ui.html

---

## 🧠 Learning Goals

- Practiced building RESTful services with Java Spring Boot
- Gained hands-on experience with full-stack containerization
- Strengthened understanding of DevOps workflows using Docker
- Applied frontend-backend integration using React and Axios

---

## 📌 Future Improvements

- Role-based access control with JWT
- Resume upload feature (S3 or local)
- Email notifications on application submission
- Deploy to cloud (AWS/GCP/Azure)

---

## 📬 Contact

**Aaron Rajan**  
[LinkedIn](https://linkedin.com/in/aaron-rajan) • [GitHub](https://github.com/Aaron-Rajan)
