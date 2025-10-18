const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event) => {
  try {
    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
      return { 
        statusCode: 405, 
        headers, 
        body: JSON.stringify({ error: 'Method not allowed' }) 
      };
    }

    const noteId = event.pathParameters?.id;
    if (!noteId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Note ID is required' })
      };
    }

    // Remove deletedAt field to restore note
    const params = {
      TableName: process.env.NOTES_TABLE,
      Key: {
        userId: 'anonymous',
        noteId: noteId
      },
      UpdateExpression: 'REMOVE deletedAt',
      ConditionExpression: 'attribute_exists(noteId) AND attribute_exists(deletedAt)',
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamo.update(params).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Note restored successfully.',
        note: result.Attributes
      })
    };
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Note not found or not marked for deletion' })
      };
    }
    
    console.error('Restore note error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

