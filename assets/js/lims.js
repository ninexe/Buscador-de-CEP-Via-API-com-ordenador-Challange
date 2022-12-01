//Limpa o Storage, para não deixar lixo na memoria.
localStorage.clear("corpo")

//instanciando corpo para receber os dados da table.
let corpo = new Array();

//buscando valores da coluna que o usuario está clicando.
$('th').on('click', function () {
  var column = $(this).data('column')
  var order = $(this).data('order')
  var text = $(this).html()
  if (column != 'logradouro') {
    //deletando o caracter onde está o simbolo para alterar entre crescente e decrescente
    text = text.substring(0, text.length - 1)
    
    // ordena usando a função sort, para crescente
    if (order == 'desc') {
      $(this).data('order', "asc")
      corpo = corpo.sort((a, b) => a[column] > b[column] ? 1 : -1)
      text += ' &#9660'
    } else { // se não apenas ordena par decrescente
      $(this).data('order', "desc")
      corpo = corpo.sort((a, b) => a[column] < b[column] ? 1 : -1)
      text += '&#9650'

    }
    $(this).html(text)
    listarTable(corpo)
  }

})

//função para requisitar a api 
function getAddress() {
  let cep = document.querySelector("#cep").value;
  if (cep.length !== 8) {
    alert("CEP Inválido, tente novamente.");
    let result = document.querySelector(".form");
    result.innerHTML = ``
    return;
  }


  let apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      insertResult(data);
    })

  });

};

//função para aparecer os dados em tela, caso deseje salvar
function insertResult(dados) {
  let result = document.querySelector(".form");
  if (dados.erro) {
    alert("CEP Inválido, tente novamente.")
  } else {
    result.innerHTML = `
    <p>Endereço: <label id="endereco">${dados.logradouro}</label></p>
    <p>Bairro: <label id="bairro">${dados.bairro}</label></p>
    <p>UF: <label id="uf">${dados.uf}</label> </p>
    <p>Cidade: <label id="cidade">${dados.localidade}</label></p>
    <button class="btn btn-primary shadow" type="submit" style="margin-bottom: 20px;">Salvar</button>
    `
  }

};

//função para transformar os dados recebidos em array e salvar no localstorage
function saveResult() {
  event.preventDefault()
  let endereco = document.querySelector("#endereco").innerHTML
  let bairro = document.querySelector("#bairro").innerHTML
  let uf = document.querySelector("#uf").innerHTML
  let cidade = document.querySelector("#cidade").innerHTML
  if (localStorage.hasOwnProperty("corpo")) {
    // Recuperar os valores da propriedade usuarios do localStorage
    // Converte de String para Object
    corpo = JSON.parse(localStorage.getItem("corpo"));
  }
  // Adiciona um novo objeto no array criado
  corpo.push({ "logradouro": endereco, "bairro": bairro, "uf": uf, "localidade": cidade });

  // Salva no localStorage
  localStorage.setItem("corpo", JSON.stringify(corpo));

  listarTable(corpo);


};

//função para listar em tabela, todos os valores recebidos pela api
function listarTable(pCorpo) {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";
  for (let i = 0; i < pCorpo.length; i++) {
    let row = `<tr>
                    <td>${pCorpo[i].logradouro}</td>
                    <td>${pCorpo[i].bairro}</td>
                    <td>${pCorpo[i].localidade}</td>
                    <td>${pCorpo[i].uf}</td>
               </tr>`
    tbody.innerHTML += row;

  }
};
