const mondaySdk = require('monday-sdk-js');
const moment = require('moment')

const monday = mondaySdk();
monday.setToken(process.env.MONDAY_SDK_TOKEN);

async function sendToMonday(data) {
  // Calculate patient's age
  const age = moment().diff(moment(data.patient.birthDate), 'years');

  // Filter for hemoglobin observations
  const hemoglobinObservations = data.observations.entry
    .filter(entry => entry.resource.code.text.includes('Hemoglobin'))
    .map(entry => ({
        Date: entry.resource.effectiveDateTime,
        Value: entry.resource.valueQuantity ? entry.resource.valueQuantity.value : 0
    }));

  // Set board ID and column IDs according to your monday.com setup
  const boardId = 1239880357;
  const colDataMonday = await getColumnData(boardId);
  console.log(colDataMonday)

  const columnIds = {
      id: 'yourIdColumnId',
      name: 'yourNameColumnId',
      age: 'yourAgeColumnId',
      gender: 'yourGenderColumnId',
      hemoglobin: 'yourHemoglobinColumnId'
  };

  colDataMonday.forEach((column) => {
    const title = column.title.toLowerCase();
    if (columnIds[title]) {
      columnIds[title] = column.id;
    }
  });

  // Get patient name
  const name = data.patient.name[0].given[0] + " " + data.patient.name[0].family;

  const createItemResponse = await monday.api(`
      mutation create_item($boardId: Int!, $item_name: String!, $column_values: JSON!) {
          create_item (board_id: $boardId, item_name: $item_name, column_values: $column_values) {
              id
          }
      }
  `, {
      variables: {
          boardId: boardId,
          item_name: name,
          column_values: JSON.stringify({
              [columnIds.id]: data.patient.id,
              [columnIds.name]: name,
              [columnIds.age]: age,
              [columnIds.gender]: data.patient.gender === 'male' ? 'M' : 'F',
              [columnIds.hemoglobin]: JSON.stringify(hemoglobinObservations)
          })
      }
  });

  console.log(createItemResponse);
}

async function getColumnData(boardId) {
    const query = `
    query {
      boards(ids: [${boardId}]) {
        columns {
          title
          id
        }
      }
    }
  `;

  const response = await monday.api(query);

  return response.data.boards[0].columns;
}

module.exports = {
  sendToMonday,
  getColumnData
};