const canvas = document.querySelector("canvas")
const audio = new Audio('../assets/audio.mp3')
const gameAudio = new Audio('../assets/gameAudio.mp3')
const gameoverD = new Audio('../assets/gameoverDemo.mp3')

const ctx = canvas.getContext("2d")  //contexto

//pegar os elementos da paginas para manipular seus valore
const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")


const size = 20

const posicaoInicial = [
    { x: 200, y: 200 },
    { x: 220, y: 200 }
]
let cobra = posicaoInicial

//soma placar
const aumentaPlacar = () =>{
    score.innerText = parseInt(score.innerText) + 10
}

let direcao, loopId
let velocidade = 250

const randomNumero = (mim, max) => { //gera um numero aleatorio entre um minimo e um maximo
    return Math.round(Math.random() * (max - mim) + mim)
}

const randomPosicao = () => {
    const numero = randomNumero(0, canvas.width - size) // gera um numero aleatorio entre 0 e o maximo do canvas menos o tamanho do quadrado
    return Math.round(numero / size) * size
}

const randomCor = () => {
    const red = randomNumero(0, 255)
    const green = randomNumero(0, 255)
    const blue = randomNumero(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosicao(),
    y: randomPosicao(),
    cor: randomCor()
}

const desenhaComida = () => {
    const { x, y, cor } = food

    ctx.shadowColor = cor
    ctx.shadowBlur = 6
    ctx.fillStyle = cor
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const desenhaCobra = () => {
    ctx.fillStyle = "red"

    cobra.forEach((posicao, index) => { //pega a posição de cada elemento
        if (index == cobra.length - 1) {
            ctx.fillStyle = "yellow"
        }
        ctx.fillRect(posicao.x, posicao.y, size, size)
    })


}

const mexeCobra = () => {
    if (!direcao) return // se não houver comando a cobra não se mexe

    const cabeca = cobra[cobra.length - 1] //pega a posição do ultimo elemento

    if (direcao == "direita") {
        cobra.push({ x: cabeca.x + size, y: cabeca.y }) // adiciona um elemento
    }
    if (direcao == "esquerda") {
        cobra.push({ x: cabeca.x - size, y: cabeca.y }) // adiciona um elemento
    }
    if (direcao == "baixo") {
        cobra.push({ x: cabeca.x, y: cabeca.y + size }) // adiciona um elemento
    }

    if (direcao == "cima") {
        cobra.push({ x: cabeca.x, y: cabeca.y - size }) // adiciona um elemento
    }

    cobra.shift() //remove o primeiro elemento

}

const desenhaGrade = () => {
    ctx.lineWidth = 1 //espessura da grade
    ctx.strokeStyle = "#191919" //cor da grade

    for (let i = 20; i < canvas.width; i += 20) {  //for pra desenhar as linhas no x e y
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, canvas.width)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(canvas.height, i)
        ctx.stroke()
    }
}

const verificaComida = () => {
    const cabeca = cobra[cobra.length - 1] // verifica a posição da cabeça

    if (cabeca.x == food.x && cabeca.y == food.y) {
        aumentaPlacar()
        cobra.push(cabeca) //adiciona um elemento a cobra
        audio.play()

        let x = randomPosicao()
        let y = randomPosicao()

        while (cobra.find((posicao) => posicao.x == x && posicao.y == y)) {
            x = randomPosicao()
            y = randomPosicao()
        }

        food.x = x
        food.y = y
        food.cor = randomCor()
    }
}

const verificaColisao = () =>{
    const cabeca = cobra[cobra.length - 1] // verifica a posição da cabeça
    const pescoco = cobra.length - 2

    const limiteCanvas = canvas.width - size
    const colisaoParede = cabeca.x < 0 || cabeca.x > limiteCanvas || cabeca.y < 0 || cabeca.y > limiteCanvas

    const colisaoCobra = cobra.find((posicao, index) => {
        return index < pescoco && posicao.x == cabeca.x && posicao.y == cabeca.y
    })

    if (colisaoParede || colisaoCobra) {
        gameOver()
    }
}

const gameOver = () => {
    direcao = undefined
    
    gameoverD.play()
    menu.style.display = "flex"
    
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
    gameoverD.ended()
}

const gameLoop = () => {
    clearInterval(loopId) // usa o id do loop para resetar o loop evitando bugs
    gameAudio.play()
    gameAudio.volume = 0.1
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    desenhaGrade()
    desenhaComida()
    mexeCobra()
    desenhaCobra()
    verificaComida()
    verificaColisao()

    loopId = setTimeout(() => {
        gameLoop()
    }, velocidade)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => { //função para pegar a tecla precionada
    if (key == "ArrowRight" && direcao != "esquerda") {
        direcao = "direita"
    }
    if (key == "ArrowLeft" && direcao != "direita") {
        direcao = "esquerda"
    }
    if (key == "ArrowDown" && direcao != "cima") {
        direcao = "baixo"
    }
    if (key == "ArrowUp" && direcao != "baixo") {
        direcao = "cima"
    }

    console.log({ key })
})

buttonPlay.addEventListener("click", ()=>{
    menu.style.display = "none"
    score.innerText = "00"
    canvas.style.filter = "none"
    cobra = [
        { x: 200, y: 200 },
        { x: 220, y: 200 }
    ]
})

