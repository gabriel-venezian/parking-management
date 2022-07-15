interface Veiculo {
  nome: string;
  placa: string;
  entrada: Date | string;
}

(function () {
  const $ = (query: string): HTMLInputElement | null => document.querySelector(query);

  function calcularTempo(ms: number) {
    const minutos = Math.floor(ms / 60000);
    const segundos = Math.floor(ms % 60000);

    return `${minutos}min e ${segundos}s`;
  }

  function patio() {
    function ler(): Veiculo[] {
      return localStorage.patio ? JSON.parse(localStorage.patio) : [];
    }

    function salvar(veiculos: Veiculo[]) {
      localStorage.setItem('patio', JSON.stringify(veiculos));
    }

    function adicionar(veiculo: Veiculo, salva?: boolean) {
      const row = document.createElement('tr');

      row.innerHTML = `
        <td>${veiculo.nome}</td>
        <td>${veiculo.placa}</td>
        <td>${veiculo.entrada}</td>
        <td>
          <button class='apagar' data-placa='${veiculo.placa}'>X</button>
        </td>
      `;

      row.querySelector(".apagar")?.addEventListener('click', function () {
        remover(this.dataset.placa)
      });

      $('#patio')?.appendChild(row);

      if (salva) salvar([...ler(), veiculo]);
    }

    function remover(placa: string) {
      const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);

      const tempo = calcularTempo(new Date().getTime() - new Date(entrada).getTime());

      if (!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)) return;

      salvar(ler().filter(veiculo => veiculo.placa !== placa));
      renderizar();
    }

    function renderizar() {
      $('#patio')!.innerHTML = '';

      const patio = ler();

      if (patio.length) {
        patio.forEach((veiculo => adicionar(veiculo)));
      }
    }

    return { ler, salvar, adicionar, remover, renderizar };
  }

  patio().renderizar();

  $('#cadastrar')?.addEventListener('click', () => {
    const nome = $('#nome')?.value;
    const placa = $('#placa')?.value;

    if (!nome || !placa) {
      alert('Os campos nome e placa são obrigatórios.');
      return;
    }

    patio().adicionar({ nome, placa, entrada: new Date().toISOString() }, true);
  });
})();