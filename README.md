# React + Vite

## Installation Steps

1. Install the project dependencies using the following command:

   ```bash
   npm install
   ```
2. Start the React app:

   ```bash
   npm run dev
   ```
3. First, create a new user account with an email and password.
4. To log in as an admin, you will need to create an admin account. Please use the following email for that purpose:

   ```
   admin@gmail.com
   ```

---

## Features

1. **Admin**

   * Full access to the system
   * Can create, edit, and delete user tasks
2. **User**

   * Can create their own tasks
   * Can edit and delete only their own tasks
   * Cannot delete or edit tasks created by the admin
   * Can move admin tasks and add comments to them
3. **Real-time Updates**

   * Implemented using Socket.IO
