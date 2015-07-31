# Development

## Directory structure

```
ROOT
 |-- config   // configuration files
 |-- models   // database schemas
 |-- public   // compiled assets for web server delivery
 |-- routes   // route definitions and handler methods (i.e. the backend business logic and API)
 |-- scripts  // administration scripts
 |-- static   // static resources (copied to public by grunt)
 |-- views    // views to be rendered by backend or frontend
     |-- jsx  // JSX (react components) sources
     |-- ejs  // EJS templates for server-side rendering by express
```

## building (dev mode)

Install gulp if you haven't done so yet:
```
npm install -g gulp
```

Then, run:

```
gulp
```

Gulp will then:
 * Copy static files from ```static``` to ```public```
 * Compile ES6 and JSX view sources to ```public```
 * Watch sources for changes and recompile on changes
 * Run express web server at http://localhost:8080

For building the project for deployment in a production environment run ```gulp deploy``` instead.

## resources

 * https://github.com/voronianski/flux-comparison
