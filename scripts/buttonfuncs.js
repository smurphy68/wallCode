let buttons = Array.from(document.getElementsByClassName('button'));

class Hold {
    constructor(holdID, state="off") {
        this.holdID = holdID;
        this.state = state;
    }

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
        switch (this.state) {
            case (this.state = "off"):
                console.log("[OLD STATE]: " + this.state);
                this.state = "start";
                console.log("[NEW STATE]: " + this.state);
                break
            case (this.state = "start"):
                console.log("[OLD STATE]: " + this.state);
                this.state = "route";
                console.log("[NEW STATE]: " + this.state);
                break
            case (this.state = "route"):
                console.log("[OLD STATE]: " + this.state);
                this.state = "foot";
                console.log("[NEW STATE]: " + this.state);
                break
            case (this.state = "foot"):
                console.log("[OLD STATE]: " + this.state);
                this.state = "end";
                console.log("[NEW STATE]: " + this.state);
                break
            case (this.state = "end"):
                console.log("[OLD STATE]: " + this.state);
                this.state = "off";
                console.log("[NEW STATE]: " + this.state);
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
        let hold = Holds[e.target.innerHTML]
        hold.changeState()
    })
})
