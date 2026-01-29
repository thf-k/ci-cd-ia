const { GoogleGenAI } = require("@google/genai");

function createClient(apiKey) {
  return new GoogleGenAI({ apiKey });
}

module.exports = { createClient };
