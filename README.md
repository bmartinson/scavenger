# Scavenger Games

This project aims to provide an easy to use framework that allows users to create real world scavenger hunts that are augmented by digital content delivered through check-ins at physical waypoints using QR codes.

## State of development

The project was generated using [Angular CLI](https://github.com/angular/angular-cli) v10 and was migrated to v11. Since migrating to Angular v11, the project uses strict scaffolding. TSLint is still in use for this project, but there are plans to migrate to ESLint once the project reaches a more stable version.

Currently, the project mostly exists in a prototype state. Preliminary API services work has been done to support basic user creation and authentication for managing hunts, but hunt management tools need to be developed further.

At present, a single testing Scavenger game is currently embedded into the application and is in place to test the functionality of the end-user game. This portion of the application is quite stable for it's initial release and supports the basic customizable tools that will be developed on the management side of things.

Marketing about pages will be developed last, along with more official logos and branding. The management website is in early stages of development and design.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## API services

The API services that are in use by the application are hard-coded to use the hosted live API deployed at www.scavenger.games/api/, which is also managed in this project. In order to properly build and deploy these services, you must have a `db-definitions.php` file in `/src/api/common/` defining the database connection variables and keys required for connecting to the MySQL database that backs the project. This information is not tracked by this repository. If you need assistance setting up your own database connections or would like to request access to work on the production database for www.scavenger.games, please contact [Brian](mailto:brian@brianmartinson.com).

## Further help

Did you find an issue or need some help? Reach out to [Brian](mailto:brian@brianmartinson.com) or check out the [Issues](https://github.com/bmartinson/scavenger/issues) tab.
