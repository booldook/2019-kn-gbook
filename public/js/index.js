var config = {
  apiKey: "AIzaSyB10OGY0LJ8r9cg6dITLx4W1WjgY3F_m0E",
  authDomain: "booldook-gbook.firebaseapp.com",
  databaseURL: "https://booldook-gbook.firebaseio.com",
  projectId: "booldook-gbook",
  storageBucket: "booldook-gbook.appspot.com",
  messagingSenderId: "572731860757"
};
firebase.initializeApp(config);

/***** 전역변수 설정 *****/
var log = console.log;
var auth = firebase.auth();
var db = firebase.database();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var ref = null;
var user = null;

/***** Auth *****/
$("#login_bt").on("click", function(){
  auth.signInWithPopup(googleAuth);
  //auth.signInWithRedirect(googleAuth);
});
$("#logout_bt").on("click", function(){
  auth.signOut();
});

auth.onAuthStateChanged(function(result){
  if(result) {
    user = result;
    var email = '<img src="'+result.photoURL+'" style="width:24px;border-radius:50%;"> '+result.email;
    $("#login_bt").hide();
    $("#logout_bt").show();
    $("#user_email").html(email);
  }
  else {
    user = null;
    $("#login_bt").show();
    $("#logout_bt").hide();
    $("#user_email").html('');
  }
});

/***** Database *****/
init();
function init() {
  ref = db.ref("root/gbook");
  ref.on("child_added", onAdded);
}
function onAdded(data){
  var k = data.key;
  var v = data.val();
  var d = new Date(v.wdate);
  var month = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  var date = String(d.getFullYear()).substr(2)+"년 "+month[d.getMonth()]+zeroAdd(d.getDate())+"일 "+zeroAdd(d.getHours())+":"+zeroAdd(d.getMinutes())+":"+zeroAdd(d.getSeconds());
  var html = '<ul id="'+k+'" data-uid="'+v.uid+'" class="gbook">';
  html += '<li>'+v.uname+' ('+v.email+') | '+date+'</li>';
  html += '<li>'+v.content+'</li>';
  html += '<li>icon</li>';
  html += '</ul>';
  $(".gbooks").prepend(html);
}

function zeroAdd(n) {
  if(n<10) return "0"+n;
  else return n;
}

$("#save_bt").on("click", function(){
  var $content = $("#content");
  if($content.val() == "") {
    alert("내용을 입력하세요.");
    $content.focus();
  }
  else {
    ref = db.ref("root/gbook");
    ref.push({
      email: user.email,
      uid: user.uid,
      uname: user.displayName,
      content: $content.val(),
      wdate: Date.now()
    }).key;
    $content.val('');
  }
});
