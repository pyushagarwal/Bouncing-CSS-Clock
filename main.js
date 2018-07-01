(function(){
    window.onload = function(){
        

        // $("#playground").css("height",$(window).height())

        var drawTime = function(){
            let date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();

            let seconds_degree = (360/60 * seconds) - 90;
            $('#second').css('transform',`rotate(${seconds_degree}deg)`);
            
            let minutes_degree = (360/(60*60) * (minutes*60 + seconds)) - 90;
            $('#minute').css('transform',`rotate(${minutes_degree}deg)`);
            
            let hours_degree = (360/(12 * 60 * 60)* (hours*60*60 + minutes*60 + seconds)) - 90;
            $('#hour').css('transform',`rotate(${hours_degree}deg)`);

        };

        setInterval(drawTime, 1000);
        drawTime();

        $("#scale_control").on("input", function(event){
            $("#clock").css("transform",`scale(${event.target.value})`);
        });

        
        

        var startx, starty, starttime;
        var isMouseDown = false;

        const playground_width = $("#playground").width();
        const playground_height = $("#playground").height();
        const diameter = parseInt($("#clock").css("width").replace("px",""));
        
        var old_speed_x, old_speed_y;
        
        $("#playground").on("mousedown", function(event){
            if(!isMouseDown){
                
                clock_old_x = $("#clock").css("left");
                clock_old_y = $("#clock").css("top");
                $("#clock").css("left",clock_old_x)
                .css("right",clock_old_y)

                isMouseDown = true;
                startx = event.screenX;
                starty = event.screenY;
                starttime = new Date().getTime();
            }
        });

        var findDirection = function(dx, dy){
            var down = true, right = true;

            if(dx < 0){
                right = false;
            }
            if(dy < 0 ){
                down = false; 
            }

            return {
                right : right,
                down : down
            }
        };
        
        /*This function accepts  2 params:
        dx : velocity along x
        dy : velocity along y 
        */
        var moveObjectWithVelocity = function(speedx, speedy){
            console.log(`dx = ${speedx} dy = ${speedy}`);
            var direction = findDirection(speedx, speedy);

            speedx = speedx < 0 ? speedx *=-1 : speedx;
            speedy = speedy < 0 ? speedy *=-1 : speedy;

            var clock_x = parseInt($("#clock").css("left").replace("px",""))
            var clock_y = parseInt($("#clock").css("top").replace("px",""))
            
            if(direction.right){
                var time_x = (playground_width -diameter -clock_x)/speedx;
            }
            else{
                var time_x = clock_x/speedx;
            }

            if(direction.down){
                var time_y = (playground_height -diameter -clock_y)/speedy;
            }
            else{
                var time_y = clock_y/speedy;
            }
            
            var transition_time = Math.min(time_x, time_y)

            if(direction.right){
                var distance_x = clock_x + transition_time * speedx;
            }
            else{
                var distance_x = clock_x - (transition_time * speedx);
            }

            if(direction.down){
                var distance_y = clock_y + transition_time * speedy;
            }
            else{
                var distance_y = clock_y - (transition_time * speedy);
            }

            console.log(`transition time  ${transition_time/100}s`);
            $("#clock").css("transition",`left ${transition_time/100}s linear, top  ${transition_time/100}s linear`)
                    .css("left", distance_x + "px")
                    .css("top", distance_y + "px" );
            a=true;
        };


        var moveObject = function(event){
            if(!isMouseDown){
                return;
            }
            isMouseDown = false;
            console.log("mouseup");
            var targetx = event.screenX;
            var targety = event.screenY;

            var dx = targetx - startx;
            var dy = targety - starty;

            var endtime = new Date().getTime();
            var timespent = endtime-starttime;

            var speedx = dx/timespent;
            var speedy = dy/timespent;
            old_speed_x = speedx;
            old_speed_y = speedy;

            moveObjectWithVelocity(speedx, speedy);
        }


        var transitioned = {
            left : 0,
            top : 0
        }
        
        var changeDirection = function(event){
            transitioned[event.originalEvent.propertyName] = 1;

            if(transitioned.left == 1 && transitioned.top == 1){
                console.log("both transition complete");
                transitioned.left = transitioned.top = 0;
                var clock_current_x = parseInt($("#clock").css("left").replace("px",""));
                var clock_current_y = parseInt($("#clock").css("top").replace("px",""));

                // console.log(clock_current_x);
                // console.log(clock_current_y);
                if(clock_current_x <= 0 || clock_current_x >= playground_width - diameter){
                    old_speed_x *= -1;
                }
                if(clock_current_y <= 0 || clock_current_y >= playground_height - diameter){
                    old_speed_y *= -1;
                }

                console.log(old_speed_x);
                console.log(old_speed_y);
                moveObjectWithVelocity(old_speed_x, old_speed_y);
                }
        };

        $("#playground").on("mouseup", moveObject);
        $("#playground").on("mouseout", moveObject);
        $("#playground").on("transitionend", changeDirection);
    }
})(this);
