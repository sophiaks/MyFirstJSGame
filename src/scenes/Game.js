import Phaser from '../lib/phaser.js'
import Carrot from '../game/Carrot.js'

export default class Game extends Phaser.Scene {
    constructor()
    {
        super('game')
        
    }
    cursors
    preload()
    { 
        this.load.image('background', './assets/bg_layer1.png')
        this.load.image('platform', 'assets/ground_grass.png')
        this.load.image('bunny-stand', 'assets/bunny1_stand.png')
        this.load.image('carrot', 'assets/carrot.png')
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create(){
        this.add.image(240, 320, 'background').setScrollFactor(1,0)
        this.platforms  = this.physics.add.staticGroup()
        this.carrots = this.physics.add.group({
            classType: Carrot
        })
        
        this.physics.add.collider(this.platforms, this.carrots)

        for (let i = 0; i < 5; ++i) {
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i

            const platform = this.platforms.create(x, y, 'platform')
            platform.scale =  0.5

            const body = platform.body
            body.updateFromGameObject()
        }

        this.player = this.physics.add.sprite(240, 320, 'bunny-stand').setScale(0.5)
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false

        this.cameras.main.startFollow(this.player)
        //this.cameras.main.setDeadzone(this.scale.width * 1.5)

        this.physics.add.collider(this.platforms, this.player)
        this.physics.add.collider(this.platforms, this.carrots)

        //const carrot = new Carrot(this, 240, 320, 'carrot')
        //this.add.existing(carrot)
    }


    update(t, dt) {

            this.platforms.children.iterate(child => {
                const platform = child
                const scrollY = this.cameras.main.scrollY
                if (platform.y >= scrollY + 700) {
                    platform.y = scrollY - Phaser.Math.Between(50, 100)
                    platform.body.updateFromGameObject()
                    this.addCarrotAbove(platform)
                }
            })

        const touchingDown = this.player.body.touching.down

        if (touchingDown) {
            this.player.setVelocityY(-300)
        }

        if (this.cursors.left.isDown && !touchingDown){
            this.player.setVelocityX(-200)
        }
        else if (this.cursors.right.isDown && !touchingDown)
        {
            this.player.setVelocityX(200)
        }
        else {
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)
        t


    }

    horizontalWrap(sprite){
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth) {
            sprite.x = gameWidth + halfWidth
        }
        else if (sprite.x > gameWidth + halfWidth) {
            sprite.x = -halfWidth
        }
    }

    addCarrotAbove(sprite) {
        const y = sprite.y - sprite.displayHeight
        const carrot = this.carrots.get(sprite.x, y, 'carrot')
        this.add.existing(carrot)

        carrot.body.setSize(carrot.width, carrot.height)

        return carrot
    }
}