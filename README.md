# E-commerce Web Application

This project is an e-commerce web application developed as part of the CENG495 Cloud Computing assignment at Middle East Technical University. The application is deployed on Vercel and uses MongoDB Atlas as its NoSQL database.

## Live Demo
[https://ecommerce-aly.vercel.app/](https://ecommerce-aly.vercel.app/)

## Login Instructions
- **Regular User:**  
  You can register your own credentials from the website. However, a sample login user already registered is:\
  username: user1\
  password: user1
  
- **Admin User:**  
  I have created an admin user for the CENG495 grading team:\
  username: Admin1\
  password: cloudisbest
## Features

### Home Page
- **Item Listing:** All items available for sale are listed on the homepage.
- **Category Filtering:** Users can filter items by categories: Vinyls, Antique Furniture, GPS Sport Watches, and Running Shoes.
- **Hero Section:** Displays a selection of top images from the items, which are clickable and navigate to the item details page.
- **User Authentication:** Unauthenticated users can browse items; a login/sign-up mechanism is provided.

### Item Details
- **Detailed View:** Each item’s details are presented, including name, description, price, seller, and category-specific attributes (battery life, age, size, material).
- **User Interactions:** 
  - **Rating:** Users can rate items on a scale of 1 to 10, with ratings updating the average.
  - **Review:** Users can leave reviews for items; they can leave multiple reviews for the same items if they wish.

### Regular User Capabilities
- **User Profile:** A dedicated user profile page displays:
  - **Username and Role:** The username and whether the user is an "Admin" or "Regular User".
  - **Average Rating:** The average of all ratings given by the user.
  - **All Ratings & Reviews:** Lists of all ratings and reviews the user has submitted.

### Admin Capabilities
- **Admin Dashboard:** Accessible only by admin users.
  - **Add Item:** Admins can add new items with required attributes.
  - **Remove Item:** Admins can remove items. This also updates affected users by deleting associated ratings and reviews.
  - **Add User:** Admins can create new user or admin accounts.
  - **Remove User:** Admins can remove users/other admins. This also updates affected items by deleting associated ratings and reviews.

## Technology Stack
- **Framework:** Next.js (React)
- **Database:** MongoDB Atlas (NoSQL)
- **Deployment:** Vercel
- **UI Library:** Material UI
- **Animations:** Framer Motion

## Design Decisions
- **Next.js:** Chosen for its native support for server-side rendering, routing, and ease of deployment on Vercel.
- **MongoDB Atlas:** Utilized for its flexibility with dynamic schema and cloud-hosted database services.
- **Material UI:** Provides a robust set of pre-designed components that facilitate a modern and responsive design.
- **Framer Motion:** Adds smooth animations to enhance user experience.

## How to Use
1. **Browsing Items:**  
   - Navigate to the homepage to view all items.
   - Use the category filters to narrow down the selection.
2. **Item Interaction:**  
   - Click an item to view its details.
   - Rate the item and leave a review using the interactive interface.
3. **User Authentication:**  
   - **Regular Users:**  
     - Sign up or log in using the provided forms.
     - Once logged in, click on your username (underlined in the navbar) to access your user profile.
   - **Admin Users:**  
     - Admin users can log in with their credentials to access the admin dashboard.
     - From the admin dashboard, admins can add or remove items and users.
4. **User Profile:**  
   - The profile page shows your username, role, average rating, and lists of all your ratings and reviews.
5. **Favicon:**  
   - The website uses a favicon located at `public/icon.png`.


## Repository and Deployment
- **Repository:**  
  The source code is hosted on GitHub (private for now) and is included in the submitted archive.
- **Deployment:**  
  The application is deployed on Vercel at [https://ecommerce-aly.vercel.app/](https://ecommerce-aly.vercel.app/).

## Additional Notes
- The application is built as a single-page application using Next.js with the App Router.
- The database was pre-populated with more than 10 items and 5 users.
- All functionality (home page browsing, rating, reviewing, admin tasks, and user profile) has been implemented and tested.
- This project is an individual assignment and represents my own work.
