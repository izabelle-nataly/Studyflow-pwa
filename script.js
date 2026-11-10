const form = document.getElementById("form-tarefa");

const nome = document.getElementById("nome");
const materia = document.getElementById("materia");
const data = document.getElementById("data");

const lista = document.getElementById("lista-tarefas");

const totalTarefas = document.getElementById("total-tarefas");
const totalPendentes = document.getElementById("total-pendentes");
const totalConcluidas = document.getElementById("total-concluidas");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let filtroAtual = "todas";

// Salva as tarefas no navegador
function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Atualiza os números da tela
function atualizarEstatisticas() {
    totalTarefas.textContent = tarefas.length;

    totalPendentes.textContent =
        tarefas.filter(tarefa => !tarefa.concluida).length;

    totalConcluidas.textContent =
        tarefas.filter(tarefa => tarefa.concluida).length;
}

// Mostra as tarefas na tela
function mostrarTarefas() {
    lista.innerHTML = "";

    let tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtroAtual === "pendentes") {
            return !tarefa.concluida;
        }

        if (filtroAtual === "concluidas") {
            return tarefa.concluida;
        }

        return true;
    });

    if (tarefasFiltradas.length === 0) {
        lista.innerHTML = `
            <p class="empty-message">
                Nenhuma tarefa encontrada.
            </p>
        `;
    }

    tarefasFiltradas.forEach(tarefa => {
        const card = document.createElement("div");

        card.className = "task-card";

        const informacoes = document.createElement("div");
        informacoes.className = "task-info";

        const titulo = document.createElement("h3");
        titulo.textContent = tarefa.nome;

        if (tarefa.concluida) {
            titulo.classList.add("completed-title");
        }

        const materiaTexto = document.createElement("p");
        materiaTexto.textContent = "Matéria: " + tarefa.materia;

        const dataTexto = document.createElement("p");
        dataTexto.textContent = "Entrega: " + tarefa.data;

        const status = document.createElement("span");
        status.className = tarefa.concluida
            ? "task-status completed"
            : "task-status";

        status.textContent = tarefa.concluida
            ? "Concluída"
            : "Pendente";

        informacoes.append(
            titulo,
            materiaTexto,
            dataTexto,
            status
        );

        const acoes = document.createElement("div");
        acoes.className = "task-actions";

        const botaoConcluir = document.createElement("button");
        botaoConcluir.className = "complete-button";
        botaoConcluir.textContent = tarefa.concluida ? "↩" : "✓";
        botaoConcluir.title = tarefa.concluida
            ? "Desmarcar conclusão"
            : "Concluir tarefa";

        botaoConcluir.addEventListener("click", () => {
            concluirTarefa(tarefa.id);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.className = "delete-button";
        botaoExcluir.textContent = "🗑";
        botaoExcluir.title = "Excluir tarefa";

        botaoExcluir.addEventListener("click", () => {
            excluirTarefa(tarefa.id);
        });

        acoes.append(botaoConcluir, botaoExcluir);

        card.append(informacoes, acoes);

        lista.appendChild(card);
    });

    atualizarEstatisticas();
}

// Cadastra uma nova tarefa
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const novaTarefa = {
        id: Date.now(),
        nome: nome.value.trim(),
        materia: materia.value.trim(),
        data: data.value,
        concluida: false
    };

    tarefas.push(novaTarefa);

    salvarTarefas();
    mostrarTarefas();

    form.reset();
});

// Marca ou desmarca uma tarefa
function concluirTarefa(id) {
    tarefas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
            tarefa.concluida = !tarefa.concluida;
        }

        return tarefa;
    });

    salvarTarefas();
    mostrarTarefas();
}

// Exclui uma tarefa
function excluirTarefa(id) {
    const confirmar = confirm("Deseja excluir esta tarefa?");

    if (confirmar) {
        tarefas = tarefas.filter(tarefa => tarefa.id !== id);

        salvarTarefas();
        mostrarTarefas();
    }
}

// Filtra as tarefas
document.querySelectorAll(".filter-button").forEach(botao => {
    botao.addEventListener("click", () => {

        document.querySelectorAll(".filter-button").forEach(item => {
            item.classList.remove("active");
        });

        botao.classList.add("active");

        filtroAtual = botao.dataset.filter;

        mostrarTarefas();
    });
});

// Registra o Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("Aplicativo pronto para uso offline!"))
            .catch(erro => console.log("Erro no Service Worker:", erro));
    });
}

// Mostra as tarefas ao abrir o aplicativo
mostrarTarefas();
