// Importação das funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyByDgJPA0wP9lFBzFIGDMFPo1uZFsoo_g4",
  authDomain: "controle-de-frete-21c73.firebaseapp.com",
  projectId: "controle-de-frete-21c73",
  storageBucket: "controle-de-frete-21c73.firebasestorage.app",
  messagingSenderId: "8256813156",
  appId: "1:8256813156:web:0fe3fb45c4dcfb0782c771",
  measurementId: "G-QHN2TXVWPQ",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Inicializa Firestore

export { app, db };
