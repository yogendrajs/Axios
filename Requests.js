var axios = require('axios');
var fs = require('fs');
var readline = require('readline-sync');

fs.exists('availableCourses.json', (exists) => {
    if(exists){
      jsonData = fs.readFileSync('availableCourses.json');
      object = JSON.parse(jsonData);
      var courses_dic = object['availableCourses'];
      var index = 0;
      for (var i of courses_dic){
        console.log(index + " " + i.id + " "+ i.name);
        index++;
      }
      var input = readline.question("Enter your input: ");
      var id = courses_dic[input]['id'];
      console.log("id of your course is " + id + "\n");
      var link = "http://saral.navgurukul.org/api/courses/"+ id +"/exercises";
      axios
      .get(link)
      .then(function (response) {
        var apiData = response.data;
        var data = apiData.data;
        var indexById = 0;
        if (data.length != 0){
          // console.log(data); // dataa of exercises
          if (data.length != 0 )
          var count = 0;
          for (var j of data){
            // console.log(j);
            console.log(indexById +" " + j.name);
            if (j['childExercises'].length != 0){
              count++;
              var counter1 = 0;
              for (var k of j['childExercises']){
                console.log("            " + indexById + "." + counter1 + " " +k['name']);
                counter1++;
              }
            }indexById++;
          }
          var input1 = readline.question("Enter your input to find childExercise: ");
          var dotCounter = 0;
          for (var ind of input1){
            // console.log(ind);
            if (ind == "."){
              dotCounter++;
            }
          }if (dotCounter == 0){
            var slugL = (data[input1]['slug']);
          }else if (dotCounter > 0) {
            var inputList = input1.split(".");
            var slugL = (data[inputList[0]]['childExercises'][inputList[1]]['slug']);
          }
          var slugLink = "http://saral.navgurukul.org/api/courses/75/exercise/getBySlug?slug="+slugL;
          axios
          .get(slugLink)
          .then(function (response) {
            console.log(response.data);
          })
          .catch((error) => console.log("course", error.response.status))
        }else{
          console.log("Sorry! It has no content");
        }
      })
      .catch((error) => console.log("course", error.response.status))
    }
    else{
      axios
        .get('http://saral.navgurukul.org/api/courses')
        .then(function (response) {
          var data = response.data;
          jsonData = JSON.stringify(data);
          fs.writeFileSync('availableCourses.json', jsonData);
        })
        .catch((error) => console.log("course", error.response.status))
    }
});
