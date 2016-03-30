
    global_friends_list = [];
    function reloadPage() {
        console.log("We have reloaded the page");
        location.reload();
        console.log("We have reloaded the page");
    } 
    function addNewFriend() {
        var str = window.prompt("Enter the Name of the friend and city seperated by a comma\n Ex: Sandeep,Hyderabad India");
        var params = str.split(',');
        console.log(params[1]);

        if (params.length == 2) {
            console.log("You have entered two parameters now let me see if I can get the place for " + params[0]);

            //console.log(get_loc_str(params[1]));

            console.log('Getting time for ' + params[1]);
            var place = params[1];
            cordinate_url = "https://maps.googleapis.com/maps/api/geocode/json?&address=" + place;
            var loc_str = 'no where';
            $.ajax({
                type: "GET",
                url: cordinate_url,
                success: function(data) {
                    if (data['status'] == 'OK') {


                        var locations = data['results'][0]['geometry']['location']
                        loc_str = (locations['lat'] + ',' + locations['lng']);
                        var new_friend = {
                            "place": params[1],
                            "name": params[0],
                            "location": loc_str
                        };

                        var friends = localStorage['friends_list'];
                        if (friends == null) {
                            friends = []
                        } else {
                            console.log(friends);
                            friends = JSON.parse(friends);

                        }
                        friends.push(new_friend)
                        friends = JSON.stringify(friends);
                        console.log(friends);
                        localStorage.removeItem('friends_list');
                        localStorage.setItem('friends_list', friends);
                        console.log(localStorage['friends_list']);

                        reloadPage();


                    } else {
                        console.log("Unable to locate a city name");
                        alert("Cannot locate " + place);

                    }
                }
            });
        } else {
            alert("Please retry adding the friend and adhere to the format");

        }
        

    }
    function get_foreign_time(for_offset) {
        var local = new Date();

        offset_epoch = local.getTimezoneOffset() * 60000;
        local_epoch = local.getTime();
        gmt_epoch = local_epoch + offset_epoch;

        foreign_epoch = gmt_epoch + for_offset;
        var foreign = new Date(foreign_epoch);
        //console.log(foreign.toTimeString().slice(0, 5));
        return (foreign.toTimeString().slice(0, 5));
    }
    function get_time_using_place(loc_str) {

        var my_url = "https://maps.googleapis.com/maps/api/timezone/json?location=" + loc_str + "&timestamp=1331161200&key=AIzaSyCfYRuTlmH6qSh6Vfo54vEK4uSMMjKOZHE";
        //console.log("abhirami   " + my_url);
        $.ajax({
            type: "GET",
            url: my_url,
            async: false,
            success: function(data) {
                //console.log("e pennale   " + my_url);
                if (!data.hasOwnProperty('errorMessage')) {
                    var k = data['dstOffset'] + data['rawOffset'];
                    //console.log("akalai");
                    //console.log(get_foreign_time(k));
                    return get_foreign_time(k);

                } else {
                    //console.log("akalai");
                    console.log("Unable to locate a city name");
                    //alert("Cannot locate " + place);
                    return -1;
                }
            },
            error: function(argument) {
                console.log("suresh");
            }
        });

    }        
    function keepRefreshing() {
        setInterval(function function_name(argument) {

            var times = document.getElementById("friends");
            times.innerHTML = '';
            div_string = "<div class=\"col-sm-2 name_cards\"><div class=\"card card-block \"><h3 class=\"card-title\">Sandeep Srivastav</h3><h4 class=\"caption\">New York</h4><h3 class=\"card-text\">1:45 AM</h3></div></div>"

            for (key in global_friends_list) {

                var loc_str = global_friends_list[key]['location'];
                var name  = global_friends_list[key]['name'];
                var place = global_friends_list[key]['place'];
                var k = global_friends_list[key]['offset_epoch'];

                var time = get_foreign_time(k*1000);
                var div_string2 = div_string;


                div_string2 = div_string2.replace("Sandeep Srivastav", name);
                div_string2 = div_string2.replace("New York", place);
                div_string2 = div_string2.replace("1:45 AM", time);
                //console.log(div_string2);
                $('#friends').append(div_string2);


                console.log("we have updated the time");
                
            }
            
        },25000);

        
    }
    
    function add_friends() {
        global_friends_list = JSON.parse(localStorage['friends_list']);
        var friends = global_friends_list.length;
        //console.log('You have ' + friends + ' friends');
        //console.log("sandeep brrrrrrrra  "+friends_list[0]['location']);
        div_string = "<div class=\"col-sm-2 name_cards\"><div class=\"card card-block \"><h3 class=\"card-title\">Sandeep Srivastav</h3><h4 class=\"caption\">New York</h4><h3 class=\"card-text\">1:45 AM</h3></div></div>"

        //console.log(div_string);
        //console.log('~~~~~~~~~~~~~~~~~~~~');
        //console.log(friends_list);
        for (var key in global_friends_list) {
            //console.log(friends_list[key]);
            var loc_str = global_friends_list[key]['location'];
            var name  = global_friends_list[key]['name'];
            var place = global_friends_list[key]['place'];

                           
                    
            //console.log("Processing "+key+" name "+name+" place "+place);            
            var d = new Date();
            //console.log("time is buddy "+d.getTime());
            //console.log("Pakala    "+loc_str);
            var my_url = "https://maps.googleapis.com/maps/api/timezone/json?location=" + loc_str + "&timestamp="+d.getTime()/1000+"&key=AIzaSyCfYRuTlmH6qSh6Vfo54vEK4uSMMjKOZHE";
        //console.log("abhirami   " + my_url);

        (function(name, place,key) {
            $.ajax({
            type: "GET",
            url: my_url,
            //async: false,
            success: function(data) {
                //console.log("e pennale   " + my_url);
                if (!data.hasOwnProperty('errorMessage')) {
        
                    var k = data['dstOffset'] + data['rawOffset'];
                    console.log("Adding for "+global_friends_list[key]['name']);
                    global_friends_list[key]['offset_epoch'] = k;     
        
                    //console.log("dst offset is + "+data['dstOffset']);
                    //console.log("raw offset is + "+data['rawOffset']);
                    //console.log("akalai");
                    //console.log("emaindo ma sandeep ki "+(k));
                    var time = get_foreign_time(k*1000);
                    var div_string2 = div_string;
            //var time = get_time_using_place(friends_list[key]['loc_str']);
            //console.log("Hello Sir this is the key "+key    +" this is the name "+friends_list[key]['name']+" this is the place "+friends_list[key]['place']);
            if (global_friends_list.hasOwnProperty(key)) {
                div_string2 = div_string2.replace("Sandeep Srivastav", name);
                div_string2 = div_string2.replace("New York", place);
                div_string2 = div_string2.replace("1:45 AM", time);
                //console.log(div_string2);
                $('#friends').append(div_string2);
            }

                } else {
                    //console.log("akalai");
                    //console.log("Unable to locate a city name");
                    //alert("Cannot locate " + place);
                    return -1;
                }
            },
            error: function(argument) {
                //console.log("suresh");
            }
        });
        })(name, place,key);

        
            
        }
        keepRefreshing();
    }
    function deleteExisitingFriend(argument) {
        console.log("Sad that you have delete a friend");
         var str = window.prompt("To delete enter the Name of the friend and city seperated by a comma\n Ex: Sandeep,Hyderabad India");
        var params = str.split(',');
        console.log(params[1]);
        if (params.length == 2) {
            console.log("I see fire and I will burn "+params[0]);
            friends_list = JSON.parse(localStorage['friends_list']);
            var friends = friends_list.length;

            for (key in friends_list) {
                if (friends_list[key]['name'] == params[0] && friends_list[key]['place'] == params[1]){
                    friends_list.splice(key, 1);
                    friends = JSON.stringify(friends_list);
                    console.log(friends);
                    localStorage.removeItem('friends_list');
                    localStorage.setItem('friends_list', friends);
                    console.log(localStorage['friends_list']);
                    reloadPage();
                    return;
                }
            }
            console.log("Cannot find "+params[0]+" who is at "+params[1]);
            alert("Cannot find "+params[0]+" who is at "+params[1]);

        } else {
            console.log("Please be careful");
            alert("Cannot Process your input");
        }

    }       

$(window).load(function() {
    add_friends();
    $("#buddy_time").click(reloadPage)
    $("#addNewFriend").click(addNewFriend);
    $("#deleteExisitingFriend").click(deleteExisitingFriend);
    $("#friends").load(keepRefreshing);
        
});
    