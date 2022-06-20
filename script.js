const wordEl = document.getElementById('word');
const wrongLettersEl = document.getElementById('wrongLetters');
const playAgainBtn = document.getElementById('playAgainButton');
const popup = document.getElementById('popup-container');
const notification = document.getElementById('notification-container');
const finalMessage = document.getElementById('finalMessage');
const livesCnt = document.getElementById('livesCnt');
const figureParts = document.querySelectorAll('.figure-part');

let entireWords = []; //오픈 api 사용 google에 random word api 검색 --> 함수 만들어줘야함
let targetWord = '';
let correctLetters = [];
let wrongLetters = [];
let lives = 6;

// [get Random Words and set target word]
const getRandomWord = async () => {
    const res = await fetch('https://random-word-api.herokuapp.com/all'); // res 는 result 줄임말  fetch: 서버에게 요청 default : get
    const data = await res.json(); // json : 문자 기반의 데이터 표준 포맷, 경량의 데이터 교환 형식!! -> 속성-값 쌍 || 키-값 쌍으로 이루어진 데이터 객체를 전달하기 위해 인간이 읽을 수 있는 텍스트를 사용하는 개방형 표준 포맷
    entireWords = data; // 모든 단어 가져오기 entireWords에 재할당
    targetWord =  entireWords[Math.floor(Math.random() * entireWords.length)]; // [인덱스] Math.floor: 소수점 버림 Math.random : 1 아래 수 중 랜덤 값 가져옴 랜덤 쓸때 외워두면 좋음.
}
// 중요! async await fetch, json(오래걸림)가 끝날때까지 아래 애들은 기다린다. 가져오지도 않았는데 실행되면 곤란 에러


// [show hidden word]
const displayWord = () => {
    wordEl.innerHTML = `
    ${targetWord
        .split('')
        .map(letter => `
        <span class="letter">
        ${correctLetters.includes(letter) ? letter :''}
        </span>
        `).join('')
    }
    `
    //[게임 정답을 맞추면 팝업창 띄우기]
    const innerWord = wordEl.innerText.replace(/\n/g, ''); // regular expression 줄여서 regex 라고 함.  \n은 줄바꿈 표시, g는 처음부터 끝까지 다 봐라
    if (innerWord === targetWord) {
        finalMessage.innerText = `Congrats! You won :)`
        popup.style.display = 'flex';
    }

}

//.split '' 나눠서 배열 생성, .map 돌면서 하나씩 배열을 만든다 includes 포함하면 true, 삼항연산자
// template literal 백틱 `` : 스트링안에서 연산 가능 `블라블라 ${1+1}` 하면 블라블라 2 사용해서 / '' 이건 문자열
//.join('') : 문자들이 배열로 되어있기 때문에 문자열로 만들어줘야 함 배열로 꺼내면 '이 붙어서 나옴.

// 함수형 프로그래밍 처음에 시작할 프로그램 묶음.
const init = async () => {
    await getRandomWord(); // 단어 만들고 다음거 실행하기 위해 async await
    displayWord();
}

init();

// [life counter]
const lifeCounter = ()=>{
    if(lives === 6) {
        return `❤️❤️❤️❤️❤️❤️`
    } else if (lives === 5 ) {
        return `❤️❤️❤️❤️❤️`
    } else if (lives === 4 ) {
        return `❤️❤️❤️❤️`
    } else if (lives === 3 ) {
        return `❤️❤️❤️`
    } else if (lives === 2 ) {
        return `❤️❤️`
    } else if (lives === 1) {
        return `❤️`
    } else {
        return ``
    }
}

// [update the wrong letters]
const updateWrongLettersEl = () => {
    //[display wrong letters]
    wrongLettersEl.innerHTML  = `
    ${wrongLetters.length > 0 ? '<p>Wrong</p>' : ''}
    ${wrongLetters.map(letter => `${letter}`)}
    `


    //[display parts]
    figureParts.forEach((part, idx) => {
            const errors = wrongLetters.length;
            if(idx < errors) {
                part.style.display = 'block';
            } else {
                part.style.display = 'none';
            }
        })  //forEach는 map과 비슷한데 배열을 만드는게 아니라 할 거 한다 더 자유로운 느낌
        
        // decrease life
        lives -= 1;
        livesCnt.innerHTML = `lives : ${lifeCounter()}`

        //check if lost
        if(wrongLetters.length === figureParts.length) {
            finalMessage.innerText = `You lost :( the answer was ${targetWord}`
            popup.style.display = 'flex';
        }
}

// show notification 
const showNotification = msg => {
    notification.innerText = msg;
    notification.classList.add('show'); 

    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000)
}

window.addEventListener('keydown', e => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {
        const letter = e.key;

        if (targetWord.includes(letter)) {
            // 맞았을 때
            if (!correctLetters.includes(letter)) {
                //이미 맞힌 단어가 아니라면
                correctLetters.push(letter);
                displayWord();
            } else {
                showNotification(`You have already used ${letter.toUpperCase()}`)
            }
        } else {
            //틀렸을 때
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);
                updateWrongLettersEl();
            } else {
                showNotification(`You have already used ${letter.toUpperCase()}`)
            }
        }
    }
})

// restart game and play agian
playAgainBtn.addEventListener('click', () => {
    // reinitialize vars
    correctLetters.splice(0);
    wrongLetters.splice(0);

    targetWord = entireWords[Math.floor(Math.random() * entireWords.length)];

    displayWord();
    updateWrongLettersEl();
    
    lives = 6;
    livesCnt.innerText = `
    lives : ${lifeCounter()}
    `

    popup.style.display = 'none';
})  

//splice slice 공부하기