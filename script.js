const listaBotoes = document.querySelectorAll(".filtro");
const listaImagens = document.querySelectorAll(".miniatura");
const galeriaContainer = document.getElementById("galeria");

const totalImagens = document.querySelector("#totalImagens");

const modal = document.querySelector("#modal");
const btnFechar = document.getElementById("fechar");
const btnAnterior = document.getElementById("anterior");
const imagemModal = document.getElementById("imagemModal");
const contador = document.getElementById("contador");
const nomeImagem = document.getElementById("nomeImagem");
const categoriaModal = document.getElementById("categoriaModal");
const descricaoModal = document.getElementById("descricaoModal");
const localModal = document.getElementById("localModal");
const btnProximo = document.getElementById("proximo");

let imagensVisiveis = [];
let indiceAtual = 0;

function atualizarImagensVisiveis() {
    imagensVisiveis = Array.from(listaImagens).filter(function (imagem) {
        return !imagem.classList.contains("oculta");
    });

    if (totalImagens) {
        totalImagens.textContent = `Exibindo ${imagensVisiveis.length} de ${listaImagens.length} imagens`;
    }
}

function filtrarImagens(categoria) {
    // Padroniza o tamanho das fotos quando há um filtro ativo[cite: 3]
    if (categoria === "todas") {
        galeriaContainer.classList.remove("modo-filtrado");
    } else {
        galeriaContainer.classList.add("modo-filtrado");
    }

    listaImagens.forEach((imagem) => {
        const categoriaImagem = imagem.dataset.categoria;

        if (categoria === "todas" || categoriaImagem === categoria) {
            imagem.classList.remove("oculta");
            imagem.tabIndex = 0;

            imagem.style.animation = "none";
            imagem.offsetHeight; // Forçar reflow
            imagem.style.animation = "surgir 0.4s ease";
        } else {
            imagem.classList.add("oculta");
            imagem.tabIndex = -1;
        }
    });

    atualizarImagensVisiveis();
}

listaBotoes.forEach((botao) => {
    botao.addEventListener("click", () => {
        let categoria = botao.dataset.filtro;

        listaBotoes.forEach((item) => {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");
        filtrarImagens(categoria);
    });
});

function mostrarImagem(indice) {
    let quantidade = imagensVisiveis.length;

    if (quantidade === 0) return;

    // Navegação circular
    indiceAtual = (indice + quantidade) % quantidade;

    const imagem = imagensVisiveis[indiceAtual];

    imagemModal.src = imagem.src;
    imagemModal.alt = imagem.alt;
    nomeImagem.textContent = imagem.alt;

    // Atualização de todas as informações do modal
    categoriaModal.textContent = imagem.dataset.categoria || "";
    descricaoModal.textContent = imagem.dataset.descricao || "";
    localModal.textContent = imagem.dataset.local ? `Local: ${imagem.dataset.local}` : "";

    contador.textContent = `${indiceAtual + 1} de ${quantidade}`;
}

function abrirModal(imagem) {
    indiceAtual = imagensVisiveis.indexOf(imagem);
    modal.classList.add("ativo");
    modal.setAttribute("aria-hidden", "false");
    mostrarImagem(indiceAtual);
}

function fecharModal() {
    modal.classList.remove("ativo");
    modal.setAttribute("aria-hidden", "true");
}

listaImagens.forEach((imagem) => {
    imagem.addEventListener("click", () => {
        abrirModal(imagem);
    });

    imagem.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            abrirModal(imagem);
        }
    });
});

btnFechar.addEventListener("click", fecharModal);

// Fechar ao clicar na área escura externa
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        fecharModal();
    }
});

btnProximo.addEventListener("click", () => {
    mostrarImagem(indiceAtual + 1);
});

btnAnterior.addEventListener("click", () => {
    mostrarImagem(indiceAtual - 1);
});

document.addEventListener("keydown", (evento) => {
    if (!modal.classList.contains("ativo")) return;

    if (evento.key === "Escape") {
        fecharModal();
    }

    if (evento.key === "ArrowRight") {
        mostrarImagem(indiceAtual + 1);
    }
    if (evento.key === "ArrowLeft") {
        mostrarImagem(indiceAtual - 1);
    }
});

// Inicialização
filtrarImagens("todas");