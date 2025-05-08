# Grid Runner

Grid Runner is a fast-paced arcade-style game played on a dynamic grid. The objective is simple: move your square, eat food, and rack up points. But the more you eat, the tougher it gets!

## Setup

#### 1. Clone the repo
```bash
git clone https://github.com/jkcoderdev/grid-runner.git
```
#### 2. Run this command
```bash
composer install
```
#### 3. Copy `.env.example` file and name it `.env`
#### 4. Configure your database in `.env` file
#### 5. Initialize the database
```bash
php artisan db:init
```

## Running

### Development

```bash
php artisan serve
```

### Production

Host it on a server supporting PHP from the `public` directory.
