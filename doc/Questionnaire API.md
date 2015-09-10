# Questionnaire Data Models and REST API

## Data models

The data models below are described in the mongoose notation for MongoDB data models.

### Questionnaire

```
{
  version     : { type: Number,     required: true }, // assigned by server, incremented on each post
  author      : { type: String,     required: true }, // UUID of user that created this version
  description : { type: String                     }, // for "internal" use, not displayed to users
  explanation : { type: String,     required: true }, // explanatory text displayed to users on top of the questionnaire
  questions   : { type: [Question], required: true }  // array of questions to be filled out by users
}
```

### Question
```
{
  uuid   : { type: String,   required: true }, // UUID of this question, created on creation / update
  tech   : { type: Boolean,  required: true }, // true if question falls under technological category
  text   : { type: String,   required: true }, // question description displayed to the user
  values : { type: [String], required: true }  // possible values the user can choose from
}
```

### Evaluation
```
{
  uuid      : { type: String, required: true    }, // UUID of this evaluation instance
  user      : { type: String, required: true    }, // UUID of user that created this evaluation instance
  scenario  : {
    uuid    : { type: String, required: true    }, // UUID of the scenario that is being evaluated
    version : { type: Number, required: true    }, // version of the scenario that is being evaluated
  },
  timestamp : { type: Date,   default: Date.now }, // set when created, reset when updated
  submitted : { type: Boolean, default: false   }, // set to true once the user presses submit
  answers   : {
    question : { type: Question, required: true }, // the question that was answered
    answer   : { type: String                   }  // the value that was picked as answer by the user, might be unanswered
  },
  comment   : { type: String, required: false   }  // user can optionally write comments if he feels it necessary
}
```

Client REST API
---------------

The basic idea is that there is always only one questionnaire active at a time (the latest version). Questionnaires are filled out by users when evaluating a scenario, thereby creating an instance of the "Evaluation" data type. Each evaluation points to the questionnaire version that was "active" when the user filled out the questionnaire (as a reference). In addition the Evaluation data model embeds the questionnaire data model so it is self-contained which makes it easier later on to analyze evaluations. This schema of versioning allows to evolve the questionnaires over time when new-won insights require to do so.

To change questionnaires there are two options:

 1.) replacing the old version with a new and
 2.) patching the currently active version.

Replacing (option 1) is the default way, i.e. if you replace the questionnaire with a new version all evaluations will be done using the new questionnaire from now on. Comparing evaluations done against both an old and a new version is not supported by the system and a manual process.

Patching the currently active version (option 2) should only be done for cosmetic changes (e.g., forgot a comma) or at most to clarify questions that were not understood. However, be aware that patching a questionnaire might make any evaluation result analysis produce dirty results so this is to be used with care.

### Questionnaires

<table>
  <tr>
    <td>Description</td>
    <td>returns the currently active questionnaire</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>```GET /api/v1/questionnaire```</td>
  </tr>
  <tr>
    <td>Request Query Parameters</td>
    <td>
      ```?version=x``` - returns version x<br/>
      ```?version=all``` - returns all versions
    </td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>
      ```Questionnaire``` or ```[Questionnaire]``` (if all versions are requested)
    </td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      ```200 OK``` - if successful<br/>
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>Description</td>
    <td>patches the questionnaire (only to be done for cosmetic changes)</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>```PATCH /api/v1/questionnaire```</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>
      ```Questionnaire``` - the updated questionnaire document (including new version number)
    </td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      ```200 OK``` - if successful<br/>
      ```401 UNAUTHORIZED``` - if user is not authenticated<br/>
      ```403 FORBIDDEN``` - if user is authenticated but doesn't have an administrator role
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>Description</td>
    <td>replaces the active questionnaire with the new version submitted</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>```POST /api/v1/questionnaire```</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>
      ```Questionnaire``` - the updated questionnaire document (including new version number)
    </td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      ```200 OK``` - if successful<br/>
      ```401 UNAUTHORIZED``` - if user is not authenticated<br/>
      ```403 FORBIDDEN``` - if user is authenticated but doesn't have an administrator role
    </td>
  </tr>
</table>

### Evaluations

When filling out a questionnaire the back end will already persist partially filled out questionnaires (i.e. one answered question at a time). Once the user presses submit the ```submitted``` flag will be set to true. For a given evaluation the user fills out the first call would therefore be a POST, followed by multiple PATCH calls until the document send has the ```submitted``` flag set to ```true```. This way we even can get an insight over partially filled out questionnaires and can differentiate partially and completely filled out and submitted questionnaires.

<table>
  <tr>
    <td>Description</td>
    <td>retrieve evaluations</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>```GET /api/v1/evaluations```</td>
  </tr>
  <tr>
    <td>Request Query Parameters</td>
    <td>
      ```skip``` - skip number of results (for paging)<br/>
      ```limit``` - limit number of results returned (for paging)<br/>
      ```scenario_uuid``` - filter by scenario UUID<br/>
      ```scenario_version``` - in addition to scenario UUID filter by scenario version<br/>
      ```user_uuid``` - filter by user $UUID<br/>
      ```submitted=true|false``` - only return (non-)complete evaluations<br/>
      <br/>
      All request query parameters can be freely combined with each other, only ```scenario_verion``` requires ```scenario_uuid``` to be set as well
    </td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>
      ```[Evaluation]```
    </td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      ```200 OK``` - if successful<br/>
      ```401 UNAUTHORIZED``` - if user is not authenticated<br/>
      ```403 FORBIDDEN``` - if user is authenticated but doesn't have an administrator or moderator role
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>Description</td>
    <td>returns the evaluation with the given UUID</td>
  </tr>
  <tr>
    <td>Request</td>
    <td>```GET /api/v1/evaluations/:uuid```</td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>
      ```Evaluation```
    </td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      ```200 OK``` - if successful<br/>
      ```401 UNAUTHORIZED``` - if user is not authenticated<br/>
      ```403 FORBIDDEN``` - if user is authenticated but doesn't have an administrator or moderator role
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>Description</td>
    <td>
      creates a new evaluation instance (to be called when user answers the first evaluation question)
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>```POST /api/v1/evaluations```</td>
  </tr>
  <tr>
    <td>Request Body</td>
    <td>
      ```Evaluation```
    </td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>
      ```Evaluation``` - a copy of the persisted evaluation
    </td>
  </tr>
  <tr>
    <td>Response Headers</td>
    <td>
      ```Location``` - URL to the newly created evaluation instance
    </td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      ```200 OK``` - if successful<br/>
      ```400 BAD_REQUEST``` - if the request body is malformed<br/>
      ```401 UNAUTHORIZED``` - if user is not authenticated
    </td>
  </tr>
</table>


<table>
  <tr>
    <td>Description</td>
    <td>
      patches an evaluation instance (to be subsequent to the initial POST request)
    </td>
  </tr>
  <tr>
    <td>Request</td>
    <td>```PATCH /api/v1/evaluations/:uuid```</td>
  </tr>
  <tr>
    <td>Request Body</td>
    <td>
      ```Evaluation```
    </td>
  </tr>
  <tr>
    <td>Response Body</td>
    <td>
      ```Evaluation``` - a copy of the persisted evaluation
    </td>
  </tr>
  <tr>
    <td>Response Codes</td>
    <td>
      ```200 OK``` - if successful<br/>
      ```400 BAD_REQUEST``` - if the request body is malformed<br/>
      ```401 UNAUTHORIZED``` - if user is not authenticated<br/>
      ```403 FORBIDDEN``` - if user is authenticated but is not the user that created this evaluation before
    </td>
  </tr>
</table>
