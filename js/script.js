const game = {
    itens: [
        'Javascript',
        'CSS3',
        'HTML5',
        'NodeJS',
        'TypeScript',
        'Next',
        'React'
    ],
    els: [],
    table: document.querySelector('#table'),
    matched: false,
    flipped: 0,
    blocked: true,
    project_index: "Informação confidencial",
    answered: [],
    card_fliped: 0,
    crono: 0,
    count_down: 10
}

const toggleEls = (hide, show) => {
    document.querySelector(`#${hide}`).style.display = 'none'
    document.getElementById(`#${show}`).style.display = ''
}

const showElById = id => {
    el = document.querySelector(`${id}`)
    el.style.display = "block";
}

const shuffle = array => {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function createEls(){
    for(i = 0; i < game.itens.length; i++){
        elGoal = document.createElement('div')
        elGoal.classList.add('goal-item')
        elGoal.setAttribute('index',i)
        elGoal.innerHTML = game.itens[i]
        goal_box = document.getElementById('goal-list-box')

        goal_box.append(elGoal)

        elCard = document.createElement('div')
        elCard.classList.add('card')
        elCard.setAttribute('par',i)
        elCard.innerHTML = 
        `
        <div class="content">
            <div class="front">
                <svg class="octicon octicon-mark-github v-align-middle" height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            </div>
            <div class="back">
                <div class="text">
                    ${game.itens[i]}
                </div>
            </div>
        </div>
        `

        game.els.push(elCard)
    }
    console.log(i + " elementos carregados.")
}

function setEls(){
    temp = []
    for(i = 0; i < game.itens.length; i++){
        temp.push(game.els[i])
        temp.push(game.els[i].cloneNode(true))
    }
    temp = shuffle(temp)
    for(i = 0; i < temp.length; i++){
        game.table.append(temp[i])
    }
}

function setEvents(){
    cards = document.getElementsByClassName('card')
    for(i = 0; i < cards.length; i++){
        cards[i].setAttribute('index', i)
        cards[i].addEventListener('click', function(){
            chooseCard(this)
        });
    }
}

function initGame(){
    countDown()
    cards_init = document.getElementsByClassName('content')
    temp = 0;
    timeout = 225
    temp = 0
    interval_i = cards_init.length * timeout
    interval_init = setInterval(() => {
        if(temp < cards_init.length){
            cards_init = document.getElementsByClassName('content')
            cards_init[temp].classList.add("flipped")
            temp = temp + 1            
        }
        else {
            temp = 0;
            clearInterval(interval_init);
        }
    }, timeout);


    setTimeout(() => {
        interval_end = setInterval(() => {
        if(temp < cards_init.length){
            cards_init = document.getElementsByClassName('content')
            cards_init[temp].classList.remove("flipped")
            temp = temp + 1            
        }
        else {
            clearInterval(interval_end);
            game.blocked = false
        }
    }, timeout);
    document.getElementById('goal').style.display = "block"
    }, game.count_down * 1000);
}

function chooseCard(el){
    /*content = el.getElementsByClassName('content')[0]
    content.classList.add('flipped')*/
    content = el.getElementsByClassName('content')[0]
    check_flip = content.classList.value.indexOf('flipped') > -1 ? true : false

    if(game.matched){
        game.matched = false;
        check_bolean = game.answered[game.answered.length-1].result
        console.log(check_bolean)
        nextStep(check_bolean)
    }

    flipped = game.flipped
    if(!check_flip && game.blocked == false){
        if(flipped == 0){
            content.classList.add('flipped')
            game.flipped = flipped + 1
            index = el.getAttribute('index')
            par = el.getAttribute('par')
            game.first = {
                index: index,
                par: par,
                el: content
            }
        }
        else if(flipped == 1){
            content.classList.add('flipped')
            game.flipped = flipped + 1
            index = el.getAttribute('index')
            par = el.getAttribute('par')
            game.blocked = true
            game.second = {
                index: index,
                par: par,
                el: content
            }
            matchCards()
        }
        else {
            game.flipped = 0
        }
    }
    else {
        console.log("Essa carta está virada, escolhe outra ai na moral")
    }
    console.log(el.getAttribute('index'))
}

function matchCards(){
    if(game.first.par == game.second.par){
        console.log("Acertou")
        document.getElementById('correct').classList.add('opened')
        game.answered.push({id: game.answered.length, result: true})
        game.first.el.getElementsByClassName('text')[0].style.color = "#0E6655"
        game.first.el.getElementsByClassName('text')[0].style.backgroundColor = "#D0ECE7"    
        game.second.el.getElementsByClassName('text')[0].style.color = "#0E6655"
        game.second.el.getElementsByClassName('text')[0].style.backgroundColor = "#D0ECE7" 

        game.card_fliped = game.card_fliped + 2
        game.flipped = 0

        updateGoals()
    }
    else {
        console.log("Errou")
        game.answered.push({id: game.answered.length, result: false})
        document.getElementById('error').classList.add('opened')
    }
    game.matched = true;

    
    if(game.card_fliped == (game.itens.length*2)){
        setTimeout(function(){
            toggleEls('table','result')
            document.getElementById('result').style.display = "block"
            clearInterval(crono_interval)
            setResult()
        },1000)
    }
}

function nextStep(bolean){
    if(bolean){
        document.getElementById('correct').classList.remove('opened')           
        game.blocked = false
        game.flipped = 0
    }
    else {
        game.first.el.classList.remove('flipped')
        game.second.el.classList.remove('flipped')
        document.getElementById('error').classList.remove('opened')
        game.blocked = false
        game.flipped = 0
    }
    
    console.log(bolean)
}

function initAll(){
    crono_interval = setInterval(function(){
        game.crono = game.crono + 1;
    },1000)
    createEls()
    setEls()
    initGame()
    setEvents()
}

function setResult(){
    date = new Date()
    day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate()
    month = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1)
    year = date.getFullYear()
    hours = date.getHours() < 10 ? "0"+date.getHours() : date.getHours()
    minutes = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()
    seconds = date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds()

    date = day + "/" + month + "/" + year
    hours = hours + ":" + minutes + ":" + seconds 

    accuracy = ((game.itens.length / game.answered.length)*100).toFixed(2)+"%"
    crono = game.crono

    db = firebase.database()
    ext = document.getElementById('input_ext').value

    db.ref('Jogo da Memoria/Github'+game.project_index+"/"+ext).set({
        attempts: game.answered.length,
        accuracy: accuracy,
        date: date,
        hour: hours,
        crono: crono
    })        
    document.getElementById('text_result').innerHTML = "Você usou " + game.answered.length + " tentativas<br>Demorou " + crono + " segundos para finalizar<br>A sua precisão foi de " + accuracy

}

function countDown(){
    count_el = document.createElement('count')
    count_el.setAttribute('id','count')
    count_el.innerHTML = game.count_down
    document.getElementById('table').append(count_el)
    count_interval = setInterval(function(){
        if(game.count_down > 1){
            game.count_down = game.count_down - 1;
            count_el.innerHTML = game.count_down;
        }
        else {
            game.count_down = game.count_down - 1;
            count_el.innerHTML = "VAI!"
        }
        if(game.count_down == -1){
            clearInterval(count_interval)
            count_el.style.display = 'none'
        }

        count_el.classList.add('pulse')
        setTimeout(function(){
            count_el.classList.remove('pulse')
        },300)
    },1000)
}

function toggleGoals(){
    goal_list = document.querySelector('#goal-list')
    if(goal_list.classList.value.indexOf("closed") > -1){
        goal_list.classList.remove("closed")
    }
    else {
        goal_list.classList.add("closed")
    }
}

function updateGoals(){
    goal_itens = document.querySelectorAll('.goal-item')
    for(i = 0; i < goal_itens.length; i++){
        if(goal_itens[i].innerText == game.first.el.innerText){
            goal_itens[i].classList.add('checked')
        }
    }
}

function closeGoals(){
    goal_list = document.querySelector('#goal-list')
    goal_list.classList.add("closed")
}

window.onload = function(){
    initAll()
}