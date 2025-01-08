import { db } from "./firebaseConfig.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Referência à coleção "carregamentos"
const carregamentosRef = collection(db, "carregamentos");

// Função para adicionar um carregamento (CREATE)
async function adicionarCarregamento(carregamento) {
  try {
    const docRef = await addDoc(carregamentosRef, carregamento);
    console.log("Carregamento adicionado com ID:", docRef.id);
  } catch (error) {
    console.error("Erro ao adicionar carregamento:", error);
  }
}

// Função para listar todos os carregamentos (READ)
async function listarCarregamentos() {
  try {
    const querySnapshot = await getDocs(carregamentosRef);
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} =>`, doc.data());
    });
  } catch (error) {
    console.error("Erro ao listar carregamentos:", error);
  }
}

//Função para atualizar um carregamento (UPDATE)
async function atualizarCarregamento(id, carregamento) {
  try {
    await setDoc(doc(carregamentosRef, id), carregamento);
    console.log("Carregamento atualizado com ID:", id);
  } catch (error) {
    console.error("Erro ao atualizar carregamento:", error);
  }
}

// Função para deletar um carregamento (DELETE)
async function deletarCarregamento(id) {
    try {
        await deleteDoc(doc(carregamentosRef, id));
        console.log("Carregamento deletado com ID:", id);
    }
}

// Exemplo de uso
adicionarCarregamento({
  coleta: "Local X",
  produto: "Produto Y",
  quantidadeLiberada: 100,
  entrega: "Local Z",
  pedido: "12345",
});

listarCarregamentos();
