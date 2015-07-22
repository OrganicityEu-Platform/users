Use Case Tool Data Model and REST API Design
============================================

Server-side data models (MongoDB schema)
----------------------------------------

### <a name="userSchema"></a>User

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

### <a name="scenarioSchema"></a>Scenario

The scenario schema follows the immutable data type approach. Whenever something has to be updated (from a user perspective) the backend will create a copy of the current scenario with an incremented version number. All copies have the same UUID but different version numbers. All queries always return the newest copy (which can be determined using the version number).

```
{
  uuid        : { type: String, required: true  }, // same for all versions
  version     : { type: Number, required: true  }, // server-incremented
  title       : { type: String, required: true  }, // plain text
  summary     : { type: String, required: true  }, // plain text
  narrative   : { type: String, required: true  }, // markdown
  creator     : { type: String                  }, // user uuid
  timestamp   : { type: Date, default: Date.now }, // set when created
  actors      : { type: [String]                }, // tags (comma-separated)
  sectors     : { type: [String]                }, // tags (comma-separated)
  devices     : { type: [String]                }, // tags (comma-separated)
  dataSources : { type: [String]                }, // uuids of data source type
}
```

### <a name="dataSourceSchema"></a>Data source

```
{
  uuid        : { type: String, required: true }, // internal identifier
  href        : { type: Url,    required: true }, // link to original data source
  description : { type: String                 }  // markdown
}
```

### <a name="fileSchema"></a>File

```
{
  uuid        : { type: String, required: true}, // internal identifier
  href        : { type: Url,    required: true}, // link to the original file (not stored in DB)
  filename    : { type: String, required: true}, //
  description : { type: String                }, // markdown
  mimeType    : { type: String                }  // mime-type
}
```

### <a name="projectSchema"></a>Project

```
{
  uuid        : { type: String, required: true}, // internal identifier
  title       : { type: String, required: true}, // plain text
  description : { type: String                }  // markdown
}
```

### <a name="commentsSchema"></a>Comments

TODO: integrate some "done" solution, e.g., disqus via https://www.npmjs.com/package/disqus-node

Client-side REST API and data transfer objects (DTOs)
-----------------------------------------------------

### Scenarios - Read
<table>
  <tr>
    <td>Description</td>
    <td>returns all latest versions of scenarios</td>
  </tr>
  <tr>
    <td>Description</td>
    <td>```GET /api/v1/scenarios```</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>[[Scenario](#scenarioSchema)]</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>200 OK - if successful</td>
  </tr>
</table>
