# Authentication Data Models and REST API

## Data models

The data models below are described in the mongoose notation for MongoDB data models.

### User

```
{
  uuid    : {type: String, required: true},
  name    : String,
  gender  : String,
  local            : {
    email        : Email,
    password     : String
  },
  facebook         : {
    id           : String,
    token        : String,
    email        : Email,
    name         : String,
    displayName  : String
  },
  twitter          : {
    id           : String,
    token        : String,
    displayName  : String,
    username     : String
  },
  google           : {
    id           : String,
    token        : String,
    email        : Email,
    name         : String
  },
  github           : {
    id           : String,
    token        : String,
    username     : String,
    displayName  : String
  },
  roles : [String]
}
```

Data Transfer Objects (DTOs)
----------------------------

In this context a DTOs sole purpose is to define the schema of data transferred in various API methods between client and server. They are not used as database schemas and are not persisted 1:1.

### CurrentUser

Information about the current logged in user, used for rendering the UI.

```
{
  uuid   : {type: String, required: true},
  name   : String,
  roles  : [String],
  gender : String
}
```

### Signup

User input on signup form

```
{
  email           : {type: Email, required: true},
  password        : {type: String, required: true},
  password_repeat : {type: String, required: true}
}
```

### UserInfo

```
{
  uuid : {type: String, required: true},
  name : String
}
```

### UserSchemaPatch

```
var UserSchemaPatch = {
  type : Object,
  unknownKeys: 'remove',
  schema : {
    'roles': {
      type: Array,
      required: false,
      schema: {
        type: String
      }
    },
    'name': { type: String, required: false },
    'gender': { type: String, required: false },
    'local' : {
      type : Object,
      schema : {
        'email' : { type: String, required: false },
        'password' : { type: String, required: false }
      }
    }
  }
};
```

Client REST API
---------------

### User-related

<table>
  <tr>
    <td>Description</td>
    <td>returns information about the currently logged in user, for UI rendering</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>GET /api/v1/auth/currentUser</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>CurrentUser</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>200 OK</td>
  </tr>
</table>

### Login-related

<table>
  <tr>
    <td>Description</td>
    <td>logout</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>GET /api/v1/auth/logout</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>204 OK</td>
  </tr>
</table>

<table>
  <tr>
    <td>Description</td>
    <td>Local login with local credentials (username, password)</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>GET /api/v1/auth/local-login</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>CurrentUser</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      422 Unprocessable Entity - Email address and/or password unknown<br/>
      200 OK - if successful
    </td>
  </tr>
</table>

### Signup process-related

<table>
  <tr>
    <td>Description</td>
    <td>Form submission on signup page</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>POST /api/v1/auth/signup</td>
  </tr>
  <tr>
    <td>Request Body</td>
    <td>Signup</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>CurrentUser</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      400 Bad Request - if body is malformed or e.g., passwords do not match<br/>
      409 Conflict - if user with given email already exists<br/>
      200 OK - if successful
    </td>
  </tr>
</table>

### OAuth login / signup

The following methods are available for all currently supported OAuth providers. Replace $PROVIDER with one of [facebook, twitter, google, github].

The actual authentication and signup process is handled using the passport library that abstracts from the actual auth process between the scenario tool and the authentication provider. Here, we only document the most important URLs and methods.

<table>
  <tr>
    <td>Description</td>
    <td>Initiate signup / signin with $PROVIDER authentication provider</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>GET /api/v1/auth/$PROVIDER</td>
  </tr>
</table>

<table>
  <tr>
    <td>Description</td>
    <td>
      Callback URL to which user is redirected by the OAuth provider after allowing access to his user information. The request will contain the information about the user that the scenario tool requests to read from the authentication provider.
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>GET /api/v1/auth/callback_$PROVIDER</td>
  </tr>
</table>

### Connecting additional accounts

The following methods are available for all currently supported OAuth providers. Replace $PROVIDER with one of [facebook, twitter, google, github].

The methods allow adding additional accounts to an existing one, i.e. if the user has e.g., a local account he can chose to allow the scenario tool access to his profile data (e.g., email, profile picture, profile name, ...). The backend will then augment the users account data with the additional information retrieved via the authentication provider.

<table>
  <tr>
    <td>Description</td>
    <td>
      Connect additional auth provider account with existing (of logged-in user)
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>POST /api/v1/auth/$PROVIDER</td>
  </tr>
</table>

Additionally, if the user signed up with some request provider first, there's the option to additionally connect (i.e. sign up) a local account with:

<table>
  <tr>
    <td>Description</td>
    <td>
      Connect additional local account with existing auth provider account (of logged-in user)
    </td>
  </tr>
  <tr>
    <td>Request Body</td>
    <td>Signup</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>POST /api/v1/auth/local</td>
  </tr>
</table>

### Disconnecting additional accounts

Accounts created / added can be removed from the scenario tool by sending requests to one (or more) of the following resources for one of the authentication providers [local, facebook, github, twitter, google]:

<table>
  <tr>
    <td>Description</td>
    <td>
      Disconnect account
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>GET /api/v1/users/:uuid/unlink/$PROVIDER</td>
  </tr>
</table>

### Retrieve user data / users list

<table>
  <tr>
    <td>Description</td>
    <td>
      Retrieve info about a specific user, used e.g. to display user avatars.
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>GET /api/v1/info/:uuid</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>UserInfo</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      200 OK
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>Description</td>
    <td>
      Lists all user accounts
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>GET /api/v1/users</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>[User]</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      401 Unauthorized - if not logged in<br/>
      403 Forbidden - if user is logged in but has no administrator rights<br/>
      200 OK
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>Description</td>
    <td>
      Retrieve detailed account information about one specific user with UUID :uuid
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>GET /api/v1/:uuid</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>User</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      401 Unauthorized - if not logged in<br/>
      403 Forbidden - if user is logged in but has no administrator rights<br/>
      200 OK
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>Description</td>
    <td>
      Patch individual fields of a user (allowed if you're administrator or logged in as the user to be patched)
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>PATCH /api/v1/:uuid</td>
  </tr>
  <tr>
    <td>Request Body</td>
    <td>UserSchemaPatch</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>User</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      401 Unauthorized - if not logged in<br/>
      403 Forbidden - if user is logged in but is not the user to be patched or has no administrator rights<br/>
      200 OK
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>Description</td>
    <td>
      Remove user model
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>DELETE /api/v1/:uuid</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>User (the model of the user that was removed)</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      401 Unauthorized - if not logged in<br/>
      403 Forbidden - if user is logged in but is not the user to be patched or has no administrator rights<br/>
      200 OK
    </td>
  </tr>
</table>
