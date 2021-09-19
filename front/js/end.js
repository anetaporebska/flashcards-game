const finalScore = document.querySelector('#finalScore')
const known = document.querySelector('#known')
const notKnown  = document.querySelector('#notKnown')

finalScore.innerText = localStorage.getItem("score")
known.innerText = localStorage.getItem("known")
notKnown.innerText = localStorage.getItem("notKnown")

// TODO if Play Again reload database