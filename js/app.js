// create a new scene
let gameScene = new Phaser.Scene("Game");
let stopButton;

// load assets
gameScene.preload = function () {
  // load images
  this.load.image("BG", "assets/BG.png");
  this.load.image("earth", "assets/earth.png");
  this.load.image("moon", "assets/moon.png");
  this.load.image("sun", "assets/sun.png");
  this.load.image("stopButton", "assets/buttons/stop.png");
  this.load.image("playButton", "assets/buttons/play.png");
  //   load audio
  this.load.audio("bgMusic", "assets/audio/background.mp3");
  this.load.audio("endMusic", "assets/audio/stop.wav");
};

// called once after the preload ends
gameScene.create = function () {
  // create bg sprite
  this.BG = this.add.sprite(0, 0, "BG");
  this.BG.setOrigin(0, 0);

  // display images
  this.sun = this.add.sprite(600, 100, "sun");
  this.earth = this.add.sprite(600, 550, "earth");
  this.moon = this.add.sprite(600, 550, "moon");

  // scaling
  // this.sun.setScale(0.5);
  this.earth.setScale(0.5);
  this.moon.setScale(0.3);

  //   set moon origin
  this.moon.setOrigin(-0.5);

  // Set initial rotation angle for the moon
  this.moonAngle = 0;

  // Sun rotation tween
  this.sunRotationTween = this.tweens.add({
    targets: this.sun,
    angle: { value: 360, duration: 70000, ease: "Linear", repeat: -1 },
  });

  // Earth rotation tween
  this.earthRotationTween = this.tweens.add({
    targets: this.earth,
    angle: { value: 360, duration: 40000, ease: "Linear", repeat: -1 },
  });

  // Create a tween to make the moon orbit the earth
  this.moonRotationTween = this.tweens.add({
    targets: this.moon,
    angle: { value: 360, duration: 10000, ease: "Linear", repeat: -1 },
  });

  //   play music
  this.bgMusic = this.sound.add("bgMusic", { loop: true });
  this.endMusic = this.sound.add("endMusic", { loop: false });
  this.bgMusic.play();

  //   stop button
  stopButton = this.add.image(600, 850, "stopButton");
  stopButton.setScale(0.5);
  stopButton.setInteractive(); // Make the button interactive

  // Add a click event listener to stop the moon rotation
  stopButton.on("pointerdown", () => {
    let angle = 0;
    let msg = '';
    // disable stop button
    stopButton.disableInteractive();
    // Pause the moon rotation tween
    this.moonRotationTween.pause();
    this.earthRotationTween.pause();
    this.sunRotationTween.pause();
    this.bgMusic.stop();
    this.endMusic.play();

    // Angle of Moon
    angle = Math.round(this.moon.angle);
    console.log("Moon Angle: ", angle);
    if (angle < 50 && angle > 40) {
      msg = "Full Moon Eclipse"
    }else{
      msg = "No Moon Eclipse"
    }
    // Show the dialog
    showDialog(this, msg);
  });
};
function showDialog(scene, msg) {
  // Create a background for the message
  const dialogBackground = scene.add.graphics();
  dialogBackground.fillStyle(0x33333, 0.9); // Gray with 80% opacity
  dialogBackground.fillRect(300, 200, 600, 300);

  // Create a message
  const messageText = scene.add.text(600, 300, msg, {
    fontSize: "24px",
    color: "#ffffff",
    align: "center",
  });
  messageText.setOrigin(0.5);

  // Create a "Play Again" button
  const playAgainButton = scene.add.image(600, 400, "playButton");
  playAgainButton.setScale(0.5);
  playAgainButton.setInteractive();
  playAgainButton.on("pointerdown", () => {
    // Enable the stop button
    stopButton.setInteractive();
    // Resume the moon rotation tween
    scene.moonRotationTween.resume();
    scene.earthRotationTween.resume();
    scene.sunRotationTween.resume();
    scene.bgMusic.play();
    // Remove the dialog elements
    dialogBackground.destroy();
    messageText.destroy();
    playAgainButton.destroy();
  });
}

// set the configuration of the game
let config = {
  type: Phaser.AUTO,
  width: 1200,
  height: 960,
  scene: gameScene,
};

// create a new game, pass the configuration
let game = new Phaser.Game(config);
