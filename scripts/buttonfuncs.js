let buttons = Array.from(document.getElementsByClassName('button'));

class Hold {
    constructor(holdID, colour="", state="off") {
        this.holdID = holdID;
        this.state = state;
        this.colour = colour
    }

    newChangeState() {
        const newStateStateIndex = this.possibleStates.findIndex((item) => item === this.state) + 1;
        this.state = newStateStateIndex < this.possibleStates.length
            ? this.possibleStates[newStateStateIndex]
            : this.possibleStates[0];
            
        }  

    changeState() {
        switch (this.state) {
            case (this.state = "off"):
                //console.log(`[OLD STATE]: ${this.holdID} is ${this.state}.`);
                this.state = "start";
                this.colour = "green"
                console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break
            case (this.state = "start"):
                //console.log(`[OLD STATE]: ${this.holdID} is a ${this.state} hold.`);
                this.state = "route";
                this.colour = "blue"
                console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break
            case (this.state = "route"):
                //console.log(`[OLD STATE]: ${this.holdID} is a ${this.state} hold.`);
                this.state = "foot";
                this.colour = "aqua"
                console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break
            case (this.state = "foot"):
                //console.log(`[OLD STATE]: ${this.holdID} is a ${this.state} hold.`);
                this.state = "end";
                this.colour = "red"
                console.log(`[NEW STATE]: ${this.holdID} is a ${this.state} hold.`);
                break
            case (this.state = "end"):
                //console.log(`[OLD STATE]: ${this.holdID} is a ${this.state} hold.`);
                this.state = "off";
                this.colour = ""
                console.log(`[NEW STATE]: ${this.holdID} is ${this.state}.`);
                break
        }
    }  
}

let Holds = []

for (let i = 0; i < buttons.length; i++) {
    Holds[buttons[i].innerHTML] = new Hold(buttons[i].innerHTML);
}

buttons.map( button=> {
    button.addEventListener('click', (e) => {
        let hold = Holds[e.target.innerHTML];
        hold.changeState();
        button.style.backgroundColor = hold.colour;
        button.style.opacity = 0.5;
    })
})

let resetButton = document.getElementById("reset");
resetButton.addEventListener('click', (e) => {
    console.log("clicked")
    for (const [key, value] of Object.entries(Holds)) {
        //console.log(key, value.state)
        value.state = "off"
        value.colour = ""
        //console.log(key, value.state)
        //break
    } 
})