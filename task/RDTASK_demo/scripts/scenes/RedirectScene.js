export default class RedirectScene extends Phaser.Scene {

    constructor() {
        super("RedirectScene");
    }
    init(data) {

        this.type = data.type;

        this.textColor = '#1C2833';
        this.warnColor = '#943126';

        this.nextObj = this.input.keyboard.addKey('enter');  // Get key object
        this.screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

    }

    create() {
        // add fullscreen button
        fullscreen(this);
        var text = 'Please wait... You are being redirected to a completion page of Prolific'
        this.add.text(this.screenCenterX, 400, text, { fontFamily: 'Comic Sans MS', fontSize: '30px', fontStyle: '', color: this.textColor, aligh: 'center' }).setOrigin(0.5);

        if (this.type === 'fail') {
            window.location.replace("https://app.prolific.co/submissions/complete?cc=FFFAILED")
        }
        else {
            window.location.replace("https://app.prolific.co/submissions/complete?cc=4CA9FA2C")
        }
    }

    update() {
        if (!window.navigator.onLine) {
            window.confirm("You turned offline!\nPlease check your internet connection and resume by clicking the OK button.\nIMPORTANT: If you force to close the window while you are disconnected from the internet, your results will not be saved.")
        }
        else {
        }
    }

    createExpData() {
        var expData = {
            timeUp: 1
        };
        return expData;
    }


}
