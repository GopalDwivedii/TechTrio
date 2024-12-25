const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

// API configuration
const API_KEY = ""; // Your API key here
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// IIT-related keywords
const iitKeywords = [
  "IIT", "Indian Institute of Technology", "IIT Delhi", "IIT Bombay", "IIT Kanpur","IIT Guwahati", 
  "IIT Bhilai","IIT Jammu","IIT Tirupati","IIT Dharwad","IIT Palakkad","IIT Kharagpur","IIT Goa",
  "IIT Varanasi","IIT BHU","BHU","IIT Ropar","IIT ISM","IIT Roorkee","IIT Patna","IIT Gandhinagar",
  "IIT Madras","IIT Chennai","IIT Jodhpur","IIT Hyderabad","IIT Indore","IIT Mandi","IIT Bhubneshwar",
  "IIT ranking", "IIT admission","JEE", "IIT courses", "IIT faculty", "IIT research", "IIT fees"
]; 

// Function to check if the message is related to IITs
const isIITRelated = (message) => {
  return iitKeywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()));
};

// Function to create a chat <li> element
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent = className === "outgoing" 
    ? `<p></p>` 
    : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

// Function to generate the response
const generateResponse = async (chatElement) => {
  const messageElement = chatElement.querySelector("p");

  // Check if the message is related to IITs
  if (!isIITRelated(userMessage)) {
    messageElement.textContent = "I can only answer questions related to IITs. Please ask something about IITs.";
    return;
  }

  // Define the properties and message for the API request
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      contents: [{ 
        role: "user", 
        parts: [{ text: userMessage }] 
      }] 
    }),
  };

  // Send POST request to API, get response, and update the message element
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    messageElement.textContent = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
  } catch (error) {
    messageElement.classList.add("error");
    messageElement.textContent = error.message;
  } finally {
    chatbox.scrollTo(0, chatbox.scrollHeight);
  }
};

// Function to handle the chat
const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if (!userMessage) return;

  // Clear the input textarea and reset its height
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  // Display "Thinking..." message and generate the response
  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

// Event listener for the chat input
chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Event listener for the "Enter" key press to send the message
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

// Event listener for the send button click
sendChatBtn.addEventListener("click", handleChat);

// Event listeners for opening and closing the chatbot
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
