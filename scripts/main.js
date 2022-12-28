const submit = document.querySelector('.btn'),
    container = document.querySelector('.container')
    heading = document.querySelector('h1');

class Joke {
    constructor() {
        this.text;
    }

    getData() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://api.chucknorris.io/jokes/random', true);
            xhr.onload = function() {
                if(this.status === 200) {
                    resolve(this.response);
                } else {
                    reject();
                }
            }
            xhr.send(); 
        })
    }

    async createJoke() {
        return await this.getData().then(response => {
            this.text = JSON.parse(response).value;
        });
    }
}

class UI {
    constructor() {
        this.jokes = [];
        this.numOfJokes = document.querySelector('#numberOfJokes').value;
        this.unorderedList = document.querySelector('ul');
    }

    async displayJokes() {
        await this.generateJokeList();
        this.unorderedList.innerHTML = '';
        this.jokes.forEach(joke => {
            const listItem = document.createElement('li');
            const listItemText = document.createTextNode(joke);
            listItem.appendChild(listItemText);
            this.unorderedList.appendChild(listItem);
        });
    }

    async generateJokeList() {
        if(!this.numOfJokes) {
            this.jokes.push('No jokes to be displayed!');
            new Alert('Please enter the number of jokes you want. Between 1 and 5.');
            return;
        }

        for(let i = 0; i < this.numOfJokes; i++) {
            const jokeObj = new Joke();
            await jokeObj.createJoke();
            this.jokes.push(jokeObj.text);
        }
    }
}

class Alert {
    constructor(message) {
        this.message = message;
        this.msgEl;
        this.displayMessage();
        this.selfDestruct();
    }

    displayMessage() {
        this.msgEl = document.createElement('div');
        const msgPara = document.createElement('p');
        const msgContent = document.createTextNode(this.message);
        this.msgEl.classList = 'error alert';

        msgPara.appendChild(msgContent);
        this.msgEl.appendChild(msgPara);

        insertAfter(container, heading, this.msgEl);

        function insertAfter(parent, target, el) {
            parent.insertBefore(el, target.nextSibling);
        }
    }

    selfDestruct() {
        setTimeout(() => {
            this.msgEl.remove();
        }, 2500)
    }
}

submit.addEventListener('click', async (e) => {
    e.preventDefault();
    const ui = new UI();
    
    await ui.displayJokes();
});