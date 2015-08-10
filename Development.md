# Development

## Directory structure

```
ROOT
 |-- assets   // application assets that will be compiled to the "public" folder (e.g. less files)
 |-- config   // configuration files
 |-- models   // database schemas
 |-- public   // compiled assets for web server delivery
 |-- routes   // route definitions and handler methods (i.e. the backend business logic and API)
 |-- scripts  // administration scripts
 |-- static   // static resources (copied to public by grunt)
 |-- util     // utility javascript files
 |-- views    // views to be rendered by backend or frontend
     |-- jsx  // JSX (react components) sources
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
 * Compile assets from ```assets``` to ```public```
 * Copy static files from ```static``` to ```public```
 * Compile ES6 and JSX view sources to ```public```
 * Watch sources for changes and recompile on changes
 * Run express web server at http://localhost:8080

For building the project for deployment in a production environment run ```gulp deploy``` instead.

## resources

 * https://github.com/voronianski/flux-comparison
