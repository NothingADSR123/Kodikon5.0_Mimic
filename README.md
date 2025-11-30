# 🌟 Mimic — AI-Powered 3D Visual Copilot  
*A neuro-inclusive, multimodal learning assistant.*

Mimic is an intelligent 3D visualization companion designed to help users — especially neurodivergent thinkers — understand complex concepts through **interactive 3D scenes**, **simplified explanations**, **soothing voice narration**, **adaptive chat guidance**, and **AI-generated quizzes**.

<p align="center" style="margin-top:-20px; margin-bottom:-15px;">
  <img src="./client/src/assets/logo.png" width="260" alt="Mimic Logo" />
</p>

## 👥 Contributors

This project was made possible by the **creativity, teamwork, and dedication** of our amazing team 🚀  

<table align="center">
  <tr>

   <td align="center" style="padding: 10px;">
      <a href="https://github.com/NothingADSR123" style="text-decoration:none; color:inherit;">
        <img src="https://github.com/NothingADSR123.png" width="110" height="110" style="border-radius:50%;"/>
        <br/><b>Aditya</b>
      </a>
    </td>

   <td align="center" style="padding: 10px;">
      <a href="https://github.com/ShreyaSriranga" style="text-decoration:none; color:inherit;">
        <img src="https://github.com/ShreyaSriranga.png" width="110" height="110" style="border-radius:50%;"/>
        <br/><b>Shreya Sriranga</b>
      </a>
    </td>

  <td align="center" style="padding: 10px;">
      <a href="https://github.com/SpaceIsVoidless" style="text-decoration:none; color:inherit;">
        <img src="https://github.com/SpaceIsVoidless.png" width="110" height="110" style="border-radius:50%;"/>
        <br/><b>Aaron</b>
      </a>
    </td>

   <td align="center" style="padding: 10px;">
      <a href="https://github.com/sirishax" style="text-decoration:none; color:inherit;">
        <img src="https://github.com/sirishax.png" width="110" height="110" style="border-radius:50%;"/>
        <br/><b>Chaya</b>
      </a>
    </td>

  </tr>
</table>

⚡️ Each member contributed significantly — from building the dashboard, implementing multimodal AI flows, designing accessible UI, creating the 3D pipeline, and developing backend APIs.


---

## ✨ Features

### 🔹 AI 3D Scene Generation  
Enter any concept, and Mimic generates a **JSON Scene Graph** using Gemini, then renders it into an **interactive 3D scene** using React Three Fiber.

### 🔹 Step-by-Step Visual Animation  
Navigate complex processes using **Prev / Next** steps inside the 3D scene.

### 🔹 Simple Cognitive-Friendly Explanation  
Each concept includes a **clear, simplified explanation** optimized for reduced cognitive load.

### 🔹 Soothing Voice Narration (AudioBot)  
A calming female voice reads the explanation aloud via Text-to-Speech.

### 🔹 Chat with Mimic (AI Copilot)  
Ask follow-up questions and explore deeper understanding.

### 🔹 AI-Generated Concept Quiz  
Mimic tests your understanding with automatically generated quizzes — and re-explains wrong answers.

### 🔹 Modern Neurodivergent-Friendly UI  
Soft visuals • calming color palette • clean layout • reduced sensory overload.

---

## 🏗️ Tech Stack

### **Frontend**
- React.js  
- React Three Fiber (R3F)  
- Three.js  
- ReactMarkdown  
- Axios  
- Custom CSS

### **Backend**
- Node.js  
- Express.js  
- Gemini API (Scene Graph, Chat, Quiz, Explanations)  
- Google / Gemini TTS  
- Custom AI Services  

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate-scene` | Generates scene graph + explanation |
| POST | `/api/ai/chat` | Chatbot response |
| POST | `/api/ai/quiz` | Creates quiz |
| POST | `/api/ai/re-explain` | Re-explanation for incorrect answers |
| POST | `/api/tts` | Audio generation (TTS) |

---

## 📂 Project Structure

