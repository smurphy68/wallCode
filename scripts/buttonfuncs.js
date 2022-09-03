let buttons = Array.from(document.getElementsByClassName('button'));

class Hold {
    constructor(holdID, colour="", state="off") {
        this.holdID = holdID;
        this.state = state;
        this.colour = colour
    }
<<<<<<< HEAD

    newChangeState() {
        const newStateStateIndex = this.possibleStates.findIndex((item) => item === this.state) + 1;
        this.state = newStateStateIndex < this.possibleStates.length
            ? this.possibleStates[newStateStateIndex]
            : this.possibleStates[0];
            
        }  

        changeState() {
        //const states = ["start", "route" , "foot", "end", "off"];
        // this was failing because switch statements check for true values and all strings with a value are truthy
        // so "start" == true, "route" == true, etc
=======
    changeState() {
>>>>>>> SM-Testing
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

let resetButton = Array.from(document.getElementsByClassName('rest-button'));

resetButton.map ( button=> {
    button.addEventListener('click', (e) => {
        
    })
})
