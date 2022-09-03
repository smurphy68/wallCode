let buttons = Array.from(document.getElementsByClassName('button'));

buttons.map( button=> {
    button.addEventListener('click', (e) => {
        let hold = Holds[e.target.innerHTML]
        hold.changeState()
        console.log(hold);
    })
})

class Hold {
    constructor(holdID, state = "") {
        this.holdID = holdID;
        this.state = state;
    }
    changeState() {
        const states = ["start", "route" , "foot", "end", "off"];
        if (this.state = "off") {
            console.log("[OLD STATE]: " + this.state);
            this.state = states[0];
            console.log("[NEW STATE]: " + this.state);
        } else {
            //check old index state
            console.log("[OLD STATE]: " + this.state);
            //get index of current state in states
            index = states.indexOf(this.state);
            //new state == states[index+1]
            this.state = states[index+1];
            console.log("[NEW STATE]: " + this.state);
        }
    }  
}

var Holds = []

for (let i = 0; i < buttons.length; i++) {
    Holds[buttons[i].innerHTML] = new Hold(buttons[i].innerHTML);
}