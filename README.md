# Blogify 📝

Blogify is a full-stack blogging application where users can create and view blog posts with images.
The project focuses on backend development, image handling, and deployment.

---

## Features

- Create blog posts
- Upload images with blog posts
- View all blog posts
- Responsive UI using Bootstrap
- Image storage using Cloudinary
- Deployed on Render

Note:
- Edit post is not implemented
- Delete post is not implemented

---

## Tech Stack

- Backend: Node.js, Express.js
- Frontend: EJS, CSS, Bootstrap
- Database: MongoDB
- Image Storage: Cloudinary
- Deployment: Render

---

## Project Structure

Blogify/
- models/
- routes/
- views/
- public/
- app.js

---

## How It Works

- Express is used for server-side routing
- MongoDB stores blog post data
- Cloudinary handles image uploads
- Bootstrap and CSS are used for UI
- EJS renders dynamic pages

---

## How to Run Locally

1. Clone the repository  
   git clone https://github.com/adityabhawsar221/Blogify.git

2. Go to the project folder  
   cd Blogify

3. Install dependencies  
   npm install

4. Add environment variables for:
   - MongoDB connection string
   - Cloudinary credentials

5. Start the server  
   node app.js

6. Open in browser  
   http://localhost:3000

---

## Deployment

The project is deployed on Render.
Images are stored using Cloudinary.

---

## What I Learned

- Image upload with Cloudinary
- MongoDB and Express integration
- Backend project structuring
- Using Bootstrap for responsive UI
- Deploying full-stack applications

---

## Author

Aditya Bhawsar  
Final-year engineering student

---

## Future Improvements

- Edit blog posts
- Delete blog posts
- User authentication
