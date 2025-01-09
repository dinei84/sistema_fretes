// firebaseConfig.js
import { db } from "./firebaseConfig.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  updateDoc
} from "firebase/firestore";

// Constants
const COLLECTIONS = {
  CARREGAMENTOS: 'carregamentos',
  CLIENTES: 'clientes',
  TRANSPORTADORAS: 'transportadoras'
};

// Error handling utility
class DatabaseError extends Error {
  constructor(message, operation, entity) {
    super(message);
    this.operation = operation;
    this.entity = entity;
    this.name = 'DatabaseError';
  }
}

// Generic CRUD operations
class FirebaseService {
  constructor(collectionName) {
    this.collectionRef = collection(db, collectionName);
    this.collectionName = collectionName;
  }

  async create(data) {
    try {
      const timestamp = new Date().toISOString();
      const docRef = await addDoc(this.collectionRef, {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp,
        active: true
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      throw new DatabaseError(
        `Erro ao criar ${this.collectionName}: ${error.message}`,
        'CREATE',
        this.collectionName
      );
    }
  }

  async getAll(filters = {}, sortBy = 'createdAt', descending = true, itemLimit = 100) {
    try {
      let queryRef = this.collectionRef;

      // Apply filters
      Object.entries(filters).forEach(([field, value]) => {
        queryRef = query(queryRef, where(field, '==', value));
      });

      // Apply sorting and limit
      queryRef = query(
        queryRef,
        orderBy(sortBy, descending ? 'desc' : 'asc'),
        limit(itemLimit)
      );

      const querySnapshot = await getDocs(queryRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new DatabaseError(
        `Erro ao listar ${this.collectionName}: ${error.message}`,
        'READ',
        this.collectionName
      );
    }
  }

  async getById(id) {
    try {
      const docRef = doc(this.collectionRef, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error(`${this.collectionName} não encontrado`);
      }
      
      return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
      throw new DatabaseError(
        `Erro ao buscar ${this.collectionName}: ${error.message}`,
        'READ',
        this.collectionName
      );
    }
  }

  async update(id, data) {
    try {
      const docRef = doc(this.collectionRef, id);
      const timestamp = new Date().toISOString();
      
      await updateDoc(docRef, {
        ...data,
        updatedAt: timestamp
      });
      
      return { id, ...data };
    } catch (error) {
      throw new DatabaseError(
        `Erro ao atualizar ${this.collectionName}: ${error.message}`,
        'UPDATE',
        this.collectionName
      );
    }
  }

  async delete(id) {
    try {
      // Soft delete
      await this.update(id, { active: false });
      return { id, success: true };
    } catch (error) {
      throw new DatabaseError(
        `Erro ao deletar ${this.collectionName}: ${error.message}`,
        'DELETE',
        this.collectionName
      );
    }
  }

  async hardDelete(id) {
    try {
      await deleteDoc(doc(this.collectionRef, id));
      return { id, success: true };
    } catch (error) {
      throw new DatabaseError(
        `Erro ao deletar permanentemente ${this.collectionName}: ${error.message}`,
        'HARD_DELETE',
        this.collectionName
      );
    }
  }
}

// Specific services with custom methods if needed
export class CarregamentoService extends FirebaseService {
  constructor() {
    super(COLLECTIONS.CARREGAMENTOS);
  }

  // Exemplo de método específico para carregamentos
  async getByPedido(numeroPedido) {
    try {
      const q = query(
        this.collectionRef,
        where('pedido', '==', numeroPedido)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new DatabaseError(
        `Erro ao buscar carregamento por pedido: ${error.message}`,
        'READ',
        this.collectionName
      );
    }
  }
}

export class ClienteService extends FirebaseService {
  constructor() {
    super(COLLECTIONS.CLIENTES);
  }

  // Exemplo de método específico para clientes
  async getByEmail(email) {
    try {
      const q = query(
        this.collectionRef,
        where('email', '==', email.toLowerCase())
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new DatabaseError(
        `Erro ao buscar cliente por email: ${error.message}`,
        'READ',
        this.collectionName
      );
    }
  }
}

export class TransportadoraService extends FirebaseService {
  constructor() {
    super(COLLECTIONS.TRANSPORTADORAS);
  }

  // Exemplo de método específico para transportadoras
  async getByTelefone(telefone) {
    try {
      const q = query(
        this.collectionRef,
        where('telefone', '==', telefone)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new DatabaseError(
        `Erro ao buscar transportadora por telefone: ${error.message}`,
        'READ',
        this.collectionName
      );
    }
  }
}

// Exemplo de uso
async function exemplo() {
  const carregamentoService = new CarregamentoService();
  const clienteService = new ClienteService();
  const transportadoraService = new TransportadoraService();

  try {
    // Criar um novo carregamento
    const novoCarregamento = await carregamentoService.create({
      coleta: "Local X",
      entrega: "Local Y",
      pedido: "SP50021",
      produto: "Produto Z",
      quantidadeLiberada: 100
    });

    // Listar carregamentos com filtros
    const carregamentos = await carregamentoService.getAll(
      { active: true },
      'createdAt',
      true,
      10
    );

    // Buscar carregamento por pedido
    const carregamentosPedido = await carregamentoService.getByPedido("SP50021");

  } catch (error) {
    if (error instanceof DatabaseError) {
      console.error(`[${error.operation}][${error.entity}] ${error.message}`);
    } else {
      console.error('Erro inesperado:', error);
    }
  }
}