import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      estacao: null,
      data: null,
      icone: null,
      mensagemDeErro: null,
    };
  }

  // Função para obter a estação climática
  obterEstacao = (data, latitude) => {
    const anoAtual = data.getFullYear();
    const d1 = new Date(anoAtual, 5, 23);
    const d2 = new Date(anoAtual, 8, 24);
    const d3 = new Date(anoAtual, 11, 22);
    const d4 = new Date(anoAtual, 2, 21);
    const sul = latitude < 0;
    if (data >= d1 && data < d2) return sul ? "Inverno" : "Verão";
    if (data >= d2 && data < d3) return sul ? "Primavera" : "Outono";
    if (data >= d3 || data < d1) return sul ? "Verão" : "Inverno";
    return sul ? "Outono" : "Primavera";
  };

  // Mapeamento de ícones
  icones = {
    Primavera: "fa-seedling",
    Verão: "fa-umbrella-beach",
    Outono: "fa-tree",
    Inverno: "fa-snowman",
  };

  // Função para obter a localização do usuário
  obterLocalizacao = () => {
    window.navigator.geolocation.getCurrentPosition(
      (posicao) => {
        let data = new Date();
        let estacao = this.obterEstacao(data, posicao.coords.latitude);
        let icone = this.icones[estacao];
        this.setState({
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude,
          estacao: estacao,
          data: data.toLocaleTimeString(),
          icone: icone,
        });
      },
      (erro) => {
        this.setState({ mensagemDeErro: "Tente novamente mais tarde" });
      }
    );
  };

  // Renderização do componente
  render() {
    return (
      <div className="container mt-2">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <div
                  className="d-flex align-items-center border rounded mb-2"
                  style={{ height: "6rem" }}
                >
                  <i className={`fas fa-5x ${this.state.icone}`}></i>
                  <p className="w-75 ms-3 text-center fs-1">
                    {this.state.estacao}
                  </p>
                </div>
                <div>
                  <p className="text-center">
                    {this.state.latitude
                      ? `Coordenadas: ${this.state.latitude}, ${this.state.longitude}. Data: ${this.state.data}`
                      : this.state.mensagemDeErro
                      ? this.state.mensagemDeErro
                      : "Clique no botão para saber a sua estação climática"}
                  </p>
                </div>
                <button
                  onClick={this.obterLocalizacao}
                  className="btn btn-outline-primary w-100 mt-2"
                >
                  Qual a minha estação?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
