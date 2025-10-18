const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,DELETE,POST',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event) => {
  try {
    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'DELETE') {
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

    const currentDate = new Date();
    const sevenDaysLater = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Soft delete - mark for deletion in 7 days
    const params = {
      TableName: process.env.NOTES_TABLE,
      Key: {
        userId: 'anonymous',
        noteId: noteId
      },
      UpdateExpression: 'SET deletedAt = :deletedAt',
      ConditionExpression: 'attribute_exists(noteId)',
      ExpressionAttributeValues: {
        ':deletedAt': sevenDaysLater.toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamo.update(params).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Note marked for deletion. It will be permanently deleted in 7 days.',
        deletedAt: result.Attributes.deletedAt
      })
    };
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Note not found' })
      };
    }
    
    console.error('Delete note error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

