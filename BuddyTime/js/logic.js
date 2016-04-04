global_friends_list = [];

function reloadPage(isDelete) {
    console.log("We have reloaded the page");
    setTimeout(function() {
        console.log('Finally working.');
        if (isDelete) {
            // alert('Hemanth');
        }
        location.reload(true);
    }, 0);
    console.log("sandeep has reloaded the page");
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

function addNewFriend() {

    var place = $("#add_frnd_city").val();
    var name = $("#add_frnd_name").val();

    cordinate_url = "https://maps.googleapis.com/maps/api/geocode/json?&address=" + place;
    var loc_str = 'no where';

    $.ajax({
        type: "GET",
        url: cordinate_url,
        success: function(data) {
            if (data['status'] == 'OK') {

                //alert(place+","+name);

                var locations = data['results'][0]['geometry']['location']
                loc_str = (locations['lat'] + ',' + locations['lng']);
                var new_friend = {
                    "place": place,
                    "name": name,
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
                //alert(localStorage['friends_list']);
                reloadPage();

            } else {
                console.log("Unable to locate a city name");
                alert("Cannot locate " + place);

            }
        }
    });
}

function get_time_using_place(loc_str) {

    var my_url = "https://maps.googleapis.com/maps/api/timezone/json?location=" + loc_str + "&timestamp=1331161200&key=AIzaSyCfYRuTlmH6qSh6Vfo54vEK4uSMMjKOZHE";
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
        div_string = "<div class=\"col-sm-2 name_cards\"><span name=\"deleteButton\" class=\"glyphicon glyphicon-remove pull-right\" id=\"sandeep\" style=\"padding-top: 5%;\"></span><div class=\"card card-block \"><h3 class=\"card-title\">Sandeep Srivastav</h3><h4 class=\"caption\">New York</h4><h3 class=\"card-text\">1:45 AM</h3></div></div>"

        for (key in global_friends_list) {

            var loc_str = global_friends_list[key]['location'];
            var name = global_friends_list[key]['name'];
            var place = global_friends_list[key]['place'];
            var k = global_friends_list[key]['offset_epoch'];

            var time = get_foreign_time(k * 1000);
            var div_string2 = div_string;


            div_string2 = div_string2.replace("Sandeep Srivastav", name);
            div_string2 = div_string2.replace("New York", place);
            div_string2 = div_string2.replace("1:45 AM", time);
            //console.log(div_string2);
            $('#friends').append(div_string2);


            console.log("we have updated the time");

        }

    }, 25000);


}

function add_friends() {

    if (localStorage["friends_list"] ==  null)
    {
        localStorage.setItem("friends_list","[{\"name\": \"Sandeep Srivastav\",\"place\": \"Hyderabad\",\"location\": \"17.385044,78.486671\"}]");
    } 
    
    global_friends_list = JSON.parse(localStorage['friends_list']);
    var friends = global_friends_list.length;
    
    div_string = "<div class=\"col-sm-2 name_cards\"><span name=\"deleteButton\" class=\"glyphicon glyphicon-remove pull-right\" id=\"sandeep\" style=\"padding-top: 5%;\"></span><div class=\"card card-block \"><h3 class=\"card-title\">Sandeep Srivastav</h3><h4 class=\"caption\">New York</h4><h3 class=\"card-text\">1:45 AM</h3></div></div>"

    for (var key in global_friends_list) {
        var loc_str = global_friends_list[key]['location'];
        var name = global_friends_list[key]['name'];
        var place = global_friends_list[key]['place'];

        var d = new Date();
        
        var my_url = "https://maps.googleapis.com/maps/api/timezone/json?location=" + loc_str + "&timestamp=" + d.getTime() / 1000 + "&key=AIzaSyCfYRuTlmH6qSh6Vfo54vEK4uSMMjKOZHE";
        
        (function(name, place, key) {
            $.ajax({
                type: "GET",
                url: my_url,
                //async: false,
                success: function(data) {
                    if (!data.hasOwnProperty('errorMessage')) {

                        var k = data['dstOffset'] + data['rawOffset'];
                        console.log("Adding for " + global_friends_list[key]['name']);
                        global_friends_list[key]['offset_epoch'] = k;

                        var time = get_foreign_time(k * 1000);
                        var div_string2 = div_string;
                        
                        if (global_friends_list.hasOwnProperty(key)) {
                            div_string2 = div_string2.replace("Sandeep Srivastav", name);
                            div_string2 = div_string2.replace("New York", place);
                            div_string2 = div_string2.replace("1:45 AM", time);
                            $('#friends').append(div_string2);
                        }

                    } else {
                        return -1;
                    }
                },
                error: function(argument) {                    
                }
            });
        })(name, place, key);
    }
    keepRefreshing();
}

function deleteExisitingFriend(argument) {
    
    params = []
    params[0] = $("#del_frnd_name").val();
    params[1] = $("#del_frnd_city").val();

    friends_list = JSON.parse(localStorage['friends_list']);
    var friends = friends_list.length;

    for (key in friends_list) {
        if (friends_list[key]['name'] == params[0] && friends_list[key]['place'] == params[1]) {
            friends_list.splice(key, 1);
            friends = JSON.stringify(friends_list);
            localStorage.removeItem('friends_list');
            localStorage.setItem('friends_list', friends);
            reloadPage(true);
            return;
        }
    }

}

$(window).load(function() {
    add_friends();
    $("#buddy_time").click(reloadPage)
    $("#addNewFriend").click(addNewFriend);
    $("#deleteExisitingFriend").click(deleteExisitingFriend);
    $("#friends").load(keepRefreshing);   

});
