
# Angular App Debug Configuration

If the frontend is compiled into compacted form, minify and uglify, it will be very difficult for debugging, even locally running with "ng serve".
To be able to debug the app, source map needs to be available which holds information about the original files.

## angular.json:
Configure this file to enable for the source map when build and serve.
- build: add configuration similar like this:
  ```
  "projects": {
    "public": {
        ...
        ...
        "architect": {
            "build": {
                "configurations": {
                    "production": {
                        ...
                        "optimization": {
                            ...
                        }
                        ...
                        "sourceMap": {
                            "hidden": true,
                            "scripts": true,
                            "styles": true
                        },
                        ...
                        ...
                    },
                    "development": {
                        "optimization": false,
                        "sourceMap": true,
                        "namedChunks": true,
                        "vendorChunk": true
                    }
                }
            }
        }
    }
  }
  ```

- serve: add configuration similar like this:
  ```
    "architect": {
        "serve": {
            ...
            "configurations": {
                ...
                ...
                "development": {
                    "browserTarget": "public:build:development"
                }
            }
            ...
        }
    }
  ```

## package.json:
Then in package.json, also add npm run command for `ng serve` or `ng build` like this:
   ```
  "scripts": {
    "start:public": "ng serve --configuration development --host=0.0.0.0",
    "build:public": "ng build --configuration production"
  },
   ``` 

Since from the above configuration enable the source map be generated, developers can debug frontend app (after the app starts up) either from:
- the browser dev tool.
- or from VS Code.

To debug from the VS Code, there are probably several VS Code plugin extension developers can add and use. Here we describe the default way from the VS Code to use.

## Set up launch.json from VS Code.
- From the VS Code left side tool bar, 4th option - Run and Debug, click the option.
- From the switched left window for "Run and Debug", on top, select "Add Configuration".
- Select "Chrome: Launch".
- Add configuration similiar like this:
  ```
  {
        "version": "0.2.0",
        "configurations": [
            {
                "type": "chrome",
                "request": "launch",
                "name": "FOM Public localhost:4300 Debug",
                "url": "http://localhost:4300/public",
                "webRoot": "${workspaceFolder}/public"
            }
        ]
    }
  ```
- Note: above configuration "url" => use the landing page url for your app.
- Note: above configuration "webRoot": => use the location (if your VS Code root folder is different) for your frontend app.
- When above configuration is saved it should show up on the same window on top.
- Click that triangle symbole besides that configuration and "Start Debugging (F5)".
- It should then bring the Chrome browser and let you navigate to your page.
- Remember to set break point at your source code, for example, typescript file and start debugging.
