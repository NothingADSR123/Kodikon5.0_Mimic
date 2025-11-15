const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// CORRECTED MODEL NAME: Use the stable and reliable pro model
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Stage 1: The prompt that creates the simple explanation
const getStage1Prompt = (userInput) => `
  You are an expert educator for a K-12 student with neurodivergent needs.
  A user wants to understand: "${userInput}".
  Your task is to write a simple, clear, and concise explanation of this concept using Markdown.
  Use short sentences, simple analogies, and bullet points or numbered lists if it helps.
  This explanation will be shown to the user and will also be used to generate a 3D visualization.
`;

// Stage 2: The Definitive "Master Prompt" that creates the JSON
const getStage2Prompt = (explanation, userInput) => `
  You are an AI assistant for Mimic, a 3D visualization tool for neurodivergent users.
  Based on the user's original request "${userInput}" and the following simple explanation, generate a structured JSON Scene Graph.
  Your ONLY output must be a single JSON object.

  Explanation:
  ---
  ${explanation}
  ---

  **CORE MISSION: INTERPRET THE MEANING OF THE EXPLANATION, NOT JUST THE WORDS.**

  **JSON OUTPUT STRUCTURE:**
  - Your entire output MUST be a single JSON object.
  - It can have "objects", "relationships", and "sequence" arrays.

  **RULES FOR "OBJECTS":**
  1.  **Symbolize Abstracts:** For abstract concepts (e.g., 'supply', 'demand', 'fear'), you MUST represent them as simple, symbolic geometric shapes.
  2.  **Decompose Physical:** For physical objects (e.g., 'car', 'snowman'), you MUST break them down into component parts using the 'parent' property.
  3.  **Properties:** Every object needs: id, shape (lowercase), color, position, size, label, and showLabel.
  4.  **Size Rule:** 'size' MUST ALWAYS be an array of three numbers: [width, height, depth].
  5.  **Low Clutter:** Limit scenes to essential components.

  **RULES FOR "RELATIONSHIPS":**
  - Use this for conceptual connections (e.g., 'balances', 'opposes').
  - A relationship object must have: 'from', 'to', 'type' ('line' or 'arrow'), and 'label'.

  **RULES FOR "SEQUENCES":**
  - If the explanation describes a step-by-step process (like "the water cycle" or building a snowman), you MUST generate a "sequence" array.
  - Each step needs: "step", "label", "targetId", "action", and "params".

  **EXAMPLE 1: ABSTRACT CONCEPT (from original prompt)**
  USER PROMPT: "show me how supply balances demand"
  YOUR OUTPUT:
  {
    "objects": [
      { "id": "supply_obj", "shape": "sphere", "color": "royalblue", "position": [-4, 0, 0], "size": [2,2,2], "label": "Supply", "showLabel": true },
      { "id": "demand_obj", "shape": "sphere", "color": "tomato", "position": [4, 0, 0], "size": [2,2,2], "label": "Demand", "showLabel": true }
    ],
    "relationships": [
      { "from": "supply_obj", "to": "demand_obj", "type": "line", "label": "balances" }
    ]
  }

  **EXAMPLE 2: PROCESS (new addition)**
  USER PROMPT: "the water cycle"
  (Based on a step-by-step explanation)
  YOUR OUTPUT:
  {
    "objects": [
      { "id": "ocean", "shape": "plane", "color": "blue", "position": [0,0,0], "size": [10,10,0.1], "label": "Ocean", "showLabel": true, "visible": true },
      { "id": "vapor", "shape": "sphere", "color": "lightblue", "position": [0,0.5,0], "size": [0.5,0.5,0.5], "label": "Vapor", "showLabel": true, "visible": false }
    ],
    "sequence": [
      { "step": 1, "label": "Evaporation", "targetId": "vapor", "action": "appear", "params": {} },
      { "step": 2, "label": "Vapor rises", "targetId": "vapor", "action": "move", "params": { "position": [0, 4, 0] } }
    ]
  }
`;

const generateSceneJson = async (userInput) => {
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // --- STAGE 1: Generate the simple text explanation ---
      console.log(`AI Service (Attempt ${attempt}): Starting Stage 1 - Generating Explanation...`);
      const stage1Prompt = getStage1Prompt(userInput);
      const explanationResult = await model.generateContent(stage1Prompt);
      const explanation = explanationResult.response.text();
      console.log(`AI Service (Attempt ${attempt}): Stage 1 Complete.`);

      // --- STAGE 2: Generate the Scene Graph from the explanation ---
      console.log(`AI Service (Attempt ${attempt}): Starting Stage 2 - Generating Scene Graph...`);
      const stage2Prompt = getStage2Prompt(explanation, userInput);
      const sceneGraphResult = await model.generateContent(stage2Prompt);
      let jsonText = sceneGraphResult.response.text();
      
      const startIndex = jsonText.indexOf('{');
      const endIndex = jsonText.lastIndexOf('}');
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("AI did not return valid JSON for the scene graph.");
      }
      jsonText = jsonText.substring(startIndex, endIndex + 1);
      const sceneGraph = JSON.parse(jsonText);
      console.log(`AI Service (Attempt ${attempt}): Stage 2 Complete. Success!`);

      return { explanation, sceneGraph };

    } catch (error) {
      lastError = error;
      console.error(`AI Service (Attempt ${attempt}) failed:`, error.message);
      if (attempt < maxRetries && error.message.includes('503')) {
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw lastError; // A non-retryable error occurred
      }
    }
  }
  throw lastError; // All retries failed
};

const generateChatResponse = async (userMessage) => {
  try {
    const systemPrompt = `You are Mimic's learning copilot for neurodivergent students.

When a user asks about a concept, provide a simple, clear explanation.

Rules for your explanation:
- Explain the concept in very clear, simple language.  
- Use short bullet points or numbered points, like:  
  - point 1  
  - point 2  
- Do NOT use any markdown symbols like ** or __.  
- Keep each point 1–2 lines so it is easy to read.
- Be friendly and supportive.
- If the user asks for something unsafe or not allowed, gently refuse and explain why.

User's message: "${userMessage}"

Provide a clear explanation following all the rules above.`;

    const result = await model.generateContent(systemPrompt);

    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error in generateChatResponse:', error);
    throw error;
  }
};

const generateQuiz = async (concept) => {
  try {
    const quizPrompt = `You are Mimic's quiz generator for neurodivergent students.

Generate exactly 3 multiple choice questions about: "${concept}"

CRITICAL FORMAT RULES:
- Output ONLY the 3 questions, nothing else.
- Each question MUST follow this exact format:

Q1. Question text?
A) option one
B) option two
C) option three
D) option four
Answer: B

Q2. Question text?
A) option one
B) option two
C) option three
D) option four
Answer: D

Q3. Question text?
A) option one
B) option two
C) option three
D) option four
Answer: A

- Make questions friendly and not scary.
- Questions should help check understanding of the concept.
- Make sure one answer is clearly correct.
- No extra text, no introductions, no markdown symbols.`;

    const result = await model.generateContent(quizPrompt);
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error in generateQuiz:', error);
    throw error;
  }
};

const generateReExplanation = async (concept, questionText, userAnswer, correctAnswer) => {
  try {
    const reExplanationPrompt = `You are Mimic's learning copilot for neurodivergent students.

A student just answered a quiz question incorrectly. Help them understand why.

Concept: "${concept}"
Question: "${questionText}"
Student chose: ${userAnswer}
Correct answer: ${correctAnswer}

Provide a SHORT, gentle re-explanation (2-3 bullet points) that:
- Explains why the correct answer is right
- Helps them understand the specific part of the concept they missed
- Is encouraging and supportive (e.g., "That's okay! Let's think about it this way...")
- Uses simple language, NO markdown symbols like ** or __

Keep it brief and friendly.`;

    const result = await model.generateContent(reExplanationPrompt);
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error in generateReExplanation:', error);
    throw error;
  }
};

module.exports = { generateSceneJson, generateChatResponse, generateQuiz, generateReExplanation };