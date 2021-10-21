const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const { Parser } = require('json2csv');

dotenv.config();

const prepareJSONFile = (data, path) => {
    return fs.writeFile(
        `${path}componentsWithAssignedIssueNumber.json`,
        JSON.stringify(data),
        (err) => {
            console.log(err);
        });
}

const prepareCSVFile = (data, path) => {
    const fields = Object.keys(data[0]);
    const opts = { fields };
    const parser = new Parser(opts);

    const csv = parser.parse(data);
    
    return fs.writeFile(
        `${path}componentsWithAssignedIssueNumber.csv`,
        csv,
        (err) => {
            console.log(err);
        });
}

const prepareComponentsListWithAssignedIssues = async (projectId, output, pathForFile = './') => {
    const { JIRA_ACCOUNT, PROJECT_ID, OUTPUT } = process.env;
    const componentsUrl = `https://${JIRA_ACCOUNT}.atlassian.net/rest/api/3/project/${projectId || PROJECT_ID}/components`;
    const issuesWithComponentsUrl = `https://${JIRA_ACCOUNT}.atlassian.net/rest/api/3/search?jql=project%20%3D%20${projectId || PROJECT_ID}%20and%20component%20is%20not%20empty`

    try {
        const { data: componentsData } = await axios.get(componentsUrl);
        const componentsDataWithoutLead = componentsData
            .filter(component => !component.lead)
            .map(component => ({ ...component, issues: 0 }));
    
        const { data: { issues: issuesData } } = await axios.get(issuesWithComponentsUrl);

        issuesData.forEach(issue => {
            const { components } = issue.fields;

            components.forEach(({ id }) => {
                const selectedComponent = componentsDataWithoutLead.find(component => component.id === id);

                if (selectedComponent) {
                    selectedComponent.issues += 1;
                }
            })
        });

        if (OUTPUT === 'csv' || output === 'csv') {
            return prepareCSVFile(componentsDataWithoutLead, pathForFile);
        }

        if (OUTPUT === 'json' || output === 'json') {
            return prepareJSONFile(componentsDataWithoutLead, pathForFile);
        }
        
        console.log(componentsDataWithoutLead);
        return componentsDataWithoutLead;
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
};

module.exports = { prepareComponentsListWithAssignedIssues };
