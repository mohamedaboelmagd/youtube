# uses this channel Id

UCx4a8EMmXx-6RuJlyAKASoQ

UCXVDBeCwro9FqNeBr41Q2BQ

UCee3jrGUdb2ovrE7v4ncH3Q

UC-1l0Ew_jMorWJ0d9RWk5wg

UC_x5XG1OV2P6uZZ5FSM9Ttw

# lazy loaded modules

> channel.module

    1. check channel Id exist in firestore already or not
        it exists, loading it from firestore will work.
        if not, load it using Google youtube API.
    2. what do I save in firestore?
        only first pages and each pageToken.
        not save the response of sort request or find per title.

> > video.module

    1. check video Id exist in firestore already or not
        it exists, loading it from firestore will work.
        if not, load it using Google youtube API
    2. toggle favorite and set rating to this document

# Inmobly

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
