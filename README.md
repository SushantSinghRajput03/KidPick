# KidPick

KidPick is a Laravel-based application designed for kindergartens to manage the pickup permissions of children by authorized family members. The app allows kindergarten staff to securely register children’s details and specify authorized pickup persons, helping ensure safe and efficient pickups.

## Features

- **Child Registration:**
  - Collects and stores essential child information, including name, date of birth, class, address, and photo.

- **Pickup Authorization:**
  - Allows entry of up to six authorized persons per child, specifying their relation to the child and contact information.

- **Dynamic Form Functionality:**
  - "Add More" option for flexible addition of multiple pickup persons, along with options to remove entries.

- **Validation:**
  - Robust client-side and server-side validations for all inputs, ensuring accurate and secure data.

- **Confirmation Screen:**
  - Displays a summary of the registered data upon successful registration, along with a thank-you message.


## Technologies Used / Requirement

- Laravel 11.9
- React 18.2.0
- Node 20.12.1
- npm 10.5.0
- PHP 8.2
- SQLite

## Setup Instructions

Follow these steps to set up the project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/SushantSinghRajput03/KidPick.git
   cd KidPick
   ```

2. **Install PHP Dependencies**
   ```bash
   composer install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit the `.env` file to configure your database settings

4. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```

5. **Run Database Migrations**
   ```bash
   php artisan migrate
   ```

6. **Set Up File Storage**
   ```bash
   php artisan storage:link
   ```
   Creates a symbolic link for public file storage

7. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

8. **Start the Development Server**
   ```bash
   # Option 1: Run PHP server and npm watch together (recommended)
   composer run dev
   
   # Option 2: Run PHP server only
   php artisan serve
   ```
   If using Option 1 (composer run dev), it will automatically handle asset compilation.
   If using Option 2, you'll need to compile assets separately:
   ```bash
   npm run dev    # For development
   # or
   npm run build  # For production
   ```
   Access the application at `http://localhost:8000`

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.