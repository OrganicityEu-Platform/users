# Scenarios Data Model and REST API

## Data models

The data models below are described in the mongoose notation for MongoDB data models.

### Scenario

The scenario schema follows the immutable data type approach. Whenever something has to be updated (from a user perspective) the backend will create a copy of the current scenario with an incremented version number. All copies have the same UUID but different version numbers. All queries always return the newest copy (which can be determined using the version number).

```
{
  uuid        : { type: String, required: true  }, // same for all versions
  version     : { type: Number, required: true  }, // server-incremented
  title       : { type: String, required: true  }, // plain text
  summary     : { type: String, required: true  }, // plain text
  narrative   : { type: String, required: true  }, // markdown
  creator     : { type: String, required: true  }, // user uuid
  timestamp   : { type: Date, default: Date.now }, // set when created
  actors      : { type: [String]                }, // tags (comma-separated)
  sectors     : { type: [String]                }, // tags (comma-separated)
  devices     : { type: [String]                }, // tags (comma-separated)
  dataSources : { type: [String]                }, // uuids of data source type
}
```

### Data source

```
{
  uuid        : { type: String, required: true }, // internal identifier
  href        : { type: Url,    required: true }, // link to original data source
  description : { type: String                 }  // markdown
}
```

### Comments

TODO: integrate some "done" solution, e.g., disqus via https://www.npmjs.com/package/disqus-node

Data Transfer Objects (DTOs)
----------------------------

In this context a DTOs sole purpose is to define the schema of data transferred in various API methods between client and server. They are not used as database schemas and are not persisted 1:1.

### ScenarioUpdate

Used by clients when creating or updating a scenario resource. Included fields are identical to fields in Scenario schema but type is stripped down to fields that users are allowed to set when creating or updating a scenario resource.

```
{
  title       : { type: String, required: true  }, // plain text
  summary     : { type: String, required: true  }, // plain text
  narrative   : { type: String, required: true  }, // markdown
  actors      : { type: [String]                }, // tags (comma-separated)
  sectors     : { type: [String]                }, // tags (comma-separated)
  devices     : { type: [String]                }, // tags (comma-separated)
}
```

### Tag

Used for creating tag clouds or tag suggestions in the UI, e.g., for sectors, actors and devices of a scenario.

```
{
  name  : { type: String, required: true }, // tag string, might contain multiple words with spaces, but is trimmed
  count : { type: Number, required: true }  // count of occurrences
}
```

Client REST API
---------------

### Scenarios

#### List all scenarios

<table>
  <tr>
    <td>Description</td>
    <td>returns all latest versions of scenarios</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>GET /api/v1/scenarios</td>
  </tr>
  <tr>
    <td>Query Options</td>
    <td>sortBy -- column name to sort by, corresponds to the field name in Scenario type, e.g., one of ['title', 'timestamp']</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>[Scenario]</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>200 OK - if successful</td>
  </tr>
</table>

#### Full text search

<table>
  <tr>
    <td>Description</td>
    <td>do a full text search on all kinds of fields (google-style, whatever makes sense)</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>GET /api/v1/scenarios?q=keyword(s)</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>[Scenario]</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>200 OK - if successful</td>
  </tr>
</table>

#### Fine-grained search

<table>
  <tr>
    <td>Description</td>
    <td>
      match fields on scenario schema, if multiple query parameters are given do a conjuction
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>
      GET /api/v1/scenarios?actors=politicians,people&sectors=industry<br/>
      GET /api/v1/scenarios?creator=uuid
    </td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>[Scenario]</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>200 OK - if successful</td>
  </tr>
</table>

#### Retrieval of a scenario (and it's old versions)

<table>
  <tr>
    <td>Description</td>
    <td>
      returns the most recent scenario version or an older version if query parameter v is given
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>
      GET /api/v1/scenarios/:id<br/>
      GET /api/v1/scenarios/:id?v=version
    </td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>Scenario</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      200 OK - if successful<br/>
      404 NOT FOUND - if not found
    </td>
  </tr>
</table>

#### Creation of new scenario

<table>
  <tr>
    <td>Description</td>
    <td>
      creates a new scenario
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>POST /api/v1/scenarios</td>
  </tr>
  <tr>
    <td>Request Body</td>
    <td>ScenarioUpdate</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>Scenario</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      201 CREATED      - if successful with Location header<br/>
      400 BAD REQUEST  - if request is malformed<br/>
      401 UNAUTHORIZED - need to be authenticated to create scenarios
    </td>
  </tr>
</table>

#### Update of existing scenario

<table>
  <tr>
    <td>Description</td>
    <td>
      updates a scenario by creating a new scenario. in the backend this results in creating a new MongoDB document that has “backlinks” to it’s older versions
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>PUT /api/v1/scenarios/:id</td>
  </tr>
  <tr>
    <td>Request Body</td>
    <td>ScenarioUpdate</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>Scenario</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      201 CREATED      - if successful with Location header<br/>
      400 BAD REQUEST  - if request is malformed<br/>
      401 UNAUTHORIZED - need to be authenticated to create scenarios<br/>
      403 FORBIDDEN    - if you’re not creator or admin<br/>
      404 NOT FOUND    - if not found
    </td>
  </tr>
</table>

#### Deleting an existing scenario

<table>
  <tr>
    <td>Description</td>
    <td>
      deletes an existing scenario (the newest version if parameter v is not given or a specific version if v is given)
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>
      DELETE /api/v1/scenarios/:id<br/>
      DELETE /api/v1/scenarios/:id?v=:version
    </td>
  </tr>
  <tr>
    <td>Request Body</td>
    <td>ScenarioUpdate</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      204 NO CONTENT   - if successfully deleted<br/>
      401 UNAUTHORIZED - need to be authenticated to delete scenarios<br/>
      403 FORBIDDEN    - if you’re not creator or admin<br/>
      404 NOT FOUND    - if not found
    </td>
  </tr>
</table>

#### Querying for tags (same for actors, sectors, devices)

<table>
  <tr>
    <td>Description</td>
    <td>
      returns tags for actors, sectors, devices, including popularity information (i.e. counts of how often a tag was used)
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>
      GET /actors<br/>
      GET /devices<br/>
      GET /sectors
    </td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>[Tag], sorted by count</td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      200 OK - with empty array if none found or like above
    </td>
  </tr>
</table>
