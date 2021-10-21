# Hero Coders - prepare

You have can retrieve data in 3 formats: csv, json and as log to console.

## Before you run

Please notice that you should copy .env.sample as .env file and fill those two enviroment variables.

## To log into a console

`npm run start` 

or in code

```javascript
import { prepareComponentsListWithAssignedIssues } from '.';

prepareComponentsListWithAssignedIssues('IC')
```

## To save as JSON file

`npm run start:json` 

or in code 

```javascript
import { prepareComponentsListWithAssignedIssues } from '.';

prepareComponentsListWithAssignedIssues('IC', 'json');
```

## To save as CSV file

`npm run start:csv` 

or in code 

```javascript
import { prepareComponentsListWithAssignedIssues } from '.';

prepareComponentsListWithAssignedIssues('IC', 'csv');
```
