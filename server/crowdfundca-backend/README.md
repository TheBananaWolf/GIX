# Running the App on Different Operating Systems

## On MacOS or Linux

Run the app with this command:

```
$ DEBUG=myapp:* npm start
```

## On Windows Command Prompt

Use this command:

```
> set DEBUG=myapp:* & npm start
```

## On Windows PowerShell

Use this command:

```
PS> $env:DEBUG='myapp:*'; npm start
```

Then load `http://localhost:3000/` in your browser to access the app.

## App Directory Structure

The generated app has the following directory structure:

```
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug
```

_7 directories, 9 files_

## Useful Link

[Express Guide](https://expressjs.com/en/starter/generator.html)

# Connect to MongoDB
```
const mongoose = require('mongoose');
const uri = "mongodb+srv://tomwang:rootroot@crowdfundca.ymbout5.mongodb.net/?retryWrites=true&w=majority";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);
```

# Tutorial 101 about joint debugging

Firstly, install ```mongoose```and```http-proxy-middleware```. 
```
cd C:\Users\admin\IdeaProjects\ece651_team7\server\crowdfundca-backend
npm install mongoose
cd C:\Users\admin\IdeaProjects\ece651_team7\client\react-crowdfundca
npm install http-proxy-middleware --save
```
You may also need to resolve the 
```@babel/plugin-proposal-private-property-in-object``` warning,
ignore it or run the command 
```
npm install --save-dev @babel/plugin-proposal-private-property-in-object
```
I created a temporary db called ```user_infos``` with 2 collections schema ```user_authentication_infos``` and
```user_profile_info```. You can check the db connection settings in```server/crowdfundca-backend/app.js```, and
collection schema infos in ```server/crowdfundca-backend/models/userSchemas.js```.

For Testing, you can set up the mongodb, then create a mock account in collection ```user_infos
.user_authentication_infos```:
```
email: testuser1@uw.com
password: password001
```
Then run the ```npm start``` in ```C:\Users\admin\IdeaProjects\ece651_team7\server\crowdfundca-backend```. 
It should show:
```
> crowdfundca-backend@0.0.0 start
> node ./bin/www

Connected to MongoDB
```
After this, open a new terminal then run the ```npm start``` in 
```C:\Users\admin\IdeaProjects\ece651_team7\client\react-crowdfundca```. It should show:
```

> react-crowdfundca@0.1.0 start
> react-scripts start

[HPM] Proxy created: /  -> http://localhost:3001
(node:24536) [DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE] DeprecationWarning: 'onAfterSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
(Use `node --trace-deprecation ...` to show where the warning was created)
(node:24536) [DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE] DeprecationWarning: 'onBeforeSetupMiddleware' option is deprecated. Please use the 'setupMiddlewares' option.
Starting the development server...
Compiled successfully!

You can now view react-crowdfundca in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.5:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
Files successfully emitted, waiting for typecheck results...
Issues checking in progress...
No issues found.
```
Using the mock account infos to test the sign-in function, check if returned success message through developer tool.