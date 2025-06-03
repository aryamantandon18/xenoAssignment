const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Convert natural language to segment rules
exports.naturalLanguageToRules = async (text) => {
  try {
    const prompt = `
      Convert the following natural language segment description into structured rules for a CRM system.
      The available fields are: totalSpent (number), visitCount (number), lastOrderAt (date), email (string), name (string).
      Available operators: >, <, =, !=, >=, <=, CONTAINS, NOT_CONTAINS.
      
      Return only a JSON array of rule objects with field, operator, and value properties.
      Also suggest a logicOperator ("AND" or "OR") based on the description.
      
      Description: "${text}"
      
      Example output: 
      {
        "rules": [
          {"field": "totalSpent", "operator": ">", "value": 10000},
          {"field": "visitCount", "operator": "<", "value": 3}
        ],
        "logicOperator": "AND"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error converting natural language to rules:', error);
    throw error;
  }
};

// Generate campaign message suggestions
exports.generateMessageSuggestions = async (campaignObjective) => {
  try {
    const prompt = `
      Generate 3 message variants for a marketing campaign with the following objective:
      "${campaignObjective}"
      
      Return a JSON array of message strings.
      
      Example output:
      {
        "messages": [
          "Hi {name}, we miss you! Here's 10% off your next order.",
          "Welcome back {name}! Enjoy 15% off as our way of saying thanks.",
          "{name}, your favorites are waiting! Get 20% off today only."
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating message suggestions:', error);
    throw error;
  }
};