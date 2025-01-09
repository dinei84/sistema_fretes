document.querySelector('.dropbtn').addEventListener('click', function() {
    const dropdown = this.parentElement; // Pega o elemento pai (div.dropdown)
    dropdown.classList.toggle('active'); // Alterna a classe 'active'
});


function buscar(tipo) {
    const query = document.querySelector('.search-input').value;
    if (!query) {
      alert('Por favor, insira um termo para buscar.');
      return;
    }
  
    switch (tipo) {
      case 'cliente':
        console.log(`Buscando cliente: ${query}`);
        // Implementar lógica de busca por cliente
        break;
      case 'transportadora':
        console.log(`Buscando transportadora: ${query}`);
        // Implementar lógica de busca por transportadora
        break;
      case 'carregamento':
        console.log(`Buscando carregamento: ${query}`);
        // Implementar lógica de busca por carregamento
        break;
      default:
        console.log('Tipo de busca inválido');
    }
  }
  