const express = require('express')
const router = express.Router()
require('dotenv').config();

const { GoogleGenerativeAI,SchemaType } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const schema = {
  description: "Compare 3 models",
  type:SchemaType.OBJECT, // Changed to a simple "object" type
  properties: {
    Scrum: {
      type: "string",
      description: "Comment on this model for the project, limit 90 words",
      nullable: false,
    },
    Kanban: {
      type: "string",
      description: "Comment of this model for the project, limit 90 words",
      nullable: false,
    },
    Extreme_Programming: {
      type: "string",
      description: "Comment of this model for the project limit 90 words",
      nullable: false,
    },
    Summary: {
      type: "string",
      description: "Summary,choose the best limit 100 words",
      nullable: false,
    },

  },
  required: ["Scrum", "Kanban", "Extreme_Programming","Summary"], // Optional: Specify required properties
};

const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash", 
  generationConfig: {responseMimeType: "application/json",responseSchema: schema}, });

router.post("/suggest", async (req, res) => {
    try {
        // Extract the prompt from the request body
        const { prompt } = req.body;
      
        if (!prompt) {
          return res.status(400).json({ error: "Prompt is required" });
        }
        // Call the OpenAI API to get a response
        const prompt2= `Compare 3 models (Kanban,Extreme programming,Scrum) for this project:${prompt}`
       
        const result = await model.generateContent(prompt2);
        const suggestion=result.response.text();
        res.send(suggestion);
       

      } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "An error occurred while processing your request" });
      }
      
      
})
router.get("/test", async (req, res) => {
  return res.json("hmmmm")
})
module.exports = router;