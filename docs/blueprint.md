# **App Name**: DineHub

## Core Features:

- Role Selection: Allows users to select their role (customer or staff) and navigate to the appropriate section of the app.
- Outlet Listing: Displays a list of available outlets with details like name, description, and image.
- Menu Display: Displays the menu for a selected outlet, including item details like name, description, price, and availability.
- Order Creation: Allows customers to create orders by selecting items from the menu and specifying quantities, with real-time updates using Supabase.
- Secure Authentication: Implements secure user authentication using Supabase Auth with magic links/email OTP and staff login using employee ID and password.
- Order Management Dashboard: Provides a dashboard for staff to manage orders, update order status, and view real-time updates.
- Intelligent Estimated Wait Time (ETA) Prediction: Utilize generative AI to learn from historical order data, menu item preparation times, current queue depth, and break times to predict the estimated wait time for new orders, offering a tool for customers to make informed decisions and helping staff manage expectations. Uses machine learning model

## Style Guidelines:

- Primary color: Vivid orange (#FF8C00) to represent energy and appetite.
- Background color: Light orange (#FFF3E0), a desaturated version of the primary for a warm, inviting feel.
- Accent color: Forest green (#228B22) to represent freshness and health, creating a contrast with the orange.
- Headline font: 'Space Grotesk' (sans-serif) for headlines and short amounts of body text; Body font: 'Inter' for longer text blocks. 'Space Grotesk' brings a modern and techy look suitable for the app, while 'Inter' is used for the body because of its readability
- Code font: 'Source Code Pro' (monospace) for displaying code snippets if needed.
- Use consistent and clear icons for navigation and order status, ensuring they are touch-friendly and accessible.
- Implement subtle animations and transitions using Framer Motion to enhance user experience and provide visual feedback, optimizing for reduced motion support.