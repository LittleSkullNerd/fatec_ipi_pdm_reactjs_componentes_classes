import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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
    console.log("Construtor");
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

  // Métodos do ciclo de vida
  componentDidMount() {
    console.log("componentDidMount");
    this.obterLocalizacao();
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

  componentWillUnmount() {
    console.log("componentWillUnmount");
  }

  render() {
    console.log("Render");
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card text-center">
              <div className="card-header">
                <h3>Estação Climática</h3>
              </div>
              <div className="card-body">
                <h5 className="card-title">Sua estação é:</h5>
                <p className="card-text">
                  {this.state.latitude
                    ? `Estação: ${this.state.estacao}, Latitude: ${this.state.latitude}, Longitude: ${this.state.longitude}`
                    : this.state.mensagemDeErro || "Obtendo localização..."}
                </p>
                <button
                  className="btn btn-outline-primary"
                  onClick={this.obterLocalizacao}
                >
                  Atualizar Estação
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
