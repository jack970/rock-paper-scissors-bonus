const step1Template = `<div class="step1">
<img src="/images/bg-pentagon.svg" alt="bg-pentagon" />
<div class="icon scissors" onclick="seleciona(event)">
	<img src="/images/icon-scissors.svg" alt="icon-paper.svg" />
</div>
<div class="icon paper" onclick="seleciona(event)">
	<img src="/images/icon-paper.svg" alt="icon-paper.svg" />
</div>
<div class="icon rock" onclick="seleciona(event)">
	<img src="/images/icon-rock.svg" alt="icon-paper.svg" />
</div>
<div class="icon lizard" onclick="seleciona(event)">
	<img src="/images/icon-lizard.svg" alt="icon-paper.svg" />
</div>
<div class="icon spock" onclick="seleciona(event)">
	<img src="/images/icon-spock.svg" alt="icon-paper.svg" />
</div>
</div>`;

const step2Template = (user, house, result) => `
<div class="step2">
	<div class="you">
		<h1>YOU PICKED</h1>
		${user}
	</div>
	<div class="result" onclick="reset()">
		<h1>${result}</h1>
		<button>PLAY AGAIN</button>
	</div>
	<div class="house">
		<h1>THE HOUSE PICKED</h1>
		${house}
	</div>
</div>`;

const rules = [
	{ title: "scissors", won: ["paper", "lizard"], lose: ["rock", "spock"] },
	{ title: "paper", won: ["rock", "spock"], lose: ["scissors", "lizard"] },
	{ title: "rock", won: ["scissors", "lizard"], lose: ["paper", "spock"] },
	{ title: "lizard", won: ["spock", "paper"], lose: ["rock", "scissors"] },
	{ title: "spock", won: ["scissors", "rock"], lose: ["lizard", "paper"] },
];

function render_step1() {
	score = sessionStorage.getItem("score") | 0;
	atualiza_score(score);

	const headerElement = document.querySelector(".cabecalho");
	headerElement.insertAdjacentHTML("afterend", step1Template);
}

function render_step2(userElement, house, result) {
	const step1 = document.querySelector(".step1");

	const step2Element = step2Template(userElement, house.houseElement, result);
	step1.insertAdjacentHTML("afterend", step2Element);
	step1.remove();

	animation_result();
}

function animation_result() {
	setTimeout(function () {
		document.querySelector(".step2").classList.add("step2-transition");
		document.querySelector(".result").classList.add("result-transition");
	}, 1000);
}

function seleciona(e) {
	const userElement = removerAtributo(e.currentTarget.outerHTML);
	const userOption = e.currentTarget.classList[1];

	const house = house_choose();

	const result = is_winner(userOption, house.houseOption);

	render_step2(userElement, house, result);
}

function house_choose() {
	const options = rules.map(({ title }) => title);
	const houseOption = options[Math.floor(Math.random() * options.length)];

	const tempDiv = document.createElement("div");
	tempDiv.innerHTML = step1Template;
	const houseElement = removerAtributo(
		tempDiv.querySelector(`.icon.${houseOption}`).outerHTML
	);
	return { houseOption, houseElement };
}

function is_winner(user, house) {
	const rule_user = rules.find(({ title }) => title === user);

	if (rule_user.won.includes(house)) {
		save_score(true);
		return "Você Venceu!";
	} else if (rule_user.lose.includes(house)) {
		save_score(false);
		return "Você Perdeu!";
	} else {
		return "Empate!";
	}
}

function save_score(is_won) {
	let score = sessionStorage.getItem("score") | 0;
	score = is_won ? score + 1 : score - 1;
	sessionStorage.setItem("score", score);

	atualiza_score(score);
}

function atualiza_score(score) {
	document.getElementById("score-text").innerText = score;
}

function removerAtributo(frase) {
	return frase.replace('onclick="seleciona(event)"', "");
}

function abre_modal() {
	document.querySelector(".modal").classList.toggle("abre-modal");
	document
		.querySelector(".background-modal")
		.classList.toggle("abre-background-modal");
}

function reset() {
	render_step1();

	const step2 = document.querySelector(".step2");
	step2.remove();
}

window.addEventListener("DOMContentLoaded", () => {
	render_step1();
});
