const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async () => {
  const currentDate = new Date().toISOString();

  try {
    // Find notes marked for deletion where deletion time has passed
    const scanParams = {
      TableName: process.env.NOTES_TABLE,
      FilterExpression: 'deletedAt < :currentDate',
      ExpressionAttributeValues: {
        ':currentDate': currentDate
      }
    };

    const result = await dynamo.scan(scanParams).promise();
    
    let deletedCount = 0;
    
    if (result.Items.length > 0) {
      // Delete each expired note
      for (const note of result.Items) {
        const deleteParams = {
          TableName: process.env.NOTES_TABLE,
          Key: {
            userId: note.userId,
            noteId: note.noteId
          }
        };

        await dynamo.delete(deleteParams).promise();
        deletedCount++;
      }
    }

    console.log(`Cleanup completed: ${deletedCount} notes permanently deleted`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: `Cleanup completed: ${deletedCount} notes permanently deleted` 
      })
    };
  } catch (error) {
    console.error('Cleanup error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Cleanup failed' })
    };
  }
};