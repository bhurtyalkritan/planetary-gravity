var stars = []; // Global array to hold stars
        var canvas = document.getElementById("particles-js");
        var c = canvas.getContext("2d");

        canvas.width = window.innerWidth - 20;
        canvas.height = window.innerHeight - 100;

        var simMinWidth = 20.0;
        var cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
        var simWidth = canvas.width / cScale;
        var simHeight = canvas.height / cScale;

        function cX(pos) {
            return pos.x * cScale;
        }

        function cY(pos) {
            return canvas.height - pos.y * cScale;
        }

        var gravity = { x: 0.0, y: -9.81 * 5 }; 
        var timeStep = 1.0 / 60.0;

        var balls = []; 

        function addBall() {
            var newBall = {
                radius: 0.2,
                pos: { x: Math.random() * 5 + 1, y: Math.random() * 5 + 1 },
                vel: { x: (Math.random() - 0.5) * 20, y: (Math.random() - 0.5) * 20 },
                mass: 1
            };
            balls.push(newBall);
        }

        function draw() {
            c.clearRect(0, 0, canvas.width, canvas.height);
            drawStars();
            balls.forEach(function(ball) {
                c.fillStyle = "#FFFFFF";
                c.beginPath();
                c.arc(cX(ball.pos), cY(ball.pos), cScale * ball.radius, 0, 2 * Math.PI);
                c.fill();
            });
        }

        
        function checkBallCollision(ball1, ball2) {
            var dx = ball2.pos.x - ball1.pos.x;
            var dy = ball2.pos.y - ball1.pos.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            return distance < ball1.radius + ball2.radius;
        }

        function resolveBallCollision(ball1, ball2) {
            var dx = ball2.pos.x - ball1.pos.x;
            var dy = ball2.pos.y - ball1.pos.y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance === 0) return; 

            var nx = dx / distance;
            var ny = dy / distance;

            var overlap = (ball1.radius + ball2.radius) - distance;
            ball1.pos.x -= nx * overlap / 2;
            ball1.pos.y -= ny * overlap / 2;
            ball2.pos.x += nx * overlap / 2;
            ball2.pos.y += ny * overlap / 2;

            var tempVelX = ball1.vel.x;
            var tempVelY = ball1.vel.y;
            ball1.vel.x = ball2.vel.x;
            ball1.vel.y = ball2.vel.y;
            ball2.vel.x = tempVelX;
            ball2.vel.y = tempVelY;
        }

        function addMovingStars(numberOfStars) {
            for (let i = 0; i < numberOfStars; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 1, // Stars size between 1 and 3
                    velocityX: (Math.random() - 0.5) * 0.5, // Horizontal velocity
                    velocityY: (Math.random() - 0.5) * 0.5 // Vertical velocity
                });
            }
        }

        function updateStars() {
            stars.forEach(star => {
                star.x += star.velocityX;
                star.y += star.velocityY;

                // Wrap around the canvas edges
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;
            });
        }

        function drawStars() {
            stars.forEach(star => {
                c.fillStyle = "#FFFFFF"; // Star color
                c.beginPath();
                c.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                c.fill();
            });
        }

        function simulate() {
            balls.forEach(function(ball, index) {
                // Gravity
                ball.vel.x += gravity.x * timeStep;
                ball.vel.y += gravity.y * timeStep;

                // Motion
                ball.pos.x += ball.vel.x * timeStep;
                ball.pos.y += ball.vel.y * timeStep;

                // Wall collision
                if (ball.pos.x < 0.0 || ball.pos.x > simWidth) {
                    ball.vel.x = -ball.vel.x;
                }
                // Ground collision
                if (ball.pos.y < ball.radius) {
                    ball.pos.y = ball.radius;
                    ball.vel.y = -ball.vel.y;
                }

                // Ball collision
                for (let j = index + 1; j < balls.length; j++) {
                    if (checkBallCollision(ball, balls[j])) {
                        resolveBallCollision(ball, balls[j]);
                    }
                }
            });
        }

        function update() {
            simulate();
            updateStars();
            draw();
            requestAnimationFrame(update);
        }

        function setGravity(planet) {
            var gravities = {
                mercury: -3.7 * 5,
                venus: -8.87 * 5,
                earth: -9.81 * 5,
                mars: -3.71 * 5,
                jupiter: -24.79 * 5,
                saturn: -10.44 * 5,
                uranus: -8.69 * 5,
                neptune: -11.15 * 5,
                sun: -274 * 2
            };
            gravity.y = gravities[planet];
            balls.forEach(function(ball) {
                ball.vel.y = 15.0; 
            });
        }

        function resetSimulation() {
            balls = []; 
        }

        update();
