let stats = []
let days = []
let score = []
let known = []
let notKnown = []

async function getData() {
    const response = await fetch('/stats');
    stats = await response.json();
}

async function displayCharts() {
    await getData()

    stats.sort(function (a, b) { return new Date(a.date) - new Date(b.date) });

    stats.forEach(entry => {
        days.push(new Date(entry.date).toLocaleDateString().substring(0, 5))
        score.push(entry.score)
        known.push(entry.known)
        notKnown.push(entry.notKnown)
    })

    let scoreCtx = document.getElementById('scoreChart').getContext('2d');
    let scoreChart = new Chart(scoreCtx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'score',
                data: score,
                backgroundColor: [
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    let questionsCtx = document.getElementById('questionsChart').getContext('2d');
    let questionsChart = new Chart(questionsCtx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'known',
                data: known,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            },
            {
                label: 'notKnown',
                data: notKnown,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

}

displayCharts()