import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const noteId = event.pathParameters?.id;
    
    // Improvement #3: Input validation
    if (!noteId || !/^[a-zA-Z0-9-_]+$/.test(noteId)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Valid Note ID is required" }),
      };
    }

    // Improvement #1: Use GetCommand for validation
    const getParams = {
      TableName: process.env.NOTES_TABLE,
      Key: {
        userId: "anonymous",
        noteId: noteId,
      },
    };

    const existingNote = await dynamo.send(new GetCommand(getParams));

    if (!existingNote.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Note not found" }),
      };
    }

    if (!existingNote.Item.deletedAt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Note is not marked for deletion" }),
      };
    }

    const params = {
      TableName: process.env.NOTES_TABLE,
      Key: {
        userId: "anonymous",
        noteId: noteId,
      },
      UpdateExpression: "REMOVE deletedAt",
      ConditionExpression: "attribute_exists(noteId) AND attribute_exists(deletedAt)",
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamo.send(new UpdateCommand(params));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: "Note restored successfully.",
        note: result.Attributes,
      }),
    };
  } catch (error) {
    if (error.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: "Note not found or not marked for deletion" }),
      };
    }

    console.error("Restore note error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};