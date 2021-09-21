
# Test 1 - Mongoose Models
Setup the schema for three Mongoose models: User, Album, and Purchase.

User:
Should have one property: name (string).

Album:
Should have the three properties: title (string), performer (string), and cost (number).

Purchase:
Should reference one user and one album.

# Test 2 - JSON REST API
Albums
Add routes for these 5 CRUD actions pertaining to the Album model:

GET /albums - Get a list of all albums in the dabatase
GET /albums/:id - Return a single album record by id
POST /albums - Create a single album from the parameters passed in
PUT /albums/:id - Update an existing album record by id
DELETE /albums/:id - Delete an existing album by id
Reqests
The POST and PUT routes should expect JSON values on the request body which will contain the parameters to save the record with. All three Album fields can be updated.

Both the GET and DELETE routes should expect an id which will be the id of an existing Album record.

Response
Since this is a JSON API, we need to return JSON and a 200 status code, with the exception of destroy method which should return a 204 status code with no content.

All three Album columns title, performer and cost should be returned in a data parameter for the GET, POST and PUT methods.

Purchase
Add this single route pertaining to the Purchase model:

POST /purchases - Create a purchase
Request
This route should expect a user and album on the request body. It should then store a reference to both of these records on the newly created purchase record.

Response
The response should include the purchase record as well as the user and album relations, which should also be populated with all their data fields.

# Test 3 - Authentication
It's time to start authenticating some users!

Let's create three new routes:

POST /signup
This route allows our users to signup. We expect them to pass a name, email and password on the request body. If successful we should set an authorization header and a 204 status code on the response.

POST /login
Here we'll expect a email and password field so we can authenticate this user. If successful we should set an authorization header and a 204 status code on the response.

POST /logout
For this route we'll want to remove their authorization header and log the user out. If successful, return a 204 status code.

Update /album Routes
After that's complete we'll want to update our Create, Update and Delete /albums routes to use the authentication. If logged in, these routes should allow the user to complete the operation. If not, they should return a 401.

Be sure to create a random authorization header every time the user logs in and out.

Good luck!
