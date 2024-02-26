// Models:
// - Handle interactions with the database or data management.
// - Define data structure, validation, and relationships (ORM).
// - Conduct CRUD (Create, Read, Update, Delete) operations.

// Controllers:
// - Manage the application's logic, acting as intermediaries between
// routes and models.
// - Handle and process incoming requests, perform necessary data
// manipulations, and orchestrate application flow.
// - Prepare data for views or send responses back to clients.

// Routes:
// - Define application endpoints (URLs) and HTTP request methods.
// - Map incoming requests to specific controller functions.
// - Handle the request-response cycle and middleware for validations,
// authentication, and authorization.

// What Belongs Here:
// - Models: Database interactions, data structures, validations.
// - Controllers: Application logic, request handling, data processing.
// - Routes: Endpoint definition, request handling, and mapping to controllers.

// What Doesn't Belong Here:
// - Models: Presentation logic, direct responses to HTTP requests.
// - Controllers: Database operations, direct access to the database.
// - Routes: Business logic, direct interactions with the database.

Use HTTP status code 200 for successful requests that retrieve or update a resource.
Use HTTP status code 201 for successful requests that create a new resource on the server.
Use HTTP status code 202 for requests that have been accepted for processing but the processing has not yet been completed.
Use HTTP status code 204 for successful requests that delete a resource or do not have any content to return.

400 Bad Request - This means that client-side input fails validation.
401 Unauthorized - This means the user isn't not authorized to access a resource. It usually returns when the user isn't authenticated.
403 Forbidden - This means the user is authenticated, but it's not allowed to access a resource.
404 Not Found - This indicates that a resource is not found.
500 Internal server error - This is a generic server error. It probably shouldn't be thrown explicitly.
502 Bad Gateway - This indicates an invalid response from an upstream server.
503 Service Unavailable - This indicates that something unexpected happened on server side (It can be anything like server overload, some parts of the system failed, etc.).

GOLDEN JEST LINE: --maxWorkers=1

"scripts": {
"test": "jest --watch --maxWorkers=1",
"dev": "nodemon server.js",
"start": "node server.js"
},

tests only file after file. Performance issues when big, but works with my setup

### response.data (Axios):

Axios is a popular HTTP client library, and when using Axios, the response object has a data property that contains the payload of the response.

This assumes you are using Axios, and it retrieves the payload from the response using Axios's data property twice. The first data accesses the payload of the HTTP response, and the second data accesses a property within the payload.

return error;:

Returns the error as a value.
If the calling code expects a promise, it will be resolved with the error value.
Requires explicit error checking in the calling code.
throw error;:

Throws an exception immediately.
Control is transferred to the nearest catch block up the call stack.
Convenient when using try...catch in the calling code.

On Login:

Fetch user profile details (name, avatar, etc.).
Fetch authentication tokens.
Fetch basic information needed for the main dashboard.
Lazy Loading/On Demand:

Fetch additional user details (preferences, settings) when the user navigates to their profile settings.
Fetch trip-related data when the user accesses the "My Trips" section.
Background Fetching/Preloading:

Periodically check for new surf requests or notifications in the background to provide real-time updates.