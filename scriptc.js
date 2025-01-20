// Add this at the start of your script.js file
// DOM Elements for authentication
const authContainer = document.getElementById('auth-container');
const chatbotContainer = document.getElementById('chatbot-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');

// Simple user storage
const users = JSON.parse(localStorage.getItem('users')) || [];

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        authContainer.style.display = 'none';
        chatbotContainer.style.display = 'block';
    } else {
        authContainer.style.display = 'flex';
        chatbotContainer.style.display = 'none';
    }
}

// Register Form Handler
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (users.find(user => user.email === email)) {
        alert('User already exists!');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('register-box').style.display = 'none';
    document.getElementById('login-form').parentElement.style.display = 'block';
    alert('Registration successful! Please login.');
});

// Login Form Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        checkAuth();
    } else {
        alert('Invalid credentials!');
    }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    checkAuth();
});

// Toggle between login and register forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-box').style.display = 'block';
    document.getElementById('login-form').parentElement.style.display = 'none';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-box').style.display = 'none';
    document.getElementById('login-form').parentElement.style.display = 'block';
});

// Check authentication status when page loads
checkAuth();

// Your existing chatbot code continues here...

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
