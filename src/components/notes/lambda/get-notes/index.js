const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,GET',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event) => {
  try {
    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
      return { 
        statusCode: 405, 
        headers, 
        body: JSON.stringify({ error: 'Method not allowed' }) 
      };
    }

    const { tag, pinned, favorite } = event.queryStringParameters || {};
    const userId = 'anonymous';
    
    // Base query for user's notes
    let params = {
      TableName: process.env.NOTES_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    // Add filters for non-deleted notes and additional filters
    let filterExpressions = ['attribute_not_exists(deletedAt)'];
    
    if (tag) {
      filterExpressions.push('contains(tags, :tag)');
      params.ExpressionAttributeValues[':tag'] = tag;
    }
    
    if (pinned !== undefined) {
      filterExpressions.push('pinned = :pinned');
      params.ExpressionAttributeValues[':pinned'] = pinned === 'true';
    }
    
    if (favorite !== undefined) {
      filterExpressions.push('favorite = :favorite');
      params.ExpressionAttributeValues[':favorite'] = favorite === 'true';
    }

    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
    }

    const result = await dynamo.query(params).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    console.error('Get notes error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
